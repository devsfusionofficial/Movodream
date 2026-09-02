import { z } from 'zod'

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .refine((val) => /^[a-zA-Z]/.test(val), {
      message: 'Name must start with a letter',
    })
    .refine((val) => /^[a-zA-Z][a-zA-Z\s.'-]*$/.test(val), {
      message: 'Name can only contain letters, spaces, hyphens, and periods',
    }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Email is required')
    .email('Enter a valid email address')
    .refine(
      (val) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val),
      { message: 'Enter a valid email address with a domain (e.g. name@movodream.com)' }
    ),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .refine((val) => /[a-zA-Z]/.test(val), {
      message: 'Password must contain at least one letter',
    })
    .refine((val) => /[0-9]/.test(val), {
      message: 'Password must contain at least one number',
    }),
  role: z.literal('admin'),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

