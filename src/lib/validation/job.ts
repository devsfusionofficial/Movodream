import { z } from 'zod'

export const jobSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Job title is required (at least 2 characters)'),
  slug: z
    .string()
    .regex(/^[a-z0-9-]*$/, 'Lowercase letters, numbers, and hyphens only')
    .optional()
    .or(z.literal('')),
  department: z.string().optional(),
  location: z
    .string()
    .trim()
    .min(2, 'Location is required (e.g. Delhi, Remote, India)'),
  employmentType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']),
  experience: z.string().optional(),
  qualification: z.string().optional(),
  skills: z.array(z.string()),
  shortDescription: z
    .string()
    .trim()
    .max(500, 'Short description must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
  descriptionJson: z.any().optional(),
  descriptionHtml: z
    .string()
    .refine(
      (val) => {
        if (!val) return false
        const stripped = val.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
        return stripped.length >= 5
      },
      { message: 'Job description is required' }
    ),
  responsibilitiesJson: z.any().optional(),
  responsibilitiesHtml: z.string().optional(),
  applicationDeadline: z.string().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'disabled', 'closed']),
})

export type JobInput = z.infer<typeof jobSchema>
