import { z } from 'zod'

export const tagSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(50, 'Tag name cannot exceed 50 characters'),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]*$/, 'Lowercase letters, numbers, and hyphens only')
    .optional()
    .or(z.literal('')),
})

export type TagInput = z.infer<typeof tagSchema>
