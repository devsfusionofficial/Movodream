import { z } from 'zod'

// Mirrors the client-side checks in ContactModal.tsx (ported from the live
// site's footer.js) — India-specific mobile number validation included.
const indianPhoneRegex = /^(\+91)?[6-9]\d{9}$/

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .refine((val) => indianPhoneRegex.test(val.replace(/[\s-]/g, '')), 'Enter a valid Indian phone number'),
  message: z.string().trim().optional(),
})

export type ContactInput = z.infer<typeof contactSchema>
