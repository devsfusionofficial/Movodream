'use server'

import { revalidatePath } from 'next/cache'
import type { HydratedDocument } from 'mongoose'
import { requirePermission } from '@/lib/auth-guard'
import { connectDB } from '@/lib/db'
import { Post, type PostDoc } from '@/models/Post'
import { postSchema, type PostInput } from '@/lib/validation/post'

export type ActionResult = { success: true } | { success: false; error: string }

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

export async function listPosts() {
  await requirePermission('posts', ['read'])
  await connectDB()
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate('author', 'name')
    .populate('categories', 'name')
    .lean()
  return serialize(posts)
}

export async function getPost(id: string) {
  await requirePermission('posts', ['read'])
  await connectDB()
  const post = await Post.findById(id).lean()
  return post ? serialize(post) : null
}

function applyPostInput(doc: HydratedDocument<PostDoc>, input: PostInput) {
  doc.title = input.title
  if (input.slug) doc.slug = input.slug
  doc.excerpt = input.excerpt
  doc.contentJson = input.contentJson
  doc.contentHtml = input.contentHtml ?? ''
  doc.heroImage = input.heroImageUrl ? { url: input.heroImageUrl, key: input.heroImageKey } : undefined
  doc.author = (input.authorId || undefined) as unknown as PostDoc['author']
  doc.categories = input.categoryIds as unknown as PostDoc['categories']
  doc.tags = input.tagIds as unknown as PostDoc['tags']
  doc.status = input.status
  if (input.publishedAt) doc.publishedAt = new Date(input.publishedAt)
  doc.seo = {
    title: input.seoTitle,
    description: input.seoDescription,
    ogImage: input.seoOgImage,
  }
}

export async function createPost(input: PostInput): Promise<ActionResult> {
  await requirePermission('posts', input.status === 'published' ? ['create', 'publish'] : ['create'])
  const parsed = postSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  await connectDB()
  let slug = ''
  try {
    const doc = new Post()
    applyPostInput(doc, parsed.data)
    await doc.save()
    slug = doc.slug
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to create post' }
  }

  revalidatePath('/admin/posts')
  revalidatePath('/blog')
  if (slug) revalidatePath(`/blog/${slug}`)
  return { success: true }
}

export async function updatePost(id: string, input: PostInput): Promise<ActionResult> {
  await requirePermission('posts', input.status === 'published' ? ['update', 'publish'] : ['update'])
  const parsed = postSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  await connectDB()
  let slug = ''
  try {
    const doc = await Post.findById(id)
    if (!doc) return { success: false, error: 'Post not found' }
    applyPostInput(doc, parsed.data)
    await doc.save()
    slug = doc.slug
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update post' }
  }

  revalidatePath('/admin/posts')
  revalidatePath('/blog')
  if (slug) revalidatePath(`/blog/${slug}`)
  return { success: true }
}

export async function deletePost(id: string): Promise<ActionResult> {
  await requirePermission('posts', ['delete'])
  await connectDB()
  try {
    await Post.findByIdAndDelete(id)
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete post' }
  }

  revalidatePath('/admin/posts')
  revalidatePath('/blog')
  return { success: true }
}
