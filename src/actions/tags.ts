'use server'

import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/auth-guard'
import { connectDB } from '@/lib/db'
import { Tag } from '@/models/Tag'
import { tagSchema, type TagInput } from '@/lib/validation/tag'

export type ActionResult = { success: true } | { success: false; error: string }

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

export async function listTags() {
  await requirePermission('tags', ['read'])
  await connectDB()
  const tags = await Tag.find().sort({ name: 1 }).lean()
  return serialize(tags)
}

export async function getTag(id: string) {
  await requirePermission('tags', ['read'])
  await connectDB()
  const tag = await Tag.findById(id).lean()
  return tag ? serialize(tag) : null
}

export async function createTag(input: TagInput): Promise<ActionResult> {
  await requirePermission('tags', ['create'])
  const parsed = tagSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  await connectDB()
  try {
    await Tag.create(parsed.data)
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to create tag' }
  }

  revalidatePath('/admin/tags')
  revalidatePath('/blog')
  return { success: true }
}

export async function updateTag(id: string, input: TagInput): Promise<ActionResult> {
  await requirePermission('tags', ['update'])
  const parsed = tagSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  await connectDB()
  try {
    await Tag.findByIdAndUpdate(id, parsed.data)
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update tag' }
  }

  revalidatePath('/admin/tags')
  revalidatePath('/blog')
  return { success: true }
}

export async function deleteTag(id: string): Promise<ActionResult> {
  await requirePermission('tags', ['delete'])
  await connectDB()
  try {
    await Tag.findByIdAndDelete(id)
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete tag' }
  }

  revalidatePath('/admin/tags')
  revalidatePath('/blog')
  return { success: true }
}
