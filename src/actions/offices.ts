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
  return {
    city: input.city.trim(),
    slug: input.slug?.trim() ? slugify(input.slug) : slugify(input.city),
    address: input.address,
    gmbLink: input.gmbLink || undefined,
    status: input.status,
    description: input.description,
    image: input.imageUrl ? { url: input.imageUrl, key: input.imageKey } : undefined,
    order: input.order,
  }
}

export async function createOffice(input: OfficeInput): Promise<ActionResult> {
  await requirePermission('offices', ['create'])
  const parsed = officeSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  await connectDB()
  try {
    await Office.create(toOfficeDoc(parsed.data))
  } catch (err: any) {
    if (err?.code === 11000) {
      return { success: false, error: 'An office with this city or slug already exists.' }
    }
    return { success: false, error: err instanceof Error ? err.message : 'Failed to create office' }
  }

  revalidatePath('/admin/offices')
  revalidatePath('/offices')
  return { success: true }
}

export async function updateOffice(id: string, input: OfficeInput): Promise<ActionResult> {
  await requirePermission('offices', ['update'])
  const parsed = officeSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  await connectDB()
  const docData = toOfficeDoc(parsed.data)
  try {
    await Office.findByIdAndUpdate(id, docData)
  } catch (err: any) {
    if (err?.code === 11000) {
      return { success: false, error: 'An office with this city or slug already exists.' }
    }
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update office' }
  }

  revalidatePath('/admin/offices')
  revalidatePath('/offices')
  revalidatePath(`/offices/${docData.slug}`)
  return { success: true }
}

export async function deleteOffice(id: string): Promise<ActionResult> {
  await requirePermission('offices', ['delete'])
  await connectDB()
  try {
    await Office.findByIdAndDelete(id)
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete office' }
  }

  revalidatePath('/admin/offices')
  revalidatePath('/offices')
  return { success: true }
}
