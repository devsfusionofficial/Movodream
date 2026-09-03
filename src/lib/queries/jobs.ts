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
  try {
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
  } catch (error) {
    console.error('Failed to get published jobs:', error)
    return []
  }
}

export type PublishedJobItem = {
  _id: string
  title: string
  slug: string
  department?: string
  location?: string
  employmentType?: string
  experience?: string
  qualification?: string
  skills?: string[]
  shortDescription?: string
  applicationDeadline?: string
  status?: string
  createdAt?: string
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
  const safePage = Math.max(1, page)
  const safeLimit = Math.max(1, limit)
  const skip = (safePage - 1) * safeLimit

  try {
    await connectDB()
    const query: Record<string, unknown> = { status: 'published' }
    if (department && department.trim()) {
      query.department = { $regex: new RegExp(`^${escapeRegex(department.trim())}$`, 'i') }
    }
    if (location && location.trim()) {
      query.location = { $regex: new RegExp(`^${escapeRegex(location.trim())}$`, 'i') }
    }

    const startOfToday = new Date()
    startOfToday.setUTCHours(0, 0, 0, 0)

    const [result] = await Job.aggregate([
      { $match: query },
      {
        $addFields: {
          isExpired: {
            $cond: [
              {
                $or: [
                  { $eq: ['$status', 'closed'] },
                  {
                    $and: [
                      { $gt: ['$applicationDeadline', null] },
                      { $lt: ['$applicationDeadline', startOfToday] },
                    ],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          jobs: [
            { $sort: { isExpired: 1, createdAt: -1 } },
            { $skip: skip },
            { $limit: safeLimit },
            {
              $project: {
                _id: 1,
                title: 1,
                slug: 1,
                department: 1,
                location: 1,
                employmentType: 1,
                experience: 1,
                qualification: 1,
                skills: 1,
                shortDescription: 1,
                applicationDeadline: 1,
                status: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
    ])

    const totalJobs = result?.metadata[0]?.total ?? 0
    const jobs = result?.jobs ?? []
    const totalPages = Math.ceil(totalJobs / safeLimit)

    return {
      jobs: serialize(jobs) as unknown as PublishedJobItem[],
      totalJobs,
      page: safePage,
      totalPages: totalPages || 1,
      limit: safeLimit,
    }
  } catch (error) {
    console.error('Failed to get published jobs paginated:', error)
    return {
      jobs: [] as PublishedJobItem[],
      totalJobs: 0,
      page: safePage,
      totalPages: 1,
      limit: safeLimit,
    }
  }
}

async function fetchJobFilterOptions() {
  try {
    await connectDB()
    const [result] = await Job.aggregate([
      { $match: { status: 'published' } },
      {
        $facet: {
          departments: [
            { $group: { _id: '$department' } },
            { $match: { _id: { $nin: [null, ''] } } },
            { $sort: { _id: 1 } },
          ],
          locations: [
            { $group: { _id: '$location' } },
            { $match: { _id: { $nin: [null, ''] } } },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ])
    return {
      departments: (result?.departments?.map((d: any) => d._id) ?? []) as string[],
      locations: (result?.locations?.map((l: any) => l._id) ?? []) as string[],
    }
  } catch (error) {
    console.error('Failed to fetch job filter options:', error)
    return {
      departments: [],
      locations: [],
    }
  }
}

export const getJobFilterOptions = unstable_cache(
  fetchJobFilterOptions,
  ['job-filter-options'],
  { revalidate: 3600, tags: ['jobs'] }
)

export async function getJobBySlug(slug: string) {
  if (!slug) return null
  try {
    await connectDB()
    const decoded = decodeURIComponent(slug).trim()
    const job = await Job.findOne({
      $or: [
        { slug: decoded },
        { slug: { $regex: new RegExp(`^${escapeRegex(decoded)}$`, 'i') } },
      ],
    }).lean()
    return job ? serialize(job) : null
  } catch (error) {
    console.error(`Failed to get job by slug ${slug}:`, error)
    return null
  }
}
