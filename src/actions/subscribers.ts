'use server'

import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/auth-guard'
import { connectDB } from '@/lib/db'
import { Subscriber } from '@/models/Subscriber'
import { sendMarketingBroadcast } from '@/lib/mailer'
import { campaignToPlainText, renderCampaignEmail, type CampaignBlock } from '@/lib/marketing'
import { MarketingCampaign } from '@/models/MarketingCampaign'

export type ActionResult = { success: true } | { success: false; error: string }

export type CampaignResult = { success: true; count: number } | { success: false; error: string }

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

export async function listSubscribers() {
  await requirePermission('subscribers', ['read'])
  await connectDB()
  const subscribers = await Subscriber.find().sort({ createdAt: -1 }).lean()
  return serialize(subscribers)
}

export async function updateSubscriberStatus(id: string, status: 'active' | 'unsubscribed'): Promise<ActionResult> {
  await requirePermission('subscribers', ['update'])
  await connectDB()
  try {
    await Subscriber.findByIdAndUpdate(id, { status })
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update subscriber' }
  }

  revalidatePath('/admin/subscribers')
  return { success: true }
}

export async function sendSubscriberCampaign(input: { subject: string; blocks: CampaignBlock[] }): Promise<CampaignResult> {
  await requirePermission('subscribers', ['send'])
  const subject = input.subject.trim()
  const blocks = Array.isArray(input.blocks) ? input.blocks : []
  if (subject.length < 3 || subject.length > 120) return { success: false, error: 'Subject must be between 3 and 120 characters.' }
  if (blocks.length === 0 || blocks.length > 30) return { success: false, error: 'Add between 1 and 30 content blocks.' }
  const text = campaignToPlainText(blocks).trim()
  if (text.length < 10 || text.length > 20000) return { success: false, error: 'Campaign content must be between 10 and 20,000 characters.' }

  await connectDB()
  const subscribers = await Subscriber.find({ status: 'active' }).select('email').lean<{ email: string }[]>()
  let result: Awaited<ReturnType<typeof sendMarketingBroadcast>>
  try {
    result = await sendMarketingBroadcast({ subject, text, html: renderCampaignEmail(blocks), subscriberEmails: subscribers.map((subscriber) => subscriber.email) })
  } catch (err) {
    return { success: false, error: err instanceof Error ? `Campaign delivery failed: ${err.message}` : 'Campaign delivery failed.' }
  }
  if (!result.sent) return { success: false, error: 'Email delivery is not configured. Add SMTP_HOST, SMTP_USER, SMTP_PASS, and EMAIL_FROM_ADDRESS.' }
  return { success: true, count: result.count }
}

export type MarketingEmailInput = {
  subject: string; preheader?: string; template?: string; icon?: string; theme?: string; heading?: string; description?: string
  imageUrl?: string; imageKey?: string; ctaText?: string; ctaUrl?: string; infoBoxTitle?: string; infoBoxContent?: string
}

export async function syncSubscriberEmail(input: MarketingEmailInput): Promise<ActionResult> {
  await requirePermission('subscribers', ['send'])
  const subject = input.subject?.trim()
  if (!subject || subject.length < 3 || subject.length > 150) return { success: false, error: 'Subject line must be between 3 and 150 characters.' }
  if (input.ctaUrl && !/^https?:\/\//i.test(input.ctaUrl)) return { success: false, error: 'CTA URL must start with http:// or https://.' }
  await connectDB()
  await MarketingCampaign.create({ ...input, subject, status: 'synced', syncedAt: new Date() })
  return { success: true }
}
