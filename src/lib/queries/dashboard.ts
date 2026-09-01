import 'server-only'

import { connectDB } from '@/lib/db'
import { Post } from '@/models/Post'
import { Job } from '@/models/Job'
import { Application } from '@/models/Application'
import { Subscriber } from '@/models/Subscriber'
import '@/models/Job' // Ensure registered for populate

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

export type RecentPostItem = {
  _id: string
  title: string
  status: string
  createdAt: string
}

export type RecentApplicationItem = {
  _id: string
  name: string
  status: string
  createdAt: string
  job?: { title?: string }
}

export async function getDashboardData({
  canReadPosts,
  canReadJobs,
  canReadApplications,
  canReadSubscribers,
}: {
  canReadPosts: boolean
  canReadJobs: boolean
  canReadApplications: boolean
  canReadSubscribers: boolean
}) {
  await connectDB()

  const [postResult, jobResult, applicationResult, subscriberResult] = await Promise.all([
    canReadPosts
      ? Post.aggregate([
          {
            $facet: {
              total: [{ $count: 'count' }],
              published: [{ $match: { status: 'published' } }, { $count: 'count' }],
              recent: [
                { $sort: { createdAt: -1 } },
                { $limit: 4 },
                { $project: { _id: 1, title: 1, status: 1, createdAt: 1 } },
              ],
            },
          },
        ])
      : Promise.resolve([]),

    canReadJobs
      ? Job.aggregate([
          {
            $facet: {
              total: [{ $count: 'count' }],
              published: [{ $match: { status: 'published' } }, { $count: 'count' }],
            },
          },
        ])
      : Promise.resolve([]),

    canReadApplications
      ? Application.aggregate([
          {
            $facet: {
              total: [{ $count: 'count' }],
              applied: [{ $match: { status: 'Applied' } }, { $count: 'count' }],
              recent: [
                { $sort: { createdAt: -1 } },
                { $limit: 4 },
                {
                  $lookup: {
                    from: 'jobs',
                    localField: 'job',
                    foreignField: '_id',
                    as: 'jobDoc',
                  },
                },
                {
                  $project: {
                    _id: 1,
                    name: 1,
                    status: 1,
                    createdAt: 1,
                    job: { $arrayElemAt: ['$jobDoc', 0] },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    name: 1,
                    status: 1,
                    createdAt: 1,
                    'job.title': 1,
                  },
                },
              ],
            },
          },
        ])
      : Promise.resolve([]),

    canReadSubscribers
      ? Subscriber.aggregate([
          {
            $facet: {
              total: [{ $count: 'count' }],
              active: [{ $match: { status: 'active' } }, { $count: 'count' }],
            },
          },
        ])
      : Promise.resolve([]),
  ])

  const postStats = postResult[0] ?? { total: [], published: [], recent: [] }
  const jobStats = jobResult[0] ?? { total: [], published: [] }
  const applicationStats = applicationResult[0] ?? { total: [], applied: [], recent: [] }
  const subscriberStats = subscriberResult[0] ?? { total: [], active: [] }

  return {
    metrics: {
      publishedPosts: postStats.published[0]?.count ?? 0,
      totalPosts: postStats.total[0]?.count ?? 0,
      publishedJobs: jobStats.published[0]?.count ?? 0,
      totalJobs: jobStats.total[0]?.count ?? 0,
      totalApplications: applicationStats.total[0]?.count ?? 0,
      appliedApplications: applicationStats.applied[0]?.count ?? 0,
      activeSubscribers: subscriberStats.active[0]?.count ?? 0,
      totalSubscribers: subscriberStats.total[0]?.count ?? 0,
    },
    recentPosts: serialize(postStats.recent) as unknown as RecentPostItem[],
    recentApplications: serialize(applicationStats.recent) as unknown as RecentApplicationItem[],
  }
}
