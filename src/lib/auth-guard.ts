import 'server-only'
import { cache } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getAuth } from './auth'
import { roles, type AppRole, type statement } from './permissions'

/**
 * Memoized per-request: safe to call from multiple Server Components/Actions
 * in the same render without hitting the session store repeatedly.
 */
export const getSession = cache(async () => {
  const auth = await getAuth()
  return auth.api.getSession({ headers: await headers() })
})

export async function requireSession() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  return session
}

export async function hasPermission(
  resource: keyof typeof statement,
  actions: string[]
) {
  const session = await getSession()
  if (!session) return false
  const role = ((session.user as { role?: AppRole }).role ?? 'admin') as AppRole
  const roleDef = roles[role] || roles.admin
  return roleDef?.authorize({ [resource]: actions } as never)?.success ?? false
}

/**
 * Page-level authorization guard for Server Components.
 * If unauthorized, cleanly redirects to /admin instead of throwing an unhandled runtime error.
 */
export async function requirePagePermission(
  resource: keyof typeof statement,
  actions: string[]
) {
  const session = await requireSession()
  const role = ((session.user as { role?: AppRole }).role ?? 'admin') as AppRole
  const roleDef = roles[role] || roles.admin

  const result = roleDef?.authorize({ [resource]: actions } as never)
  if (!result?.success) {
    redirect('/admin')
  }

  return session
}

/**
 * The real authorization check — called at the top of every Server Action
 * that mutates data, not only at the page/route level. A hidden nav link is
 * not a security boundary; this is.
 */
export async function requirePermission(
  resource: keyof typeof statement,
  actions: string[]
) {
  const session = await requireSession()
  const role = ((session.user as { role?: AppRole }).role ?? 'admin') as AppRole
  const roleDef = roles[role] || roles.admin

  const result = roleDef?.authorize({ [resource]: actions } as never)
  if (!result?.success) {
    throw new Error(`Forbidden: ${role} lacks [${actions.join(', ')}] on ${resource}`)
  }

  return session
}
