import type { MetadataRoute } from 'next'
import { connectDB } from '@/lib/db'
import { Post } from '@/models/Post'
import { Job } from '@/models/Job'
import { Category } from '@/models/Category'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://movodream.com'

const STATIC_ROUTES = ['', '/about', '/product', '/cancellation-policy', '/blog', '/careers']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB()

  const [posts, jobs, categories] = await Promise.all([
    Post.find({ status: 'published' }).select('slug updatedAt').lean(),
    Job.find({ status: 'published' }).select('slug updatedAt').lean(),
    Category.find().select('slug').lean(),
  ])

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }))

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ?? new Date(),
  }))

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/blog/category/${category.slug}`,
    lastModified: new Date(),
  }))

  const jobEntries: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${SITE_URL}/careers/${job.slug}`,
    lastModified: job.updatedAt ?? new Date(),
  }))

  return [...staticEntries, ...postEntries, ...categoryEntries, ...jobEntries]
}
