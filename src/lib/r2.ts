import 'server-only'
import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'

const R2_BUCKET = process.env.R2_BUCKET
const R2_ENDPOINT = process.env.R2_ENDPOINT
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL

/**
 * Résumés are personal data and must never be reachable over the bucket's
 * public URL. R2 public access is all-or-nothing per bucket, so they belong
 * in a separate bucket that has no public URL or custom domain attached.
 *
 * Falls back to R2_BUCKET when unset so nothing breaks before that bucket
 * exists — but while it is unset, an uploaded résumé IS publicly fetchable
 * at `${R2_PUBLIC_URL}/resumes/<uuid>.<ext>` by anyone who knows the key.
 * Set R2_PRIVATE_BUCKET in production.
 */
const R2_PRIVATE_BUCKET = process.env.R2_PRIVATE_BUCKET || process.env.R2_BUCKET

let s3ClientInstance: S3Client | null = null

function getClient() {
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region: 'auto',
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    })
  }
  return s3ClientInstance
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
 *
 * Goes to the private bucket, and deliberately returns only the key — there
 * is no public URL for a résumé. Callers read it back through
 * `createDownloadUrl`, which issues a short-lived signed link.
 */
export async function uploadMediaBuffer(prefix: string, fileName: string, contentType: string, body: Buffer) {
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

export async function uploadBuffer(prefix: string, fileName: string, contentType: string, body: Buffer) {
  const key = buildKey(prefix, fileName)
  const client = getClient()
  await client.send(
    new PutObjectCommand({
      Bucket: R2_PRIVATE_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  )
  return { key }
}

export async function createDownloadUrl(key: string) {
  const client = getClient()
  const command = new GetObjectCommand({ Bucket: R2_PRIVATE_BUCKET, Key: key })
  return getSignedUrl(client, command, { expiresIn: 300 })
}

/**
 * Whether the object still exists.
 *
 * Signing a URL never touches the object, so a key whose file has gone —
 * deleted by the resumes/ retention lifecycle rule, or removed by hand —
 * still yields a perfectly valid-looking link that fails with a raw
 * `NoSuchKey` XML error when clicked. Callers use this to show a proper
 * "no longer available" state instead.
 */
export async function objectExists(key: string) {
  const client = getClient()
  try {
    await client.send(new HeadObjectCommand({ Bucket: R2_PRIVATE_BUCKET, Key: key }))
    return true
  } catch (err) {
    const status = (err as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode
    if (status === 404 || (err as Error).name === 'NotFound') return false
    throw err
  }
}
