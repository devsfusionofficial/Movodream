'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getAuth } from '@/lib/auth'
import { requirePermission } from '@/lib/auth-guard'
import { createUserSchema, type CreateUserInput } from '@/lib/validation/user'

export type ActionResult = { success: true } | { success: false; error: string }

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

export async function listUsers() {
  await requirePermission('user', ['list'])
  const auth = await getAuth()
  const result = await auth.api.listUsers({
    query: { limit: 100, sortBy: 'createdAt', sortDirection: 'desc' },
    headers: await headers(),
  })
  return serialize(result.users)
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
        name: parsed.data.name.trim(),
        email: parsed.data.email.toLowerCase().trim(),
        password: parsed.data.password,
        role: parsed.data.role,
      },
      headers: await headers(),
    })
  } catch (err: any) {
    if (err?.message?.includes('already exists') || err?.code === 11000) {
      return { success: false, error: 'A user with this email address already exists.' }
    }
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
    const usersList = await auth.api.listUsers({
      query: { limit: 100 },
      headers: await headers(),
    })
    const targetUser = usersList.users.find((u) => u.id === userId)
    if (targetUser?.email?.toLowerCase() === 'harman.singh@movodream.com') {
      return { success: false, error: 'This Super Admin account is protected and cannot be removed.' }
    }

    await auth.api.removeUser({ body: { userId }, headers: await headers() })
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to remove user' }
  }

  revalidatePath('/admin/users')
  return { success: true }
}
