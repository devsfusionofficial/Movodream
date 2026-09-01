import { NextResponse } from 'next/server'
import { requirePermission } from '@/lib/auth-guard'
import { createPresignedUpload } from '@/lib/r2'

export async function POST(request: Request) {
  try {
    await requirePermission('media', ['create'])
  } catch {
    return NextResponse.json({ error: 'Unauthorized or Forbidden' }, { status: 403, headers: { 'Cache-Control': 'no-store' } })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400, headers: { 'Cache-Control': 'no-store' } })
  }

  const { fileName, contentType } = body

  if (typeof fileName !== 'string' || typeof contentType !== 'string') {
    return NextResponse.json({ error: 'fileName and contentType are required' }, { status: 400, headers: { 'Cache-Control': 'no-store' } })
  }

  if (!contentType.startsWith('image/') && !contentType.startsWith('video/')) {
    return NextResponse.json({ error: 'Only image and video uploads are supported here' }, { status: 400, headers: { 'Cache-Control': 'no-store' } })
  }

  try {
    const result = await createPresignedUpload('media', fileName, contentType)
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    console.error('Presigned upload generation error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate upload URL' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
