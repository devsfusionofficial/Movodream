import { z } from 'zod'

export const partnerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  category: z.string().optional(),
  logoUrl: z.string().optional(),
  logoKey: z.string().optional(),
  order: z.number().int(),
})

export type PartnerInput = z.infer<typeof partnerSchema>
