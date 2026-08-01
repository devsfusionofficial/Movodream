'use server'

import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/auth-guard'
import { connectDB } from '@/lib/db'
import { Subscriber } from '@/models/Subscriber'

export type ActionResult = { success: true } | { success: false; error: string }

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
