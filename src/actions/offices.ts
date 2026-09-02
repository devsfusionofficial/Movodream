'use server'

import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/auth-guard'
import { connectDB } from '@/lib/db'
import { Office } from '@/models/Office'
import { officeSchema, type OfficeInput } from '@/lib/validation/office'
import { slugify } from '@/lib/utils'

export type ActionResult = { success: true } | { success: false; error: string }

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

export async function listOffices() {
  await requirePermission('offices', ['read'])
  await connectDB()
  const offices = await Office.find().sort({ order: 1, city: 1 }).lean()
  return serialize(offices)
}

export async function getOffice(id: string) {
  await requirePermission('offices', ['read'])
  await connectDB()
  const office = await Office.findById(id).lean()
  return office ? serialize(office) : null
}

function toOfficeDoc(input: OfficeInput) {
  let gmbLink = input.gmbLink?.trim()
  if (gmbLink && !/^https?:\/\//i.test(gmbLink)) {
    gmbLink = `https://${gmbLink}`
  }
  return {
    city: input.city.trim(),
    slug: input.slug?.trim() ? slugify(input.slug) : slugify(input.city),
    role: input.role?.trim() || undefined,
    address: input.address?.trim() || undefined,
    gmbLink: gmbLink || undefined,
    status: input.status,
    description: input.description?.trim() || undefined,
    image: input.imageUrl ? { url: input.imageUrl, key: input.imageKey || '' } : null,
    order: Number.isFinite(input.order) ? input.order : 0,
  }
}

/**
 * Inserts or moves targetId to requestedOrder (1-indexed),
 * shifting all conflicting and subsequent offices down automatically.
 */
async function reorderOffices(targetId: string, requestedOrder: number) {
  const others = await Office.find({ _id: { $ne: targetId } }).sort({ order: 1, city: 1 }).lean()
  
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
    await Office.bulkWrite(bulkOps)
  }
}

/**
 * Re-indexes all offices sequentially 1..N after a deletion.
 */
async function reorderOfficesAfterDelete() {
  const all = await Office.find().sort({ order: 1, city: 1 }).lean()
  const bulkOps = all.map((p, idx) => ({
    updateOne: {
      filter: { _id: p._id },
      update: { $set: { order: idx + 1 } },
    },
  }))
  if (bulkOps.length > 0) {
    await Office.bulkWrite(bulkOps)
  }
}

export async function createOffice(input: OfficeInput): Promise<ActionResult> {
  try {
    await requirePermission('offices', ['create'])
    const parsed = officeSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
    }

    await connectDB()
    const created = await Office.create(toOfficeDoc(parsed.data))

    // Automatic re-ordering: shift existing offices down
    await reorderOffices(created._id.toString(), parsed.data.order > 0 ? parsed.data.order : 9999)

    revalidatePath('/admin/offices')
    revalidatePath('/offices')
    revalidatePath('/about')
    return { success: true }
  } catch (err: any) {
    if (err?.code === 11000) {
      return { success: false, error: 'An office with this city or slug already exists.' }
    }
    return { success: false, error: err instanceof Error ? err.message : 'Failed to create office' }
  }
}

export async function updateOffice(id: string, input: OfficeInput): Promise<ActionResult> {
  try {
    await requirePermission('offices', ['update'])
    const parsed = officeSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
    }

    await connectDB()
    const docData = toOfficeDoc(parsed.data)
    const updated = await Office.findByIdAndUpdate(id, docData, { new: true })
    if (!updated) {
      return { success: false, error: 'Office not found' }
    }

    // Automatic re-ordering: shift conflicting and subsequent offices down
    await reorderOffices(id, parsed.data.order > 0 ? parsed.data.order : 1)

    revalidatePath('/admin/offices')
    revalidatePath('/offices')
    revalidatePath('/about')
    revalidatePath(`/offices/${docData.slug}`)
    return { success: true }
  } catch (err: any) {
    if (err?.code === 11000) {
      return { success: false, error: 'An office with this city or slug already exists.' }
    }
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update office' }
  }
}

export async function deleteOffice(id: string): Promise<ActionResult> {
  try {
    await requirePermission('offices', ['delete'])
    await connectDB()
    const deleted = await Office.findByIdAndDelete(id)
    if (!deleted) {
      return { success: false, error: 'Office not found or already deleted' }
    }

    // Close any numeric gaps in the display order sequence
    await reorderOfficesAfterDelete()

    revalidatePath('/admin/offices')
    revalidatePath('/offices')
    revalidatePath('/about')
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete office' }
  }
}
