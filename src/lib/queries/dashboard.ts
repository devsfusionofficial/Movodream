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

  const [
    publishedPostsCount,
    totalPostsCount,
    publishedJobsCount,
    totalJobsCount,
    totalApplicationsCount,
    appliedApplicationsCount,
    activeSubscribersCount,
    totalSubscribersCount,
    recentPosts,
    recentApplications,
  ] = await Promise.all([
    canReadPosts ? Post.countDocuments({ status: 'published' }) : Promise.resolve(0),
    canReadPosts ? Post.countDocuments() : Promise.resolve(0),
    canReadJobs ? Job.countDocuments({ status: 'published' }) : Promise.resolve(0),
    canReadJobs ? Job.countDocuments() : Promise.resolve(0),
    canReadApplications ? Application.countDocuments() : Promise.resolve(0),
    canReadApplications ? Application.countDocuments({ status: 'Applied' }) : Promise.resolve(0),
    canReadSubscribers ? Subscriber.countDocuments({ status: 'active' }) : Promise.resolve(0),
    canReadSubscribers ? Subscriber.countDocuments() : Promise.resolve(0),
    canReadPosts
      ? Post.find()
          .select('title status createdAt')
          .sort({ createdAt: -1 })
          .limit(4)
          .lean()
      : Promise.resolve([]),
    canReadApplications
      ? Application.find()
          .select('name status job createdAt')
          .populate('job', 'title')
          .sort({ createdAt: -1 })
          .limit(4)
          .lean()
      : Promise.resolve([]),
  ])

  return {
    metrics: {
      publishedPosts: publishedPostsCount,
      totalPosts: totalPostsCount,
      publishedJobs: publishedJobsCount,
      totalJobs: totalJobsCount,
      totalApplications: totalApplicationsCount,
      appliedApplications: appliedApplicationsCount,
      activeSubscribers: activeSubscribersCount,
      totalSubscribers: totalSubscribersCount,
    },
    recentPosts: serialize(recentPosts) as unknown as RecentPostItem[],
    recentApplications: serialize(recentApplications) as unknown as RecentApplicationItem[],
  }
}
