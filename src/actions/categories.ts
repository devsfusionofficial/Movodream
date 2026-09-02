'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { requirePermission } from '@/lib/auth-guard'
import { connectDB } from '@/lib/db'
import { Category } from '@/models/Category'
import { slugify } from '@/lib/utils'
import { categorySchema, type CategoryInput } from '@/lib/validation/category'

export type ActionResult = { success: true } | { success: false; error: string }

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

export async function listCategories() {
  await requirePermission('categories', ['read'])
  await connectDB()
  const categories = await Category.find().sort({ name: 1 }).lean()
  return serialize(categories)
}

export async function getCategory(id: string) {
  await requirePermission('categories', ['read'])
  await connectDB()
  const category = await Category.findById(id).lean()
  return category ? serialize(category) : null
}

export async function createCategory(input: CategoryInput): Promise<ActionResult> {
  await requirePermission('categories', ['create'])
  const parsed = categorySchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  await connectDB()
  const slug = parsed.data.slug?.trim() ? slugify(parsed.data.slug) : slugify(parsed.data.name)
  try {
    await Category.create({ ...parsed.data, slug })
  } catch (err: any) {
    if (err?.code === 11000) {
      return { success: false, error: 'A category with this name or slug already exists.' }
    }
    return { success: false, error: err instanceof Error ? err.message : 'Failed to create category' }
  }

  revalidateTag('categories', 'max')
  revalidateTag('posts', 'max')
  revalidatePath('/admin/categories')
  revalidatePath('/blog')
  return { success: true }
}

export async function updateCategory(id: string, input: CategoryInput): Promise<ActionResult> {
  await requirePermission('categories', ['update'])
  const parsed = categorySchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  await connectDB()
  const slug = parsed.data.slug?.trim() ? slugify(parsed.data.slug) : slugify(parsed.data.name)
  try {
    await Category.findByIdAndUpdate(id, { ...parsed.data, slug })
  } catch (err: any) {
    if (err?.code === 11000) {
      return { success: false, error: 'A category with this name or slug already exists.' }
    }
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update category' }
  }

  revalidateTag('categories', 'max')
  revalidateTag('posts', 'max')
  revalidatePath('/admin/categories')
  revalidatePath('/blog')
  return { success: true }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  await requirePermission('categories', ['delete'])
  await connectDB()
  try {
    await Category.findByIdAndDelete(id)
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete category' }
  }

  revalidateTag('categories', 'max')
  revalidateTag('posts', 'max')
  revalidatePath('/admin/categories')
  revalidatePath('/blog')
  return { success: true }
}
