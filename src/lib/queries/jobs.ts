import 'server-only'
import { connectDB } from '@/lib/db'
import { Job } from '@/models/Job'

/**
 * Public, unauthenticated reads for /careers — distinct from actions/jobs.ts,
 * which is the admin-gated CRUD layer.
 */

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

export async function getPublishedJobs({ department, location }: { department?: string; location?: string } = {}) {
  await connectDB()
  const query: Record<string, unknown> = { status: 'published' }
  if (department) query.department = department
  if (location) query.location = location

  const jobs = await Job.find(query).sort({ createdAt: -1 }).lean()
  return serialize(jobs)
}

export async function getJobFilterOptions() {
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

export async function getJobBySlug(slug: string) {
  await connectDB()
  const job = await Job.findOne({ slug }).lean()
  return job ? serialize(job) : null
}
