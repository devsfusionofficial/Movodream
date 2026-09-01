'use server'

import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/auth-guard'
import { connectDB } from '@/lib/db'
import { Partner } from '@/models/Partner'
import { partnerSchema, type PartnerInput } from '@/lib/validation/partner'

export type ActionResult = { success: true } | { success: false; error: string }

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

export async function listPartners() {
  await requirePermission('partners', ['read'])
  await connectDB()
  const partners = await Partner.find().sort({ order: 1, name: 1 }).lean()
  return serialize(partners)
}

export async function getPartner(id: string) {
  await requirePermission('partners', ['read'])
  await connectDB()
  const partner = await Partner.findById(id).lean()
  return partner ? serialize(partner) : null
}

function toPartnerDoc(input: PartnerInput) {
  let url = input.url?.trim()
  if (url && !/^https?:\/\//i.test(url)) {
    url = `https://${url}`
  }
  return {
    name: input.name.trim(),
    url: url || undefined,
    category: input.category?.trim() || undefined,
    logo: input.logoUrl ? { url: input.logoUrl, key: input.logoKey || '' } : undefined,
    order: Number.isFinite(input.order) ? input.order : 0,
  }
}

/**
 * Inserts or moves targetId to requestedOrder (1-indexed),
 * shifting all conflicting and subsequent partners down automatically.
 */
async function reorderPartners(targetId: string, requestedOrder: number) {
  const others = await Partner.find({ _id: { $ne: targetId } }).sort({ order: 1, name: 1 }).lean()
  
  // 1-indexed target position: clamp between 0 and others.length
  const targetIndex = Math.max(0, Math.min(requestedOrder - 1, others.length))

  const reordered: Array<{ _id: unknown; order: number }> = []
  let inserted = false

  for (let i = 0; i < others.length; i++) {
    if (i === targetIndex) {
      reordered.push({ _id: targetId, order: reordered.length + 1 })
      inserted = true
    }
    reordered.push({ _id: others[i]._id, order: reordered.length + 1 })
  }

  if (!inserted) {
    reordered.push({ _id: targetId, order: reordered.length + 1 })
  }

  const bulkOps = reordered.map((item) => ({
    updateOne: {
      filter: { _id: item._id },
      update: { $set: { order: item.order } },
    },
  }))

  if (bulkOps.length > 0) {
    await Partner.bulkWrite(bulkOps)
  }
}

/**
 * Re-indexes all partners sequentially 1..N after a deletion.
 */
async function reorderPartnersAfterDelete() {
  const all = await Partner.find().sort({ order: 1, name: 1 }).lean()
  const bulkOps = all.map((p, idx) => ({
    updateOne: {
      filter: { _id: p._id },
      update: { $set: { order: idx + 1 } },
    },
  }))
  if (bulkOps.length > 0) {
    await Partner.bulkWrite(bulkOps)
  }
}

export async function createPartner(input: PartnerInput): Promise<ActionResult> {
  try {
    await requirePermission('partners', ['create'])
    const parsed = partnerSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
    }

    await connectDB()
    const created = await Partner.create(toPartnerDoc(parsed.data))

    // Automatic re-ordering: shift existing partners down so every partner has a unique position
    await reorderPartners(created._id.toString(), parsed.data.order > 0 ? parsed.data.order : 9999)

    revalidatePath('/admin/partners')
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    if (err?.code === 11000) {
      return { success: false, error: 'A partner with this name already exists.' }
    }
    return { success: false, error: err instanceof Error ? err.message : 'Failed to create partner' }
  }
}

export async function updatePartner(id: string, input: PartnerInput): Promise<ActionResult> {
  try {
    await requirePermission('partners', ['update'])
    const parsed = partnerSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
    }

    await connectDB()
    const updated = await Partner.findByIdAndUpdate(id, toPartnerDoc(parsed.data), { new: true })
    if (!updated) {
      return { success: false, error: 'Partner not found' }
    }

    // Automatic re-ordering: shift conflicting and subsequent partners down
    await reorderPartners(id, parsed.data.order > 0 ? parsed.data.order : 1)

    revalidatePath('/admin/partners')
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    if (err?.code === 11000) {
      return { success: false, error: 'A partner with this name already exists.' }
    }
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update partner' }
  }
}

export async function deletePartner(id: string): Promise<ActionResult> {
  try {
    await requirePermission('partners', ['delete'])
    await connectDB()
    const deleted = await Partner.findByIdAndDelete(id)
    if (!deleted) {
      return { success: false, error: 'Partner not found or already deleted' }
    }

    // Close any numeric gaps in the display order sequence
    await reorderPartnersAfterDelete()

    revalidatePath('/admin/partners')
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete partner' }
  }
}
