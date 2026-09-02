import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(50, 'Category name cannot exceed 50 characters'),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]*$/, 'Lowercase letters, numbers, and hyphens only')
    .optional()
    .or(z.literal('')),
})

export type CategoryInput = z.infer<typeof categorySchema>
