import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z
    .string()
    .regex(/^[a-z0-9-]*$/, 'Lowercase letters, numbers, and hyphens only')
    .optional()
    .or(z.literal('')),
})

export type CategoryInput = z.infer<typeof categorySchema>
