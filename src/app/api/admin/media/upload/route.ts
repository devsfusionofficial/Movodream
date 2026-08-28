import { NextResponse } from 'next/server'
import { requirePermission } from '@/lib/auth-guard'
import { uploadMediaBuffer } from '@/lib/r2'
import { createMediaRecord } from '@/actions/media'

export async function POST(request: Request) {
  try {
    await requirePermission('media', ['create'])
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return NextResponse.json({ error: 'Only image and video uploads are supported' }, { status: 400 })
    }

    // Limit to 15MB
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be under 15MB' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { key, publicUrl } = await uploadMediaBuffer('media', file.name, file.type, buffer)

    await createMediaRecord({
      key,
      url: publicUrl,
      mimeType: file.type,
      size: file.size,
    })

    return NextResponse.json({
      success: true,
      key,
      url: publicUrl,
      publicUrl,
    })
  } catch (err) {
    console.error('Media upload error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
