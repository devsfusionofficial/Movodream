import { z } from 'zod'
import { APPLICATION_STATUSES } from '@/lib/application-status'

// Text fields only — the resume file is validated separately by magic bytes
// in the /api/careers/[id]/apply route, not through Zod.
export const applyFormSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().min(7, 'Enter a valid phone number'),
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
