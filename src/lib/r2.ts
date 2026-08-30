import 'server-only'
import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'
import fs from 'fs'
import path from 'path'

const R2_BUCKET = process.env.R2_BUCKET
const R2_ENDPOINT = process.env.R2_ENDPOINT
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL
const R2_PRIVATE_BUCKET = process.env.R2_PRIVATE_BUCKET || process.env.R2_BUCKET

let s3ClientInstance: S3Client | null = null

function getClient(): S3Client | null {
  if (!s3ClientInstance) {
    if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !R2_ENDPOINT) {
      return null
    }
    s3ClientInstance = new S3Client({
      region: 'auto',
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    })
  }
  return s3ClientInstance
}

function buildKey(prefix: string, fileName: string) {
  const ext = fileName.includes('.') ? fileName.slice(fileName.lastIndexOf('.')) : ''
  return `${prefix}/${randomUUID()}${ext}`
}

function saveLocalBuffer(prefix: string, fileName: string, body: Buffer): { key: string; publicUrl: string } {
  const key = buildKey(prefix, fileName)
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', prefix)
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }
  const filePath = path.join(process.cwd(), 'public', 'uploads', key)
  fs.writeFileSync(filePath, body)
  return { key: `local:${key}`, publicUrl: `/uploads/${key}` }
}

/**
 * Presigned direct-upload URL for admin media (Tiptap image uploads, etc).
 */
export async function createPresignedUpload(prefix: string, fileName: string, contentType: string) {
  const key = buildKey(prefix, fileName)
  const client = getClient()
  if (!client || !R2_BUCKET) {
    return { key: `local:${key}`, uploadUrl: '/api/admin/media/upload', publicUrl: `/uploads/${key}` }
  }
  try {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: contentType,
    })
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 })
    return { key, uploadUrl, publicUrl: `${R2_PUBLIC_URL}/${key}` }
  } catch (err) {
    console.warn('R2 presign failed, falling back to local:', err instanceof Error ? err.message : err)
    return { key: `local:${key}`, uploadUrl: '/api/admin/media/upload', publicUrl: `/uploads/${key}` }
  }
}

/**
 * Server-buffered upload for media images & assets with automatic local fallback.
 */
export async function uploadMediaBuffer(prefix: string, fileName: string, contentType: string, body: Buffer) {
  try {
    const client = getClient()
    if (!client || !R2_BUCKET) {
      return saveLocalBuffer(prefix, fileName, body)
    }
    const key = buildKey(prefix, fileName)
    await client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
    )
    return { key, publicUrl: `${R2_PUBLIC_URL}/${key}` }
  } catch (err) {
    console.warn('R2 media upload failed, saving to local storage fallback:', err instanceof Error ? err.message : err)
    return saveLocalBuffer(prefix, fileName, body)
  }
}

/**
 * Server-buffered upload for resumes with automatic local fallback.
 */
export async function uploadBuffer(prefix: string, fileName: string, contentType: string, body: Buffer) {
  try {
    const client = getClient()
    if (!client || !R2_PRIVATE_BUCKET) {
      const { key } = saveLocalBuffer(prefix, fileName, body)
      return { key }
    }
    const key = buildKey(prefix, fileName)
    await client.send(
      new PutObjectCommand({
        Bucket: R2_PRIVATE_BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
    )
    return { key }
  } catch (err) {
    console.warn('R2 upload failed, saving to local storage fallback:', err instanceof Error ? err.message : err)
    const { key } = saveLocalBuffer(prefix, fileName, body)
    return { key }
  }
}

/**
 * Generates download URL, supporting both R2 signed links and local files.
 */
export async function createDownloadUrl(key: string) {
  if (key.startsWith('local:')) {
    const localPath = key.replace('local:', '')
    return `/uploads/${localPath}`
  }
  try {
    const client = getClient()
    if (!client) return `/uploads/${key}`
    const command = new GetObjectCommand({ Bucket: R2_PRIVATE_BUCKET, Key: key })
    return await getSignedUrl(client, command, { expiresIn: 300 })
  } catch (err) {
    console.warn('R2 download URL creation failed, using local path:', err instanceof Error ? err.message : err)
    return `/uploads/${key}`
  }
}

/**
 * Checks whether an uploaded object exists either on R2 or local disk.
 */
export async function objectExists(key: string) {
  if (key.startsWith('local:')) {
    const localPath = key.replace('local:', '')
    const filePath = path.join(process.cwd(), 'public', 'uploads', localPath)
    return fs.existsSync(filePath)
  }
  const client = getClient()
  if (!client) {
    const filePath = path.join(process.cwd(), 'public', 'uploads', key)
    return fs.existsSync(filePath)
  }
  try {
    await client.send(new HeadObjectCommand({ Bucket: R2_PRIVATE_BUCKET, Key: key }))
    return true
  } catch (err) {
    const status = (err as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode
    if (status === 404 || (err as Error).name === 'NotFound') return false
    return false
  }
}
