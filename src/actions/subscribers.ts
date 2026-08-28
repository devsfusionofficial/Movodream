'use server'

import { revalidatePath } from 'next/cache'
import { connectDB } from '@/lib/db'
import { Subscriber } from '@/models/Subscriber'
import { MarketingCampaign } from '@/models/MarketingCampaign'
import { sendMarketingBroadcast } from '@/lib/mailer'

export type SyncEmailInput = {
  subject: string
  preheader?: string
  template?: string
  icon?: string
  theme?: string
  heading?: string
  description?: string
  imageUrl?: string
  imageKey?: string
  ctaText?: string
  ctaUrl?: string
  infoBoxTitle?: string
  infoBoxContent?: string
}

export async function listSubscribers() {
  await connectDB()
  return Subscriber.find().sort({ createdAt: -1 }).lean()
}

export async function createSubscriber(email: string) {
  try {
    await connectDB()
    const existing = await Subscriber.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      if (existing.status === 'unsubscribed') {
        existing.status = 'active'
        existing.subscribedAt = new Date()
        await existing.save()
        revalidatePath('/admin/subscribers')
        return { success: true, subscriber: JSON.parse(JSON.stringify(existing)) }
      }
      return { success: false, error: 'This email is already subscribed.' }
    }
    const subscriber = await Subscriber.create({ email: email.toLowerCase().trim(), status: 'active' })
    revalidatePath('/admin/subscribers')
    return { success: true, subscriber: JSON.parse(JSON.stringify(subscriber)) }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to create subscriber' }
  }
}

export async function deleteSubscriber(id: string) {
  try {
    await connectDB()
    await Subscriber.findByIdAndDelete(id)
    revalidatePath('/admin/subscribers')
    revalidatePath('/admin/marketing-subscribers')
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete subscriber' }
  }
}

