import nodemailer from 'nodemailer'
import path from 'path'
import fs from 'fs'

let transporter: any = null

function getTransporter() {
  if (transporter) return transporter

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null

  const port = Number(SMTP_PORT) || 465
  const isSecure = port === 465
  const cleanPass = SMTP_PASS.replace(/^["']|["']$/g, '').trim()

  transporter = nodemailer.createTransport({
    host: SMTP_HOST.trim(),
    port,
    secure: isSecure,
    auth: { user: SMTP_USER.trim(), pass: cleanPass },
    pool: true,
    maxConnections: 3,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    ...(port === 587 ? { tls: { rejectUnauthorized: false } } : {}),
  })
  return transporter
}

export async function sendContactNotification(input: { name: string; email: string; phone: string; message?: string }) {
  const transport = getTransporter()
  if (!transport) return false

  const to = process.env.HR_NOTIFICATION_EMAIL || process.env.SMTP_USER
  const from = process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER

  await transport.sendMail({
    from,
    to,
    replyTo: input.email,
    subject: `New contact form submission — ${input.name}`,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Phone: ${input.phone}`,
      '',
      input.message || '(no message)',
    ].join('\n'),
  })
  return true
}

export async function sendApplicationNotification(input: {
  jobTitle: string
  name: string
  email: string
  phone: string
  location?: string
  experience?: string
  qualification?: string
  coverLetter?: string
  applicationUrl: string
  resumeFileName: string
}) {
  const transport = getTransporter()
  if (!transport) return false

  const to = process.env.HR_NOTIFICATION_EMAIL || process.env.SMTP_USER
  const from = process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER

  await transport.sendMail({
    from,
    to,
    replyTo: input.email,
    subject: `New application: ${input.jobTitle} — ${input.name}`,
    text: [
      `Job: ${input.jobTitle}`,
      `Applicant: ${input.name}`,
      `Email: ${input.email}`,
      `Phone: ${input.phone}`,
      `Location: ${input.location || 'N/A'}`,
      `Experience: ${input.experience || 'N/A'}`,
      `Qualification: ${input.qualification || 'N/A'}`,
      '',
      'Cover Letter:',
      input.coverLetter || '(none)',
      '',
      `Resume: ${input.applicationUrl}`,
    ].join('\n'),
  })
  return true
}

export async function sendPostPublishedBroadcast(input: {
  postTitle: string
  postSlug?: string
  postExcerpt?: string
  postUrl: string
  subscriberEmails: string[]
}) {
  const transport = getTransporter()
  if (!transport || input.subscriberEmails.length === 0) return false

  const from = process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER

  // Send in BCC batches to keep execution fast and protect subscriber privacy
  const BATCH_SIZE = 40
  for (let i = 0; i < input.subscriberEmails.length; i += BATCH_SIZE) {
    const chunk = input.subscriberEmails.slice(i, i + BATCH_SIZE)
    try {
      await transport.sendMail({
        from: `"Movodream" <${from}>`,
        to: from,
        bcc: chunk,
        subject: `New on Movodream: ${input.postTitle}`,
        text: [
          `We just published: ${input.postTitle}`,
          '',
          input.postExcerpt || '',
          '',
          `Read more: ${input.postUrl}`,
        ].join('\n'),
      })
    } catch (err) {
      console.error(`Failed to send blog notification batch:`, err)
    }
  }
  return true
}

function getSocialAttachments() {
  const dir = path.join(process.cwd(), 'public', 'assets', 'icons', 'social')
  const icons = [
    { filename: 'x.png', path: path.join(dir, 'x.png'), cid: 'social-x' },
    { filename: 'instagram.png', path: path.join(dir, 'instagram.png'), cid: 'social-instagram' },
    { filename: 'linkedin.png', path: path.join(dir, 'linkedin.png'), cid: 'social-linkedin' },
    { filename: 'facebook.png', path: path.join(dir, 'facebook.png'), cid: 'social-facebook' },
    { filename: 'youtube.png', path: path.join(dir, 'youtube.png'), cid: 'social-youtube' },
  ]
  return icons.filter((item) => fs.existsSync(item.path))
}

function getCampaignIconAttachment(iconName?: string) {
  const safeName = (iconName || 'mail').toLowerCase()
  const iconPath = path.join(process.cwd(), 'public', 'assets', 'icons', 'campaign', `${safeName}.png`)
  if (fs.existsSync(iconPath)) {
    return [{ filename: `${safeName}.png`, path: iconPath, cid: 'campaign-icon' }]
  }
  const defaultPath = path.join(process.cwd(), 'public', 'assets', 'icons', 'campaign', 'mail.png')
  if (fs.existsSync(defaultPath)) {
    return [{ filename: 'mail.png', path: defaultPath, cid: 'campaign-icon' }]
  }
  return []
}

export async function sendMarketingBroadcast(input: {
  subject: string
  text: string
  html: string
  subscriberEmails: string[]
  campaignIcon?: string
}): Promise<{ sent: boolean; count: number; error?: string }> {
  const transport = getTransporter()
  if (!transport) {
    const errorMsg = 'SMTP transport unavailable. Please verify SMTP_HOST, SMTP_USER, and SMTP_PASS in your deployment environment variables.'
    console.error(errorMsg)
    return { sent: false, count: 0, error: errorMsg }
  }
  if (input.subscriberEmails.length === 0) return { sent: true, count: 0 }

  const fromAddress = process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER || 'support@movodream.com'
  const from = `"Movodream" <${fromAddress.trim()}>`

  // Send in BCC batches (up to 40 per batch) to avoid multiple sequential round-trips
  // that would exceed Vercel serverless function timeouts (10-15s).
  const BATCH_SIZE = 40
  let successCount = 0
  const errors: string[] = []

  for (let i = 0; i < input.subscriberEmails.length; i += BATCH_SIZE) {
    const bccChunk = input.subscriberEmails.slice(i, i + BATCH_SIZE)
    try {
      await transport.sendMail({
        from,
        to: from,
        bcc: bccChunk,
        subject: input.subject,
        text: input.text,
        html: input.html,
      })
      successCount += bccChunk.length
    } catch (err: any) {
      console.error(`Failed to send marketing broadcast chunk (${bccChunk.length} recipients):`, err)
      errors.push(err.message || 'SMTP delivery failed')
    }
  }

  return {
    sent: successCount > 0,
    count: successCount,
    error: errors.length > 0 ? errors.join('; ') : undefined,
  }
}

export async function sendDirectEnquiryReply(input: {
  to: string
  subject: string
  message: string
  recipientName?: string
}) {
  const transport = getTransporter()
  if (!transport) {
    return { success: false as const, error: 'Email server configuration is missing.' }
  }

  const from = process.env.EMAIL_FROM_ADDRESS || 'support@movodream.com'

  try {
    await transport.sendMail({
      from: `"Movodream Support" <${from}>`,
      to: input.to,
      replyTo: from,
      subject: input.subject,
      text: input.message,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #21182a;">
          <div style="margin-bottom: 20px;">
            <span style="font-size: 20px; font-weight: 800; color: #d71789; letter-spacing: -0.5px;">MOVODREAM</span>
          </div>
          <div style="background: #ffffff; border-radius: 12px; border: 1px solid #ebe6ee; padding: 24px; line-height: 1.6; font-size: 15px; color: #21182a; white-space: pre-wrap;">${input.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          <div style="margin-top: 20px; font-size: 12px; color: #857c8b; border-top: 1px solid #f0edf1; padding-top: 16px;">
            <p style="margin: 0 0 4px 0;">This email was sent from <strong>support@movodream.com</strong>.</p>
            <p style="margin: 0;">Movodream • Your Journey, Reimagined.</p>
          </div>
        </div>
      `,
    })
    return { success: true as const }
  } catch (err) {
    console.error('Failed to send enquiry reply:', err)
    return { success: false as const, error: err instanceof Error ? err.message : 'Failed to send email' }
  }
}

