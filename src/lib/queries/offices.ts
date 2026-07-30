import 'server-only'
import { connectDB } from '@/lib/db'
import { Office } from '@/models/Office'

/**
 * Public, unauthenticated reads for the /offices routes — distinct from
 * actions/offices.ts, which is the admin-gated CRUD layer. Never import the
 * admin actions from a public page; they'll throw for a logged-out visitor.
 */

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

export async function getPublicOffices() {
  await connectDB()
  const offices = await Office.find().sort({ order: 1, city: 1 }).lean()
  return serialize(offices)
}

export async function getPublicOfficeBySlug(slug: string) {
  await connectDB()
  const office = await Office.findOne({ slug }).lean()
  return office ? serialize(office) : null
}