export async function syncSubscriberEmail(input: SyncEmailInput) {
  try {
    await connectDB()
    const activeSubscribers = await Subscriber.find({ status: 'active' }).select('email').lean()
    const subscriberEmails = activeSubscribers.map((s) => s.email)

    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')
    const themeHex = input.theme === 'pink' ? '#ff7294' : input.theme === 'purple' ? '#6c4bd8' : input.theme === 'dark' ? '#2b123d' : '#d71789'

    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${input.subject || 'Movodream Update'}</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f8f6f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#21182a;">
          <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #ebe6ee; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
            
            <!-- Header Banner -->
            <div style="background-color: ${themeHex}14; padding: 32px 24px; text-align: center; border-bottom: 1px solid #f0edf1;">
              <div style="display: inline-block; width: 48px; height: 48px; background-color: ${themeHex}; border-radius: 12px; line-height: 48px; text-align: center; color: #ffffff; font-size: 22px; font-weight: bold; margin-bottom: 16px;">
                M
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #21182a;">${input.heading || input.subject || 'Movodream Marketing Update'}</h1>
              ${input.description ? `<p style="margin-top: 12px; font-size: 15px; line-height: 1.6; color: #554a5c; white-space: pre-line;">${input.description}</p>` : ''}
              
              ${input.imageUrl ? `<div style="margin-top: 20px;"><img src="${input.imageUrl}" alt="Banner" style="max-width: 100%; border-radius: 12px; max-height: 300px; object-fit: cover;" /></div>` : ''}
              
              ${input.ctaText && input.ctaUrl ? `
                <div style="margin-top: 24px;">
                  <a href="${input.ctaUrl}" target="_blank" style="display: inline-block; background-color: ${themeHex}; color: #ffffff; padding: 12px 28px; border-radius: 10px; font-weight: 700; text-decoration: none; font-size: 14px;">
                    ${input.ctaText}
                  </a>
                </div>
              ` : ''}
            </div>

            ${input.infoBoxTitle ? `
              <div style="margin: 20px 24px; padding: 16px; background-color: ${themeHex}0A; border-left: 4px solid ${themeHex}; border-radius: 8px;">
                <strong style="display: block; font-size: 14px; color: #21182a;">${input.infoBoxTitle}</strong>
                <span style="font-size: 13px; color: #687075; margin-top: 4px; display: block; line-height: 1.5;">${input.infoBoxContent || ''}</span>
              </div>
            ` : ''}

            <!-- Professional Company Footer -->
            <div style="background-color: #21182a; padding: 32px 24px; color: #ffffff; text-align: center;">
              <h2 style="margin: 0; font-size: 18px; font-weight: 800; letter-spacing: 1px; color: #ffffff;">MOVODREAM</h2>
              <p style="margin: 4px 0 20px 0; font-size: 12px; color: #b8afc2;">AI Travel Companion for Modern Explorers</p>

              <!-- Navigation Links -->
              <div style="margin-bottom: 20px; font-size: 13px;">
                <a href="${baseUrl}/about" target="_blank" style="color: #ff7294; text-decoration: none; margin: 0 10px; font-weight: 600;">About Us</a> |
                <a href="${baseUrl}/support" target="_blank" style="color: #ff7294; text-decoration: none; margin: 0 10px; font-weight: 600;">Support</a> |
                <a href="${baseUrl}/privacy-policy" target="_blank" style="color: #ff7294; text-decoration: none; margin: 0 10px; font-weight: 600;">Privacy Policy</a> |
                <a href="${baseUrl}/terms" target="_blank" style="color: #ff7294; text-decoration: none; margin: 0 10px; font-weight: 600;">Terms</a> |
                <a href="${baseUrl}/careers" target="_blank" style="color: #ff7294; text-decoration: none; margin: 0 10px; font-weight: 600;">Careers</a>
              </div>

              <!-- Social Links -->
              <div style="margin-bottom: 20px;">
                <a href="https://x.com/movodream" target="_blank" style="display: inline-block; width: 32px; height: 32px; background: rgba(255,255,255,0.1); border-radius: 50%; line-height: 32px; color: #ffffff; text-decoration: none; margin: 0 5px; font-size: 12px; font-weight: bold;">X</a>
                <a href="https://instagram.com/movodream" target="_blank" style="display: inline-block; width: 32px; height: 32px; background: rgba(255,255,255,0.1); border-radius: 50%; line-height: 32px; color: #ffffff; text-decoration: none; margin: 0 5px; font-size: 12px; font-weight: bold;">IG</a>
                <a href="https://linkedin.com/company/movodream" target="_blank" style="display: inline-block; width: 32px; height: 32px; background: rgba(255,255,255,0.1); border-radius: 50%; line-height: 32px; color: #ffffff; text-decoration: none; margin: 0 5px; font-size: 12px; font-weight: bold;">IN</a>
              </div>

              <div style="border-top: 1px solid rgba(255,255,255,0.12); padding-top: 16px; font-size: 11px; color: #9c91a5; line-height: 1.6;">
                <p style="margin: 0;">Email Sent by <strong>Movodream Technologies</strong> • Support: support@movodream.com</p>
                <p style="margin: 6px 0 0 0;">New Delhi, India • You opted into marketing updates from Movodream.</p>
                <p style="margin: 6px 0 0 0;">© ${new Date().getFullYear()} Movodream. All rights reserved.</p>
              </div>
            </div>

          </div>
        </body>
      </html>
    `

    // Persist campaign in database
    await MarketingCampaign.create({
      subject: input.subject || 'Movodream Update',
      preheader: input.preheader || '',
      template: input.template || 'custom',
      icon: input.icon || 'mail',
      theme: input.theme || 'pink',
      heading: input.heading || '',
      description: input.description || '',
      imageUrl: input.imageUrl || '',
      imageKey: input.imageKey || '',
      ctaText: input.ctaText || '',
      ctaUrl: input.ctaUrl || '',
      infoBoxTitle: input.infoBoxTitle || '',
      infoBoxContent: input.infoBoxContent || '',
      status: 'synced',
    })

    let sentCount = 0
    try {
      const result = await sendMarketingBroadcast({
        subject: input.subject || 'Movodream Update',
        text: `${input.heading || input.subject}\n\n${input.description || ''}\n\nVisit: ${baseUrl}`,
        html: htmlBody,
        subscriberEmails,
      })
      sentCount = result.count
    } catch (smtpErr) {
      console.warn('SMTP Broadcast error:', smtpErr)
      revalidatePath('/admin/marketing-subscribers')
      return {
        success: true,
        sentCount: 0,
        warning: `Campaign saved! (Email dispatch paused: SMTP authentication failed for ${process.env.SMTP_USER || 'support@movodream.com'}. Please check your SMTP password / App Password in .env).`,
      }
    }

    revalidatePath('/admin/marketing-subscribers')
    return { success: true, sentCount }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to sync marketing email' }
  }
}

export async function sendSubscriberCampaign(input: { subject: string; text?: string; html?: string; blocks?: any[] }) {
  try {
    await connectDB()
    const activeSubscribers = await Subscriber.find({ status: 'active' }).select('email').lean()
    const subscriberEmails = activeSubscribers.map((s) => s.email)

    const result = await sendMarketingBroadcast({
      subject: input.subject,
      text: input.text || input.subject,
      html: input.html || `<p>${input.text}</p>`,
      subscriberEmails,
    })

    return { success: true, count: result.count, sentCount: result.count }
  } catch (err) {
    return { success: false, count: 0, sentCount: 0, error: err instanceof Error ? err.message : 'Failed to send subscriber campaign' }
  }
}
