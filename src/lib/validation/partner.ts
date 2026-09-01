import { z } from 'zod'

export const partnerSchema = z.object({
  name: z.string().trim().min(2, 'Name is required (at least 2 characters)'),
  url: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+/i.test(val) || /^[\w-]+\.[\w.-]+/i.test(val), {
      message: 'Enter a valid website URL (e.g. https://example.com)',
    })
    .or(z.literal('')),
  category: z.string().trim().optional(),
  logoUrl: z.string().optional(),
  logoKey: z.string().optional(),
  order: z.number().int(),
})

export type PartnerInput = z.infer<typeof partnerSchema>
