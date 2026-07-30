import { z } from 'zod'

export const officeSchema = z.object({
  city: z.string().min(2, 'City is required'),
  slug: z
    .string()
    .min(2, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
  address: z.string().optional(),
  gmbLink: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  status: z.enum(['live', 'comingSoon']),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  imageKey: z.string().optional(),
  order: z.number().int(),
})

export type OfficeInput = z.infer<typeof officeSchema>
