import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { admin as adminPlugin } from 'better-auth/plugins/admin'
import { getNativeClient, getNativeDb } from './db'
import { ac, roles } from './permissions'

async function createAuth() {
  const db = await getNativeDb()
  const client = await getNativeClient()

  return betterAuth({
    database: mongodbAdapter(db, { client, transaction: true }),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
      enabled: true,
      // Admin accounts are created via scripts/seed.ts or the /admin/users
      // screen, not public self-signup.
      disableSignUp: true,
    },
    plugins: [
      adminPlugin({
        ac,
        roles,
        defaultRole: 'editor',
        adminRoles: ['admin'],
      }),
    ],
  })
}

type Auth = Awaited<ReturnType<typeof createAuth>>

// Cached across dev HMR reloads, same pattern as the Mongoose connection in
// db.ts. Avoids top-level await (Better Auth needs an async Db handle) while
// still only constructing the instance once per server process.
const globalForAuth = globalThis as unknown as { authInstance?: Promise<Auth> }

export function getAuth(): Promise<Auth> {
  if (!globalForAuth.authInstance) {
    globalForAuth.authInstance = createAuth()
  }
  return globalForAuth.authInstance
}
