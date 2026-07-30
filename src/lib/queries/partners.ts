import 'server-only'
import { connectDB } from '@/lib/db'
import { Partner } from '@/models/Partner'

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

export async function getPublicPartners() {
  await connectDB()
  const partners = await Partner.find().sort({ order: 1, name: 1 }).lean()
  return serialize(partners)
}
