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
  return {
    name: input.name,
    url: input.url || undefined,
    category: input.category,
    logo: input.logoUrl ? { url: input.logoUrl, key: input.logoKey } : undefined,
    order: input.order,
  }
}

export async function createPartner(input: PartnerInput): Promise<ActionResult> {
  await requirePermission('partners', ['create'])
  const parsed = partnerSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  await connectDB()
  try {
    await Partner.create(toPartnerDoc(parsed.data))
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to create partner' }
  }

  revalidatePath('/admin/partners')
  revalidatePath('/')
  return { success: true }
}

export async function updatePartner(id: string, input: PartnerInput): Promise<ActionResult> {
  await requirePermission('partners', ['update'])
  const parsed = partnerSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  await connectDB()
  try {
    await Partner.findByIdAndUpdate(id, toPartnerDoc(parsed.data))
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update partner' }
  }

  revalidatePath('/admin/partners')
  revalidatePath('/')
  return { success: true }
}

export async function deletePartner(id: string): Promise<ActionResult> {
  await requirePermission('partners', ['delete'])
  await connectDB()
  try {
    await Partner.findByIdAndDelete(id)
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete partner' }
  }

  revalidatePath('/admin/partners')
  revalidatePath('/')
  return { success: true }
}
