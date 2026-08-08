import { createAccessControl } from 'better-auth/plugins/access'
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access'

/**
 * Every manageable resource in the admin, and the actions that can be
 * performed on it. Adding a new admin-manageable resource later means
 * adding a line here, not learning a new framework's config API.
 *
 * `user` and `session` come from Better Auth's own admin plugin (account
 * creation, role changes, bans, session revocation) — merged in here so
 * they're covered by the same `ac`/`roles` the app's own resources use,
 * instead of relying on Better Auth's separate default roles.
 */
export const statement = {
  ...defaultStatements,
  posts: ['create', 'read', 'update', 'delete', 'publish'],
  categories: ['create', 'read', 'update', 'delete'],
  tags: ['create', 'read', 'update', 'delete'],
  authors: ['create', 'read', 'update', 'delete'],
  jobs: ['create', 'read', 'update', 'delete', 'publish'],
  applications: ['read', 'updateStatus'],
  subscribers: ['read', 'update', 'export', 'send'],
  contacts: ['read', 'delete'],
  offices: ['create', 'read', 'update', 'delete'],
  partners: ['create', 'read', 'update', 'delete'],
  media: ['create', 'read', 'delete'],
} as const

export const ac = createAccessControl(statement)

export const roles = {
  admin: ac.newRole({
    ...adminAc.statements,
    posts: ['create', 'read', 'update', 'delete', 'publish'],
    categories: ['create', 'read', 'update', 'delete'],
    tags: ['create', 'read', 'update', 'delete'],
    authors: ['create', 'read', 'update', 'delete'],
    jobs: ['create', 'read', 'update', 'delete', 'publish'],
    applications: ['read', 'updateStatus'],
    subscribers: ['read', 'update', 'export', 'send'],
    contacts: ['read', 'delete'],
    offices: ['create', 'read', 'update', 'delete'],
    partners: ['create', 'read', 'update', 'delete'],
    media: ['create', 'read', 'delete'],
  }),
  editor: ac.newRole({
    posts: ['create', 'read', 'update', 'delete', 'publish'],
    categories: ['create', 'read', 'update', 'delete'],
    tags: ['create', 'read', 'update', 'delete'],
    authors: ['create', 'read', 'update', 'delete'],
    jobs: ['create', 'read', 'update', 'delete', 'publish'],
    offices: ['create', 'read', 'update', 'delete'],
    partners: ['create', 'read', 'update', 'delete'],
    media: ['create', 'read', 'delete'],
    applications: ['read'],
    subscribers: ['read'],
    contacts: ['read'],
  }),
  hr: ac.newRole({
    jobs: ['read'],
    applications: ['read', 'updateStatus'],
  }),
} as const

export type AppRole = keyof typeof roles
