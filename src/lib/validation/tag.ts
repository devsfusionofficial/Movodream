import { z } from 'zod'

export const tagSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z
    .string()
    .regex(/^[a-z0-9-]*$/, 'Lowercase letters, numbers, and hyphens only')
    .optional()
    .or(z.literal('')),
})

export type TagInput = z.infer<typeof tagSchema>
