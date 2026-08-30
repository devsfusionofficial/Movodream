import { z } from 'zod'

export const postSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z
    .string()
    .regex(/^[a-z0-9-]*$/, 'Lowercase letters, numbers, and hyphens only')
    .optional()
    .or(z.literal('')),
  excerpt: z.string().max(300, 'Keep the excerpt under 300 characters').optional(),
  contentJson: z.any().optional(),
  contentHtml: z.string().optional(),
  heroImageUrl: z.string().optional(),
  heroImageKey: z.string().optional(),
  authorId: z.string().optional().or(z.literal('')),
  categoryIds: z.array(z.string()),
  tagIds: z.array(z.string()),
  status: z.enum(['draft', 'published']),
  publishedAt: z.string().optional().or(z.literal('')),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoOgImage: z.string().optional(),
})

export type PostInput = z.infer<typeof postSchema>
