'use server'

import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/auth-guard'
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

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

export async function listSubscribers() {
  await requirePermission('subscribers', ['read'])
  await connectDB()
  const list = await Subscriber.find().sort({ createdAt: -1 }).lean()
  return serialize(list)
}

export async function createSubscriber(email: string) {
  try {
    await requirePermission('subscribers', ['create'])
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
    await requirePermission('subscribers', ['delete'])
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
    await requirePermission('subscribers', ['send'])
    await connectDB()
    const activeSubscribers = await Subscriber.find({ status: 'active' }).select('email').lean()
    const subscriberEmails = activeSubscribers.map((s) => s.email)

    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://movodream-chi.vercel.app')).replace(/\/+$/, '')
    const themeHex = input.theme === 'pink' ? '#ff7294' : input.theme === 'purple' ? '#6c4bd8' : input.theme === 'dark' ? '#2b123d' : '#d71789'
    const iconSlug = (input.icon || 'mail').toLowerCase()

    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${input.subject || 'Movodream Update'}</title>
        </head>
        <body style="margin:0; padding:0; width:100% !important; min-width:100%; background-color:#ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#21182a; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">
          <div style="width:100%; min-width:100%; margin:0; padding:0; background:#ffffff;">
            
            <!-- Header Banner (Full Width) -->
            <div style="width:100%; background-color: ${themeHex}14; padding: 52px 24px; text-align: center; border-bottom: 1px solid #f0edf1; box-sizing: border-box;">
              <div style="max-width: 900px; margin: 0 auto;">
                <div style="display: inline-block; width: 52px; height: 52px; background-color: ${themeHex}; border-radius: 14px; line-height: 52px; text-align: center; margin-bottom: 18px; box-shadow: 0 4px 14px ${themeHex}40; vertical-align: middle;">
                  <img src="${baseUrl}/assets/icons/campaign/${iconSlug}.png" width="26" height="26" alt="${input.icon || 'mail'}" style="width: 26px; height: 26px; display: inline-block; vertical-align: middle; border: 0;" />
                </div>
                <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.02em; color: #21182a; line-height: 1.25;">${input.heading || input.subject || 'Movodream Marketing Update'}</h1>
                ${input.description ? `<p style="margin: 16px auto 0 auto; max-width: 760px; font-size: 16px; line-height: 1.7; color: #554a5c; white-space: pre-line;">${input.description}</p>` : ''}
                
                ${input.imageUrl ? `<div style="margin-top: 28px;"><img src="${input.imageUrl}" alt="Banner" style="max-width: 100%; border-radius: 14px; max-height: 420px; object-fit: cover; box-shadow: 0 6px 24px rgba(0,0,0,0.08);" /></div>` : ''}
                
                ${input.ctaText && input.ctaUrl ? `
                  <div style="margin-top: 32px;">
                    <a href="${input.ctaUrl}" target="_blank" style="display: inline-block; background-color: ${themeHex}; color: #ffffff; padding: 14px 36px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 15px; box-shadow: 0 4px 16px ${themeHex}50;">
                      ${input.ctaText}
                    </a>
                  </div>
                ` : ''}
              </div>
            </div>

            ${input.infoBoxTitle ? `
              <div style="max-width: 900px; margin: 32px auto; padding: 20px 28px; background-color: ${themeHex}0A; border-left: 4px solid ${themeHex}; border-radius: 10px; box-sizing: border-box;">
                <strong style="display: block; font-size: 15px; color: #21182a;">${input.infoBoxTitle}</strong>
                <span style="font-size: 14px; color: #687075; margin-top: 6px; display: block; line-height: 1.6;">${input.infoBoxContent || ''}</span>
              </div>
            ` : ''}

            <!-- Professional Company Footer (Full Width) -->
            <div style="width: 100%; background-color: #21182a; padding: 48px 24px; color: #ffffff; text-align: center; box-sizing: border-box;">
              <div style="max-width: 900px; margin: 0 auto;">
                <h2 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 1.5px; color: #ffffff;">MOVODREAM</h2>
                <p style="margin: 6px 0 24px 0; font-size: 13px; color: #b8afc2;">AI Travel Companion for Modern Explorers</p>

                <!-- Navigation Links -->
                <div style="margin-bottom: 24px; font-size: 14px;">
                  <a href="${baseUrl}/about" target="_blank" style="color: #ff7294; text-decoration: none; margin: 0 12px; font-weight: 600;">About Us</a> |
                  <a href="${baseUrl}/support" target="_blank" style="color: #ff7294; text-decoration: none; margin: 0 12px; font-weight: 600;">Support</a> |
                  <a href="${baseUrl}/privacy-policy" target="_blank" style="color: #ff7294; text-decoration: none; margin: 0 12px; font-weight: 600;">Privacy Policy</a> |
                  <a href="${baseUrl}/terms" target="_blank" style="color: #ff7294; text-decoration: none; margin: 0 12px; font-weight: 600;">Terms</a> |
                  <a href="${baseUrl}/careers" target="_blank" style="color: #ff7294; text-decoration: none; margin: 0 12px; font-weight: 600;">Careers</a>
                </div>

                <!-- Social Links -->
                <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto 24px auto;">
                  <tr>
                    <!-- X (Twitter) -->
                    <td style="padding: 0 6px;" align="center">
                      <a href="https://x.com/movodream" target="_blank" style="display: inline-block; width: 36px; height: 36px; background-color: rgba(255,255,255,0.12); border-radius: 50%; text-align: center; text-decoration: none; line-height: 36px;">
                        <img src="${baseUrl}/assets/icons/social/x.png" width="16" height="16" alt="X" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; border: 0;" />
                      </a>
                    </td>
                    <!-- Instagram -->
                    <td style="padding: 0 6px;" align="center">
                      <a href="https://www.instagram.com/movodreamofficial/" target="_blank" style="display: inline-block; width: 36px; height: 36px; background-color: rgba(255,255,255,0.12); border-radius: 50%; text-align: center; text-decoration: none; line-height: 36px;">
                        <img src="${baseUrl}/assets/icons/social/instagram.png" width="16" height="16" alt="Instagram" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; border: 0;" />
                      </a>
                    </td>
                    <!-- LinkedIn -->
                    <td style="padding: 0 6px;" align="center">
                      <a href="https://www.linkedin.com/company/movodream" target="_blank" style="display: inline-block; width: 36px; height: 36px; background-color: rgba(255,255,255,0.12); border-radius: 50%; text-align: center; text-decoration: none; line-height: 36px;">
                        <img src="${baseUrl}/assets/icons/social/linkedin.png" width="16" height="16" alt="LinkedIn" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; border: 0;" />
                      </a>
                    </td>
                    <!-- Facebook -->
                    <td style="padding: 0 6px;" align="center">
                      <a href="https://www.facebook.com/movodreamofficial/" target="_blank" style="display: inline-block; width: 36px; height: 36px; background-color: rgba(255,255,255,0.12); border-radius: 50%; text-align: center; text-decoration: none; line-height: 36px;">
                        <img src="${baseUrl}/assets/icons/social/facebook.png" width="16" height="16" alt="Facebook" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; border: 0;" />
                      </a>
                    </td>
                    <!-- YouTube -->
                    <td style="padding: 0 6px;" align="center">
                      <a href="https://youtube.com/@movodream" target="_blank" style="display: inline-block; width: 36px; height: 36px; background-color: rgba(255,255,255,0.12); border-radius: 50%; text-align: center; text-decoration: none; line-height: 36px;">
                        <img src="${baseUrl}/assets/icons/social/youtube.png" width="16" height="16" alt="YouTube" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; border: 0;" />
                      </a>
                    </td>
                  </tr>
                </table>

                <div style="border-top: 1px solid rgba(255,255,255,0.12); padding-top: 20px; font-size: 12px; color: #9c91a5; line-height: 1.7;">
                  <p style="margin: 0;">Email Sent by <strong>Movodream</strong> • Support: support@movodream.com</p>
                  <p style="margin: 6px 0 0 0;">New Delhi, India • You opted into marketing updates from Movodream.</p>
                  <p style="margin: 6px 0 0 0;">© ${new Date().getFullYear()} Movodream. All rights reserved.</p>
                </div>
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
        campaignIcon: input.icon || 'mail',
      })
      sentCount = result.count
      if (result.count === 0 && result.error) {
        return {
          success: false,
          sentCount: 0,
          error: `Email dispatch failed: ${result.error}`,
        }
      }
    } catch (smtpErr) {
      console.warn('SMTP Broadcast error:', smtpErr)
      revalidatePath('/admin/marketing-subscribers')
      return {
        success: false,
        sentCount: 0,
        error: `Email dispatch error: ${smtpErr instanceof Error ? smtpErr.message : 'SMTP delivery failed'}. Please verify your SMTP settings in Vercel.`,
      }
    }

    if (sentCount === 0 && subscriberEmails.length > 0) {
      return {
        success: false,
        sentCount: 0,
        error: `Campaign saved, but 0 emails were delivered (out of ${subscriberEmails.length} subscribers). Please verify your SMTP credentials on Vercel.`,
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
    await requirePermission('subscribers', ['send'])
    await connectDB()
    const activeSubscribers = await Subscriber.find({ status: 'active' }).select('email').lean()
    const subscriberEmails = activeSubscribers.map((s) => s.email)

    const result = await sendMarketingBroadcast({
      subject: input.subject,
      text: input.text || input.subject,
      html: input.html || `<p>${input.text}</p>`,
      subscriberEmails,
    })

    if (result.count === 0 && subscriberEmails.length > 0) {
      return {
        success: false,
        count: 0,
        sentCount: 0,
        error: result.error || 'SMTP delivery failed. Please verify your SMTP settings in Vercel.',
      }
    }

    return { success: true, count: result.count, sentCount: result.count }
  } catch (err) {
    return { success: false, count: 0, sentCount: 0, error: err instanceof Error ? err.message : 'Failed to send subscriber campaign' }
  }
}
