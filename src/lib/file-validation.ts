/**
 * Validates uploaded files by magic bytes, not client-supplied MIME type or
 * extension — both of those are attacker-controlled. Covers the file types
 * this app actually accepts (resumes): PDF, DOC, DOCX.
 */

const SIGNATURES: Array<{ mimeType: string; extensions: string[]; check: (bytes: Uint8Array) => boolean }> = [
  {
    mimeType: 'application/pdf',
    extensions: ['pdf'],
    check: (b) => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46, // %PDF
  },
  {
    mimeType: 'application/msword',
    extensions: ['doc'],
    check: (b) => b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0, // legacy OLE (.doc)
  },
  {
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    extensions: ['docx'],
    check: (b) => b[0] === 0x50 && b[1] === 0x4b && (b[2] === 0x03 || b[2] === 0x05 || b[2] === 0x07), // ZIP-based (.docx)
  },
]

export const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export function detectFileKind(bytes: Uint8Array) {
  return SIGNATURES.find((sig) => sig.check(bytes)) ?? null
}

export function isAllowedResumeFile(bytes: Uint8Array, size: number) {
  if (size > MAX_RESUME_SIZE_BYTES) return { ok: false as const, reason: 'File exceeds 5MB limit' }
  const kind = detectFileKind(bytes)
  if (!kind) return { ok: false as const, reason: 'File must be a PDF, DOC, or DOCX' }
  return { ok: true as const, mimeType: kind.mimeType }
}
