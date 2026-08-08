import { NextResponse } from 'next/server'
import { requirePermission } from '@/lib/auth-guard'
import { createPresignedUpload } from '@/lib/r2'

export async function POST(request: Request) {
  try {
    await requirePermission('media', ['create'])
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { fileName, contentType } = await request.json()

  if (typeof fileName !== 'string' || typeof contentType !== 'string') {
    return NextResponse.json({ error: 'fileName and contentType are required' }, { status: 400 })
  }

  if (!contentType.startsWith('image/') && !contentType.startsWith('video/')) {
    return NextResponse.json({ error: 'Only image and video uploads are supported here' }, { status: 400 })
  }

  const result = await createPresignedUpload('media', fileName, contentType)
  return NextResponse.json(result)
}
