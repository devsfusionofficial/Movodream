import 'server-only'
import { unstable_cache } from 'next/cache'
import { connectDB } from '@/lib/db'
import { Job } from '@/models/Job'

/**
 * Public, unauthenticated reads for /careers — cached with ISR for instant edge responses.
 */

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function getPublishedJobs({ department, location }: { department?: string; location?: string } = {}) {
  await connectDB()
  const query: Record<string, unknown> = { status: 'published' }
  if (department && department.trim()) {
    query.department = { $regex: new RegExp(`^${escapeRegex(department.trim())}$`, 'i') }
  }
  if (location && location.trim()) {
    query.location = { $regex: new RegExp(`^${escapeRegex(location.trim())}$`, 'i') }
  }

  const jobs = await Job.find(query).sort({ createdAt: -1 }).lean()
  return serialize(jobs)
}

export async function getPublishedJobsPaginated({
  department,
  location,
  page = 1,
  limit = 6,
}: {
  department?: string
  location?: string
  page?: number
  limit?: number
} = {}) {
  await connectDB()
  const query: Record<string, unknown> = { status: 'published' }
  if (department && department.trim()) {
    query.department = { $regex: new RegExp(`^${escapeRegex(department.trim())}$`, 'i') }
  }
  if (location && location.trim()) {
    query.location = { $regex: new RegExp(`^${escapeRegex(location.trim())}$`, 'i') }
  }

  const safePage = Math.max(1, page)
  const safeLimit = Math.max(1, limit)
  const skip = (safePage - 1) * safeLimit

  const [totalJobs, jobs] = await Promise.all([
    Job.countDocuments(query),
    Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
  ])

  const totalPages = Math.ceil(totalJobs / safeLimit)

  return {
    jobs: serialize(jobs),
    totalJobs,
    page: safePage,
    totalPages: totalPages || 1,
    limit: safeLimit,
  }
}

async function fetchJobFilterOptions() {
  await connectDB()
  const [departments, locations] = await Promise.all([
    Job.distinct('department', { status: 'published' }),
    Job.distinct('location', { status: 'published' }),
  ])
  return {
    departments: departments.filter(Boolean) as string[],
    locations: locations.filter(Boolean) as string[],
  }
}

export const getJobFilterOptions = unstable_cache(
  fetchJobFilterOptions,
  ['job-filter-options'],
  { revalidate: 3600, tags: ['jobs'] }
)

export async function getJobBySlug(slug: string) {
  await connectDB()
  const job = await Job.findOne({ slug }).lean()
  return job ? serialize(job) : null
}
