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

function escapeHtml(str?: string | null): string {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function getContactConfirmationAttachments() {
  const attachments = []

  const logoPath = path.join(process.cwd(), 'public', 'assets', 'images', 'logo2.png')
  if (fs.existsSync(logoPath)) {
    attachments.push({
      filename: 'movodream-logo.png',
      path: logoPath,
      cid: 'movodream-logo',
    })
  }

  const checkPath = path.join(process.cwd(), 'public', 'assets', 'icons', 'campaign', 'check.png')
  if (fs.existsSync(checkPath)) {
    attachments.push({
      filename: 'check.png',
      path: checkPath,
      cid: 'check-badge',
    })
  }

  const socialDir = path.join(process.cwd(), 'public', 'assets', 'icons', 'social')
  const socialIcons = [
    { filename: 'x.png', path: path.join(socialDir, 'x.png'), cid: 'social-x' },
    { filename: 'instagram.png', path: path.join(socialDir, 'instagram.png'), cid: 'social-instagram' },
    { filename: 'linkedin.png', path: path.join(socialDir, 'linkedin.png'), cid: 'social-linkedin' },
    { filename: 'facebook.png', path: path.join(socialDir, 'facebook.png'), cid: 'social-facebook' },
    { filename: 'youtube.png', path: path.join(socialDir, 'youtube.png'), cid: 'social-youtube' },
  ]
  for (const icon of socialIcons) {
    if (fs.existsSync(icon.path)) {
      attachments.push(icon)
    }
  }

  return attachments
}

export function generateContactConfirmationHtml(
  input: { name: string; email: string; phone: string; message?: string },
  siteUrl: string = 'https://movodream.com'
) {
  const currentYear = new Date().getFullYear()

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no" />
  <title>Thank you for contacting Movodream</title>
  <style type="text/css">
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: #f4f6f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    @media only screen and (max-width: 620px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      .content-padding {
        padding: 28px 20px !important;
      }
      .details-padding {
        padding: 16px 16px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; -webkit-font-smoothing: antialiased;">
  <!-- Preheader text -->
  <div style="display: none; font-size: 1px; color: #f4f6f9; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    We have successfully received your enquiry. Our team will get back to you within 24–48 hours.
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f6f9; padding: 36px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06); border: 1px solid #e5e7eb;" class="email-container">
          
          <!-- Header (Logo) -->
          <tr>
            <td align="center" style="padding: 32px 24px 28px 24px; background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
              <a href="${siteUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="cid:movodream-logo" alt="Movodream" width="168" height="35" style="display: block; width: 168px; height: auto; max-height: 38px; margin: 0 auto; border: 0;" />
              </a>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td class="content-padding" style="padding: 40px 40px 36px 40px; background-color: #ffffff;">
              
              <!-- Checkmark Badge -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto 20px auto;">
                <tr>
                  <td align="center" style="width: 60px; height: 60px; border-radius: 50%; background-color: #fdf2f8; border: 2px solid #fbcfe8; text-align: center; vertical-align: middle;">
                    <img src="cid:check-badge" alt="✓" width="30" height="30" style="display: block; margin: 0 auto; width: 30px; height: 30px;" />
                  </td>
                </tr>
              </table>

              <!-- Main Title -->
              <h1 style="margin: 0 0 24px 0; font-size: 26px; font-weight: 800; color: #111827; text-align: center; letter-spacing: -0.5px;">
                Thank You!
              </h1>

              <!-- Greeting & Body -->
              <p style="margin: 0 0 14px 0; font-size: 15px; font-weight: 600; color: #1f2937; line-height: 1.5;">
                Hi ${escapeHtml(input.name)},
              </p>
              <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.65; color: #4b5563;">
                Thank you for contacting Movodream. We have successfully received your enquiry.
              </p>
              <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 1.65; color: #4b5563;">
                Our team is reviewing your request and will get back to you within 24–48 hours.
              </p>

              <!-- Submission Details Box -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 14px; margin: 0 0 28px 0;">
                <tr>
                  <td class="details-padding" style="padding: 22px 24px;">
                    
                    <!-- Box Header -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px;">
                      <tr>
                        <td width="26" valign="middle" style="padding-right: 8px;">
                          <div style="width: 20px; height: 20px; line-height: 20px; border-radius: 50%; background-color: #d71789; color: #ffffff; text-align: center; font-size: 12px; font-weight: 800; font-family: sans-serif;">!</div>
                        </td>
                        <td valign="middle">
                          <span style="font-size: 14px; font-weight: 700; color: #9d174d; letter-spacing: -0.2px;">Your Submission Details</span>
                        </td>
                      </tr>
                    </table>

                    <!-- Details Rows -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size: 13px; line-height: 1.6; color: #374151;">
                      <tr>
                        <td width="75" valign="top" style="padding-bottom: 8px; font-weight: 600; color: #6b7280;">Name:</td>
                        <td valign="top" style="padding-bottom: 8px; color: #111827; font-weight: 500;">${escapeHtml(input.name)}</td>
                      </tr>
                      <tr>
                        <td width="75" valign="top" style="padding-bottom: 8px; font-weight: 600; color: #6b7280;">Email:</td>
                        <td valign="top" style="padding-bottom: 8px; color: #111827; font-weight: 500;">${escapeHtml(input.email)}</td>
                      </tr>
                      <tr>
                        <td width="75" valign="top" style="padding-bottom: 8px; font-weight: 600; color: #6b7280;">Phone:</td>
                        <td valign="top" style="padding-bottom: 8px; color: #111827; font-weight: 500;">${escapeHtml(input.phone)}</td>
                      </tr>
                      ${input.message ? `
                      <tr>
                        <td width="75" valign="top" style="padding-top: 6px; font-weight: 600; color: #6b7280;">Message:</td>
                        <td valign="top" style="padding-top: 6px;">
                          <div style="background-color: #ffffff; border: 1px solid #f9a8d4; border-radius: 8px; padding: 12px 14px; color: #1f2937; font-size: 13px; line-height: 1.55; white-space: pre-wrap;">${escapeHtml(input.message)}</div>
                        </td>
                      </tr>
                      ` : ''}
                    </table>

                  </td>
                </tr>
              </table>

              <!-- Outro & Signature -->
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.65; color: #4b5563;">
                We appreciate your interest and look forward to assisting you.
              </p>
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">
                Warm regards,
              </p>
              <p style="margin: 0; font-size: 15px; font-weight: 700; color: #111827;">
                Team Movodream
              </p>

            </td>
          </tr>

          <!-- Footer (Dark Navy) -->
          <tr>
            <td style="padding: 34px 24px; background-color: #0b1320; text-align: center;">
              
              <!-- Copyright -->
              <p style="margin: 0 0 12px 0; font-size: 12px; color: #94a3b8;">
                © ${currentYear} MovoDream. All rights reserved.
              </p>

              <!-- Quick Links -->
              <p style="margin: 0 0 22px 0; font-size: 12px; color: #64748b;">
                <a href="${siteUrl}/privacy-policy" target="_blank" style="color: #d71789; text-decoration: none; font-weight: 500;">Privacy</a>
                &nbsp;&nbsp;•&nbsp;&nbsp;
                <a href="${siteUrl}/support" target="_blank" style="color: #d71789; text-decoration: none; font-weight: 500;">Support</a>
                &nbsp;&nbsp;•&nbsp;&nbsp;
                <a href="${siteUrl}/terms" target="_blank" style="color: #d71789; text-decoration: none; font-weight: 500;">Terms</a>
              </p>

              <!-- Social Icons -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto 22px auto;">
                <tr>
                  <td style="padding: 0 6px;" align="center">
                    <a href="https://x.com/movodream" target="_blank" style="display: inline-block; width: 34px; height: 34px; background-color: rgba(255,255,255,0.08); border-radius: 50%; text-align: center; text-decoration: none; line-height: 34px;">
                      <img src="cid:social-x" alt="X" width="16" height="16" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; border: 0;" />
                    </a>
                  </td>
                  <td style="padding: 0 6px;" align="center">
                    <a href="https://www.instagram.com/movodreamofficial/" target="_blank" style="display: inline-block; width: 34px; height: 34px; background-color: rgba(255,255,255,0.08); border-radius: 50%; text-align: center; text-decoration: none; line-height: 34px;">
                      <img src="cid:social-instagram" alt="Instagram" width="16" height="16" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; border: 0;" />
                    </a>
                  </td>
                  <td style="padding: 0 6px;" align="center">
                    <a href="https://www.linkedin.com/company/movodream" target="_blank" style="display: inline-block; width: 34px; height: 34px; background-color: rgba(255,255,255,0.08); border-radius: 50%; text-align: center; text-decoration: none; line-height: 34px;">
                      <img src="cid:social-linkedin" alt="LinkedIn" width="16" height="16" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; border: 0;" />
                    </a>
                  </td>
                  <td style="padding: 0 6px;" align="center">
                    <a href="https://www.facebook.com/movodreamofficial/" target="_blank" style="display: inline-block; width: 34px; height: 34px; background-color: rgba(255,255,255,0.08); border-radius: 50%; text-align: center; text-decoration: none; line-height: 34px;">
                      <img src="cid:social-facebook" alt="Facebook" width="16" height="16" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; border: 0;" />
                    </a>
                  </td>
                  <td style="padding: 0 6px;" align="center">
                    <a href="https://youtube.com/@movodream" target="_blank" style="display: inline-block; width: 34px; height: 34px; background-color: rgba(255,255,255,0.08); border-radius: 50%; text-align: center; text-decoration: none; line-height: 34px;">
                      <img src="cid:social-youtube" alt="YouTube" width="16" height="16" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; border: 0;" />
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Assistance Note -->
              <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.5;">
                For assistance, contact our support team at <a href="mailto:support@movodream.com" style="color: #d71789; text-decoration: underline;">support@movodream.com</a>
              </p>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendContactConfirmationEmail(
  input: { name: string; email: string; phone: string; message?: string },
  recipientOverride?: string
): Promise<boolean> {
  const transport = getTransporter()
  if (!transport) {
    console.error('sendContactConfirmationEmail: SMTP transport unavailable')
    return false
  }

  const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'support@movodream.com'
  const from = `"Movodream" <${fromAddress.trim()}>`
  const replyTo = 'support@movodream.com'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://movodream.com'
  const recipient = recipientOverride || input.email

  const attachments = getContactConfirmationAttachments()

  const text = [
    `Hi ${input.name},`,
    '',
    'Thank you for contacting Movodream. We have successfully received your enquiry.',
    'Our team is reviewing your request and will get back to you within 24–48 hours.',
    '',
    'Your Submission Details:',
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
    input.message ? `Message: ${input.message}` : '',
    '',
    'We appreciate your interest and look forward to assisting you.',
    '',
    'Warm regards,',
    'Team Movodream',
    '',
    `Support: ${replyTo}`,
    `Website: ${siteUrl}`,
  ]
    .filter(Boolean)
    .join('\n')

  const html = generateContactConfirmationHtml(input, siteUrl)

  try {
    await transport.sendMail({
      from,
      to: `"${input.name}" <${recipient}>`,
      replyTo,
      subject: 'Thank you for contacting Movodream',
      text,
      html,
      attachments,
    })
    return true
  } catch (err) {
    console.error('Failed to send contact confirmation email to user:', err)
    return false
  }
}

export async function sendContactNotification(input: { name: string; email: string; phone: string; message?: string }) {
  const transport = getTransporter()
  if (!transport) return false

  const to = process.env.SUPPORT_NOTIFICATION_EMAIL?.trim() || process.env.SUPPORT_EMAIL?.trim() || 'support@movodream.com'
  const fromAddress = process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER || 'support@movodream.com'
  const from = `"Movodream Enquiries" <${fromAddress.trim()}>`

  const text = [
    `New contact form submission:`,
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
    '',
    `Message:`,
    input.message || '(no message)',
  ].join('\n')

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111827;">
      <div style="border-bottom: 2px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px;">
        <span style="font-size: 20px; font-weight: 800; color: #d71789; letter-spacing: -0.5px;">MOVODREAM</span>
        <span style="display: inline-block; margin-left: 12px; font-size: 12px; font-weight: 600; background-color: #fdf2f8; color: #9d174d; padding: 4px 10px; border-radius: 9999px; border: 1px solid #fbcfe8;">New Contact Enquiry</span>
      </div>
      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
        <table style="width: 100%; font-size: 14px; line-height: 1.6; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #6b7280; font-weight: 600; width: 80px;">Name:</td>
            <td style="padding: 6px 0; color: #111827; font-weight: 600;">${escapeHtml(input.name)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6b7280; font-weight: 600;">Email:</td>
            <td style="padding: 6px 0;"><a href="mailto:${escapeHtml(input.email)}" style="color: #d71789; text-decoration: none; font-weight: 600;">${escapeHtml(input.email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6b7280; font-weight: 600;">Phone:</td>
            <td style="padding: 6px 0; color: #111827; font-weight: 500;">${escapeHtml(input.phone)}</td>
          </tr>
          ${input.message ? `
          <tr>
            <td style="padding: 10px 0 6px 0; color: #6b7280; font-weight: 600; vertical-align: top;">Message:</td>
            <td style="padding: 10px 0 6px 0;">
              <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; color: #1f2937; font-size: 13px; line-height: 1.5; white-space: pre-wrap;">${escapeHtml(input.message)}</div>
            </td>
          </tr>
          ` : ''}
        </table>
      </div>
      <div style="margin-bottom: 24px;">
        <a href="mailto:${escapeHtml(input.email)}?subject=${encodeURIComponent('Re: Your enquiry with Movodream')}" style="display: inline-block; background-color: #d71789; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          Reply to ${escapeHtml(input.name)}
        </a>
      </div>
      <div style="font-size: 12px; color: #9ca3af; border-top: 1px solid #f1f5f9; padding-top: 14px;">
        This notification was generated automatically from the contact form at Movodream.
      </div>
    </div>
  `

  await transport.sendMail({
    from,
    to,
    replyTo: input.email,
    subject: `New contact form submission — ${input.name}`,
    text,
    html,
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
  heading?: string
  preheader?: string
  icon?: string
  theme?: string
  imageUrl?: string
  ctaText?: string
  ctaUrl?: string
  infoBoxTitle?: string
  infoBoxContent?: string
}) {
  const transport = getTransporter()
  if (!transport) {
    return { success: false as const, error: 'Email server configuration is missing.' }
  }

  const from = process.env.EMAIL_FROM_ADDRESS || 'support@movodream.com'
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://movodream.com').replace(/\/+$/, '')
  const currentYear = new Date().getFullYear()

  const themeColors: Record<string, string> = {
    magenta: '#d71789',
    pink: '#ff7294',
    purple: '#6c4bd8',
    dark: '#2b123d',
  }
  const themeHex = themeColors[input.theme || 'magenta'] || '#d71789'
  const iconSlug = (input.icon || 'mail').toLowerCase()

  const attachments: any[] = []

  const logoPath = path.join(process.cwd(), 'public', 'assets', 'images', 'logo2.png')
  if (fs.existsSync(logoPath)) {
    attachments.push({
      filename: 'movodream-logo.png',
      path: logoPath,
      cid: 'movodream-logo',
    })
  }

  const iconPath = path.join(process.cwd(), 'public', 'assets', 'icons', 'campaign', `${iconSlug}.png`)
  const defaultIconPath = path.join(process.cwd(), 'public', 'assets', 'icons', 'campaign', 'mail.png')
  if (fs.existsSync(iconPath)) {
    attachments.push({ filename: `${iconSlug}.png`, path: iconPath, cid: 'campaign-icon' })
  } else if (fs.existsSync(defaultIconPath)) {
    attachments.push({ filename: 'mail.png', path: defaultIconPath, cid: 'campaign-icon' })
  }

  const socialDir = path.join(process.cwd(), 'public', 'assets', 'icons', 'social')
  const socialIcons = [
    { filename: 'x.png', path: path.join(socialDir, 'x.png'), cid: 'social-x' },
    { filename: 'instagram.png', path: path.join(socialDir, 'instagram.png'), cid: 'social-instagram' },
    { filename: 'linkedin.png', path: path.join(socialDir, 'linkedin.png'), cid: 'social-linkedin' },
    { filename: 'facebook.png', path: path.join(socialDir, 'facebook.png'), cid: 'social-facebook' },
    { filename: 'youtube.png', path: path.join(socialDir, 'youtube.png'), cid: 'social-youtube' },
  ]
  for (const item of socialIcons) {
    if (fs.existsSync(item.path)) {
      attachments.push(item)
    }
  }

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(input.subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  ${input.preheader ? `
  <div style="display: none; font-size: 1px; color: #f4f6f9; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${escapeHtml(input.preheader)}
  </div>` : ''}

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f6f9; padding: 36px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06); border: 1px solid #e5e7eb;">
          
          <!-- Brand Header -->
          <tr>
            <td align="center" style="padding: 28px 24px; background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
              <a href="${siteUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="cid:movodream-logo" alt="Movodream" width="168" height="35" style="display: block; width: 168px; height: auto; margin: 0 auto; border: 0;" />
              </a>
            </td>
          </tr>

          <!-- Top Feature / Icon Banner -->
          <tr>
            <td align="center" style="background-color: ${themeHex}12; padding: 36px 28px; text-align: center; border-bottom: 1px solid #f0edf1;">
              <div style="display: inline-block; width: 50px; height: 50px; background-color: ${themeHex}; border-radius: 14px; line-height: 50px; text-align: center; margin-bottom: 16px;">
                <img src="cid:campaign-icon" width="24" height="24" alt="${escapeHtml(input.icon || 'mail')}" style="width: 24px; height: 24px; display: inline-block; vertical-align: middle; border: 0;" />
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #111827; letter-spacing: -0.5px; line-height: 1.3;">
                ${escapeHtml(input.heading || input.subject || 'Response to your Movodream Enquiry')}
              </h1>
              ${input.recipientName ? `
              <p style="margin: 12px 0 0 0; font-size: 15px; font-weight: 600; color: #374151;">
                Hi ${escapeHtml(input.recipientName)},
              </p>` : ''}
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding: 36px 36px 28px 36px; background-color: #ffffff;">
              <div style="font-size: 15px; line-height: 1.7; color: #374151; white-space: pre-wrap;">${escapeHtml(input.message)}</div>

              ${input.imageUrl ? `
              <div style="margin-top: 24px;">
                <img src="${input.imageUrl}" alt="Banner" style="max-width: 100%; border-radius: 12px; max-height: 380px; object-fit: cover; box-shadow: 0 4px 16px rgba(0,0,0,0.08); display: block;" />
              </div>` : ''}

              ${input.ctaText && input.ctaUrl ? `
              <div style="margin-top: 32px; text-align: center;">
                <a href="${input.ctaUrl}" target="_blank" style="display: inline-block; background-color: ${themeHex}; color: #ffffff; padding: 13px 32px; border-radius: 10px; font-weight: 700; text-decoration: none; font-size: 14px; box-shadow: 0 4px 14px ${themeHex}40;">
                  ${escapeHtml(input.ctaText)}
                </a>
              </div>` : ''}

              ${input.infoBoxTitle ? `
              <div style="margin-top: 28px; padding: 18px 20px; background-color: ${themeHex}0A; border-left: 4px solid ${themeHex}; border-radius: 8px;">
                <strong style="display: block; font-size: 14px; color: #111827;">${escapeHtml(input.infoBoxTitle)}</strong>
                <div style="font-size: 13px; color: #6b7280; margin-top: 6px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(input.infoBoxContent || '')}</div>
              </div>` : ''}

              <div style="margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 20px;">
                <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">Warm regards,</p>
                <p style="margin: 0; font-size: 15px; font-weight: 700; color: #111827;">Team Movodream</p>
              </div>
            </td>
          </tr>

          <!-- Footer (Dark Navy) -->
          <tr>
            <td style="padding: 32px 24px; background-color: #0b1320; text-align: center;">
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #94a3b8;">
                © ${currentYear} MovoDream. All rights reserved.
              </p>
              <p style="margin: 0 0 20px 0; font-size: 12px; color: #64748b;">
                <a href="${siteUrl}/about" target="_blank" style="color: #d71789; text-decoration: none;">About</a>
                &nbsp;&nbsp;•&nbsp;&nbsp;
                <a href="${siteUrl}/support" target="_blank" style="color: #d71789; text-decoration: none;">Support</a>
                &nbsp;&nbsp;•&nbsp;&nbsp;
                <a href="${siteUrl}/privacy-policy" target="_blank" style="color: #d71789; text-decoration: none;">Privacy</a>
                &nbsp;&nbsp;•&nbsp;&nbsp;
                <a href="${siteUrl}/terms" target="_blank" style="color: #d71789; text-decoration: none;">Terms</a>
              </p>

              <!-- Social Icons -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto 20px auto;">
                <tr>
                  <td style="padding: 0 5px;" align="center">
                    <a href="https://x.com/movodream" target="_blank" style="display: inline-block; width: 32px; height: 32px; background-color: rgba(255,255,255,0.08); border-radius: 50%; text-align: center; text-decoration: none; line-height: 32px;">
                      <img src="cid:social-x" alt="X" width="15" height="15" style="width: 15px; height: 15px; display: inline-block; vertical-align: middle; border: 0;" />
                    </a>
                  </td>
                  <td style="padding: 0 5px;" align="center">
                    <a href="https://www.instagram.com/movodreamofficial/" target="_blank" style="display: inline-block; width: 32px; height: 32px; background-color: rgba(255,255,255,0.08); border-radius: 50%; text-align: center; text-decoration: none; line-height: 32px;">
                      <img src="cid:social-instagram" alt="Instagram" width="15" height="15" style="width: 15px; height: 15px; display: inline-block; vertical-align: middle; border: 0;" />
                    </a>
                  </td>
                  <td style="padding: 0 5px;" align="center">
                    <a href="https://www.linkedin.com/company/movodream" target="_blank" style="display: inline-block; width: 32px; height: 32px; background-color: rgba(255,255,255,0.08); border-radius: 50%; text-align: center; text-decoration: none; line-height: 32px;">
                      <img src="cid:social-linkedin" alt="LinkedIn" width="15" height="15" style="width: 15px; height: 15px; display: inline-block; vertical-align: middle; border: 0;" />
                    </a>
                  </td>
                  <td style="padding: 0 5px;" align="center">
                    <a href="https://www.facebook.com/movodreamofficial/" target="_blank" style="display: inline-block; width: 32px; height: 32px; background-color: rgba(255,255,255,0.08); border-radius: 50%; text-align: center; text-decoration: none; line-height: 32px;">
                      <img src="cid:social-facebook" alt="Facebook" width="15" height="15" style="width: 15px; height: 15px; display: inline-block; vertical-align: middle; border: 0;" />
                    </a>
                  </td>
                  <td style="padding: 0 5px;" align="center">
                    <a href="https://youtube.com/@movodream" target="_blank" style="display: inline-block; width: 32px; height: 32px; background-color: rgba(255,255,255,0.08); border-radius: 50%; text-align: center; text-decoration: none; line-height: 32px;">
                      <img src="cid:social-youtube" alt="YouTube" width="15" height="15" style="width: 15px; height: 15px; display: inline-block; vertical-align: middle; border: 0;" />
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 11px; color: #64748b;">
                Sent directly from <a href="mailto:support@movodream.com" style="color: #d71789; text-decoration: underline;">support@movodream.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  try {
    await transport.sendMail({
      from: `"Movodream Support" <${from}>`,
      to: input.recipientName ? `"${input.recipientName}" <${input.to}>` : input.to,
      replyTo: from,
      subject: input.subject,
      text: input.message,
      html,
      attachments,
    })
    return { success: true as const }
  } catch (err) {
    console.error('Failed to send enquiry reply:', err)
    return { success: false as const, error: err instanceof Error ? err.message : 'Failed to send email' }
  }
}

