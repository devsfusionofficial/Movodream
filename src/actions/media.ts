'use server'

import { requirePermission } from '@/lib/auth-guard'
import { connectDB } from '@/lib/db'
import { Media } from '@/models/Media'

type CreateMediaInput = {
  key: string
  url: string
  mimeType: string
  size: number
  width?: number
  height?: number
}

export async function createMediaRecord(input: CreateMediaInput) {
  const session = await requirePermission('media', ['create'])
  await connectDB()

  const doc = await Media.create({
    ...input,
    uploadedBy: session.user.id,
  })

  return { id: String(doc._id), url: doc.url as string }
}
