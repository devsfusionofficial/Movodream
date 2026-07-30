import { z } from 'zod'

export const authorSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  avatarKey: z.string().optional(),
  twitter: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
})

export type AuthorInput = z.infer<typeof authorSchema>
