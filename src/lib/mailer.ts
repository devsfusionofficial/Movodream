import nodemailer from 'nodemailer'

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null

function getTransporter() {
  if (transporter) return transporter

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 465,
    secure: true,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
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
  resumeUrl: string
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
      // Presigned, expires in 5 minutes — resend from /admin/applications for
      // a fresh link rather than emailing the raw file as an attachment.
      `Resume (${input.resumeFileName}): ${input.resumeUrl}`,
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

  const from = process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER

  for (let i = 0; i < input.subscriberEmails.length; i += BROADCAST_BATCH_SIZE) {
    const batch = input.subscriberEmails.slice(i, i + BROADCAST_BATCH_SIZE)
    await transport.sendMail({
      from,
      to: from,
      bcc: batch,
      subject: `New on the Movodream blog: ${input.postTitle}`,
      text: [
        input.postTitle,
        '',
        input.postExcerpt || '',
        '',
        `Read more: ${input.postUrl}`,
      ].join('\n'),
    })
  }
  return true
}
