'use server'

import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/auth-guard'
import { connectDB } from '@/lib/db'
import { Author } from '@/models/Author'
import { authorSchema, type AuthorInput } from '@/lib/validation/author'

export type ActionResult = { success: true } | { success: false; error: string }

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

function toAuthorDoc(input: AuthorInput) {
  return {
    name: input.name,
    email: input.email ? input.email.trim().toLowerCase() : undefined,
    bio: input.bio,
    avatar: input.avatarUrl ? { url: input.avatarUrl, key: input.avatarKey } : undefined,
    socialLinks: {
      twitter: input.twitter || undefined,
      linkedin: input.linkedin || undefined,
      website: input.website || undefined,
    },
  }
}

export async function listAuthors() {
  await requirePermission('authors', ['read'])
  await connectDB()
  const authors = await Author.find().sort({ name: 1 }).lean()
  return serialize(authors)
}

export async function getAuthor(id: string) {
  await requirePermission('authors', ['read'])
  await connectDB()
  const author = await Author.findById(id).lean()
  return author ? serialize(author) : null
}

export async function createAuthor(input: AuthorInput): Promise<ActionResult> {
  await requirePermission('authors', ['create'])
  const parsed = authorSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  await connectDB()
  try {
    await Author.create(toAuthorDoc(parsed.data))
  } catch (err: any) {
    if (err?.code === 11000) {
      return { success: false, error: 'An author with this name or email already exists.' }
    }
    return { success: false, error: err instanceof Error ? err.message : 'Failed to create author' }
  }

  revalidatePath('/admin/authors')
  revalidatePath('/blog')
  revalidatePath('/blog', 'layout')
  return { success: true }
}

export async function updateAuthor(id: string, input: AuthorInput): Promise<ActionResult> {
  await requirePermission('authors', ['update'])
  const parsed = authorSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  await connectDB()
  try {
    await Author.findByIdAndUpdate(id, toAuthorDoc(parsed.data))
  } catch (err: any) {
    if (err?.code === 11000) {
      return { success: false, error: 'An author with this name or email already exists.' }
    }
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update author' }
  }

  revalidatePath('/admin/authors')
  revalidatePath('/blog')
  revalidatePath('/blog', 'layout')
  return { success: true }
}

export async function deleteAuthor(id: string): Promise<ActionResult> {
  await requirePermission('authors', ['delete'])
  await connectDB()
  try {
    await Author.findByIdAndDelete(id)
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete author' }
  }

  revalidatePath('/admin/authors')
  revalidatePath('/blog')
  revalidatePath('/blog', 'layout')
  return { success: true }
}
