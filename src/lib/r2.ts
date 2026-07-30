import 'server-only'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'

const R2_BUCKET = process.env.R2_BUCKET
const R2_ENDPOINT = process.env.R2_ENDPOINT
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL

function getClient() {
  return new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  })
}

function buildKey(prefix: string, fileName: string) {
  const ext = fileName.includes('.') ? fileName.slice(fileName.lastIndexOf('.')) : ''
  return `${prefix}/${randomUUID()}${ext}`
}

/**
 * Presigned direct-upload URL for admin media (Tiptap image uploads, etc).
 * The browser PUTs the file straight to R2 — no request body passes through
 * our server, so there's no serverless memory pressure for larger images.
 */
export async function createPresignedUpload(prefix: string, fileName: string, contentType: string) {
  const key = buildKey(prefix, fileName)
  const client = getClient()
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  })
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 })
  return { key, uploadUrl, publicUrl: `${R2_PUBLIC_URL}/${key}` }
}

/**
 * Server-buffered upload for resumes: lower volume than media images, and
 * the buffer is already validated (magic bytes, size) server-side before
 * this is called, so streaming it straight through is simpler than a
 * presigned round-trip.
 */
export async function uploadBuffer(prefix: string, fileName: string, contentType: string, body: Buffer) {
  const key = buildKey(prefix, fileName)
  const client = getClient()
  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  )
  return { key, publicUrl: `${R2_PUBLIC_URL}/${key}` }
}

export async function createDownloadUrl(key: string) {
  const client = getClient()
  const command = new GetObjectCommand({ Bucket: R2_BUCKET, Key: key })
  return getSignedUrl(client, command, { expiresIn: 300 })
}
