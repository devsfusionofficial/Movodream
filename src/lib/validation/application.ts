import { z } from 'zod'
import { APPLICATION_STATUSES } from '@/lib/application-status'

// Text fields only — the resume file is validated separately by magic bytes
// in the /api/careers/[id]/apply route, not through Zod.
export const applyFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Full Name must be at least 2 characters')
    .regex(/^[a-zA-Z\s'.-]+$/, 'Full Name can only contain letters and spaces'),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z
    .string()
    .trim()
    .refine((val) => {
      const cleaned = val.replace(/\D/g, '')
      return cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith('91'))
    }, 'Phone number must be a valid 10-digit mobile number'),
  location: z.string().trim().optional(),
  experience: z.string().trim().optional(),
  qualification: z.string().trim().optional(),
  coverLetter: z.string().trim().optional(),
})

export type ApplyFormInput = z.infer<typeof applyFormSchema>

export const applicationStatusSchema = z.object({
  status: z.enum(APPLICATION_STATUSES),
  internalNotes: z.string().optional(),
})

export type ApplicationStatusInput = z.infer<typeof applicationStatusSchema>
