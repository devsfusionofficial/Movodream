'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { createMediaRecord } from '@/actions/media'

type FileUploadProps = {
  onUploaded: (result: { url: string; key: string }) => void
  accept?: string
  label?: string
}

/**
 * Presigned direct-to-R2 upload: browser PUTs the file straight to storage
 * (no request body through our server), then a Server Action persists the
 * Media record. Used by the rich text editor's image button and any future
 * "attach an image" field.
 */
export function FileUpload({ onUploaded, accept = 'image/*', label = 'Upload image' }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setIsUploading(true)
    try {
      const presignRes = await fetch('/api/admin/media/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: file.type }),
      })

      if (!presignRes.ok) {
        const { error } = await presignRes.json().catch(() => ({ error: 'Upload failed' }))
        throw new Error(error ?? 'Upload failed')
      }

      const { key, uploadUrl, publicUrl } = await presignRes.json()

      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!putRes.ok) throw new Error('Failed to upload file to storage')

      const dimensions = await readImageDimensions(file).catch(() => undefined)

      await createMediaRecord({
        key,
        url: publicUrl,
        mimeType: file.type,
        size: file.size,
        ...dimensions,
      })

      onUploaded({ url: publicUrl, key })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFileChange} />
      <Button type="button" variant="outline" size="sm" disabled={isUploading} onClick={() => inputRef.current?.click()}>
        {isUploading ? 'Uploading…' : label}
      </Button>
    </>
  )
}

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Not an image'))
    }
    img.src = url
  })
}
