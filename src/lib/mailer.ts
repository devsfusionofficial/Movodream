import nodemailer from 'nodemailer'
import path from 'path'
import fs from 'fs'

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null

function getTransporter() {
  if (transporter) return transporter

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null

  const port = Number(SMTP_PORT) || 465
  const isSecure = port === 465

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: isSecure,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
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
    subject: `New application — ${input.jobTitle} — ${input.name}`,
    text: [
      `Role: ${input.jobTitle}`,
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Phone: ${input.phone}`,
      input.location ? `Location: ${input.location}` : null,
      input.experience ? `Experience: ${input.experience}` : null,
      input.qualification ? `Qualification: ${input.qualification}` : null,
      '',
      input.coverLetter || '(no cover letter)',
      '',
      // Links to the admin screen rather than embedding a presigned resume
      // URL. A presigned link expires in 5 minutes, so it was almost always
      // dead by the time anyone opened the email — and it put a
      // no-login-required URL to someone's CV in an inbox that can be
      // forwarded. The admin page requires a session and never goes stale.
      `Resume on file: ${input.resumeFileName}`,
      `View application: ${input.applicationUrl}`,
    ]
      .filter((line) => line !== null)
      .join('\n'),
  })
  return true
}

// Most SMTP providers cap recipients per message — batching keeps each send
// well under that instead of one call with a large BCC list.
const BROADCAST_BATCH_SIZE = 50

export async function sendPostPublishedBroadcast(input: {
  postTitle: string
  postExcerpt?: string
  postUrl: string
  subscriberEmails: string[]
}) {
  const transport = getTransporter()
  if (!transport || input.subscriberEmails.length === 0) return false

  const fromAddress = process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER || 'support@movodream.com'
  const from = `"Movodream" <${fromAddress}>`
  const CONCURRENCY = 5

  for (let i = 0; i < input.subscriberEmails.length; i += CONCURRENCY) {
    const chunk = input.subscriberEmails.slice(i, i + CONCURRENCY)
    await Promise.allSettled(
      chunk.map(async (email) => {
        try {
          await transport.sendMail({
            from,
            to: email,
            subject: `New on the Movodream blog: ${input.postTitle}`,
            text: [
              input.postTitle,
              '',
              input.postExcerpt || '',
              '',
              `Read more: ${input.postUrl}`,
            ].join('\n'),
          })
        } catch (err) {
          console.error(`Failed to send blog notification to ${email}:`, err)
        }
      })
    )
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
}) {
  const transport = getTransporter()
  if (!transport) return { sent: false, count: 0 }
  if (input.subscriberEmails.length === 0) return { sent: true, count: 0 }

  const fromAddress = process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER || 'support@movodream.com'
  const from = `"Movodream" <${fromAddress}>`
  const socialAttachments = input.html?.includes('cid:social-') ? getSocialAttachments() : []
  const campaignAttachments = input.html?.includes('cid:campaign-icon') ? getCampaignIconAttachment(input.campaignIcon) : []
  const attachments = [...socialAttachments, ...campaignAttachments]

  let successCount = 0
  const CONCURRENCY = 5

  for (let i = 0; i < input.subscriberEmails.length; i += CONCURRENCY) {
    const chunk = input.subscriberEmails.slice(i, i + CONCURRENCY)
    await Promise.allSettled(
      chunk.map(async (email) => {
        try {
          await transport.sendMail({
            from,
            to: email,
            subject: input.subject,
            text: input.text,
            html: input.html,
            attachments: attachments.length > 0 ? attachments : undefined,
          })
          successCount++
        } catch (err) {
          console.error(`Failed to send marketing broadcast to ${email}:`, err)
        }
      })
    )
  }
  return { sent: successCount > 0, count: successCount }
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

