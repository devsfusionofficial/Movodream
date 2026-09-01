import 'server-only'
import { unstable_cache } from 'next/cache'
import { connectDB } from '@/lib/db'
import { Partner } from '@/models/Partner'

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

async function fetchPartners() {
  try {
    await connectDB()
    const partners = await Partner.find().sort({ order: 1, name: 1 }).lean()
    return serialize(partners)
  } catch (error) {
    console.error('Failed to fetch partners (fallback to empty list):', error)
    return []
  }
}

export const getPublicPartners = unstable_cache(
  fetchPartners,
  ['public-partners'],
  { revalidate: 3600, tags: ['partners'] }
)
