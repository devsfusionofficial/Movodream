import { z } from 'zod'

export const jobSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z
    .string()
    .regex(/^[a-z0-9-]*$/, 'Lowercase letters, numbers, and hyphens only')
    .optional()
    .or(z.literal('')),
  department: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']),
  experience: z.string().optional(),
  qualification: z.string().optional(),
  skills: z.array(z.string()),
  descriptionJson: z.any().optional(),
  descriptionHtml: z.string().optional(),
  responsibilitiesJson: z.any().optional(),
  responsibilitiesHtml: z.string().optional(),
  applicationDeadline: z.string().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'disabled', 'closed']),
})

export type JobInput = z.infer<typeof jobSchema>
