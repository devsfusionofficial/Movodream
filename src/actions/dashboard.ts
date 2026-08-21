'use server'

import { requireSession } from '@/lib/auth-guard'
import { connectDB } from '@/lib/db'
import { roles, type AppRole, type statement } from '@/lib/permissions'
import { Post } from '@/models/Post'
import { Job } from '@/models/Job'
import { Application } from '@/models/Application'
import { Subscriber } from '@/models/Subscriber'
// `populate('job')` needs the Job schema registered in this server bundle.
import '@/models/Job'

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

function canRead(role: AppRole, resource: keyof typeof statement) {
  return roles[role]?.authorize({ [resource]: ['read'] } as never)?.success ?? false
}

const ZERO = { total: 0, highlighted: 0 }

export type DashboardSnapshot = Awaited<ReturnType<typeof getDashboardSnapshot>>

/**
 * Counts + the handful of recent rows the dashboard actually renders.
 *
 * The previous implementation called listPosts/listJobs/listApplications/
 * listSubscribers, each of which does an unbounded `find()` with `populate()`
 * — four entire collections pulled into memory, JSON round-tripped, then
 * thrown away except for four counts and eight rows. This does the counting
 * in the database and fetches only the rows that are displayed.
 */
export async function getDashboardSnapshot() {
  const session = await requireSession()
  const role = ((session.user as { role?: AppRole }).role ?? 'editor') as AppRole
  await connectDB()

  const mayReadPosts = canRead(role, 'posts')
  const mayReadJobs = canRead(role, 'jobs')
  const mayReadApplications = canRead(role, 'applications')
  const mayReadSubscribers = canRead(role, 'subscribers')

  const [
    postsTotal, postsPublished,
    jobsTotal, jobsPublished,
    applicationsTotal, applicationsNew,
    subscribersTotal, subscribersActive,
    recentPosts, recentApplications,
  ] = await Promise.all([
    mayReadPosts ? Post.countDocuments() : 0,
    mayReadPosts ? Post.countDocuments({ status: 'published' }) : 0,
    mayReadJobs ? Job.countDocuments() : 0,
    mayReadJobs ? Job.countDocuments({ status: 'published' }) : 0,
    mayReadApplications ? Application.countDocuments() : 0,
    mayReadApplications ? Application.countDocuments({ status: 'Applied' }) : 0,
    mayReadSubscribers ? Subscriber.countDocuments() : 0,
    mayReadSubscribers ? Subscriber.countDocuments({ status: 'active' }) : 0,
    mayReadPosts
      ? Post.find().sort({ createdAt: -1 }).limit(4).select('title status createdAt').lean()
      : [],
    mayReadApplications
      ? Application.find().sort({ createdAt: -1 }).limit(4).select('name status job').populate('job', 'title').lean()
      : [],
  ])

  return {
    name: session.user.name ?? null,
    metrics: {
      posts: mayReadPosts ? { total: postsTotal, highlighted: postsPublished } : ZERO,
      jobs: mayReadJobs ? { total: jobsTotal, highlighted: jobsPublished } : ZERO,
      applications: mayReadApplications ? { total: applicationsTotal, highlighted: applicationsNew } : ZERO,
      subscribers: mayReadSubscribers ? { total: subscribersTotal, highlighted: subscribersActive } : ZERO,
    },
    visible: {
      posts: mayReadPosts,
      jobs: mayReadJobs,
      applications: mayReadApplications,
      subscribers: mayReadSubscribers,
    },
    recentPosts: serialize(recentPosts),
    recentApplications: serialize(recentApplications),
  }
}
