'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getAuth } from '@/lib/auth'
import { requirePermission } from '@/lib/auth-guard'
import { createUserSchema, type CreateUserInput } from '@/lib/validation/user'

export type ActionResult = { success: true } | { success: false; error: string }

export async function listUsers() {
  await requirePermission('user', ['list'])
  const auth = await getAuth()
  const result = await auth.api.listUsers({
    query: { limit: 100, sortBy: 'createdAt', sortDirection: 'desc' },
    headers: await headers(),
  })
  return result.users
}

export async function createUser(input: CreateUserInput): Promise<ActionResult> {
  await requirePermission('user', ['create'])

  const parsed = createUserSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  const auth = await getAuth()

  try {
    await auth.api.createUser({
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
        role: parsed.data.role,
      },
      headers: await headers(),
    })
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to create user' }
  }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function setUserRole(userId: string, role: CreateUserInput['role']): Promise<ActionResult> {
  await requirePermission('user', ['set-role'])
  const auth = await getAuth()

  try {
    await auth.api.setRole({ body: { userId, role }, headers: await headers() })
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update role' }
  }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function removeUser(userId: string): Promise<ActionResult> {
  await requirePermission('user', ['delete'])
  const auth = await getAuth()

  try {
    await auth.api.removeUser({ body: { userId }, headers: await headers() })
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to remove user' }
  }

  revalidatePath('/admin/users')
  return { success: true }
}
