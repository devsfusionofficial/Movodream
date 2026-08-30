import 'server-only'
import { unstable_cache } from 'next/cache'
import { connectDB } from '@/lib/db'
import { Office } from '@/models/Office'

/**
 * Public, unauthenticated reads for the /offices routes — distinct from
 * actions/offices.ts, which is the admin-gated CRUD layer.
 */

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

async function fetchPublicOffices() {
  await connectDB()
  const offices = await Office.find().sort({ order: 1, city: 1 }).lean()
  return serialize(offices)
}

export const getPublicOffices = unstable_cache(
  fetchPublicOffices,
  ['public-offices'],
  { revalidate: 3600, tags: ['offices'] }
)

async function fetchPublicOfficeBySlug(slug: string) {
  await connectDB()
  const office = await Office.findOne({ slug }).lean()
  return office ? serialize(office) : null
}

export function getPublicOfficeBySlug(slug: string) {
  return unstable_cache(
    () => fetchPublicOfficeBySlug(slug),
    [`public-office-${slug}`],
    { revalidate: 3600, tags: ['offices'] }
  )()
}
