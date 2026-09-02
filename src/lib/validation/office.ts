import { z } from 'zod'

export const officeSchema = z.object({
  city: z.string().trim().min(2, 'City is required'),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]*$/, 'Lowercase letters, numbers, and hyphens only')
    .optional()
    .or(z.literal('')),
  role: z.string().trim().optional().or(z.literal('')),
  address: z.string().trim().optional().or(z.literal('')),
  gmbLink: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+/i.test(val) || /^[\w-]+\.[\w.-]+/i.test(val), {
      message: 'Enter a valid maps URL (e.g. https://maps.google.com/...)',
    })
    .or(z.literal('')),
  status: z.enum(['live', 'comingSoon']),
  description: z.string().trim().optional().or(z.literal('')),
  imageUrl: z.string().optional(),
  imageKey: z.string().optional(),
  order: z.number().int(),
})

export type OfficeInput = z.infer<typeof officeSchema>
