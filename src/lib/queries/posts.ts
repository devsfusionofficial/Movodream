import 'server-only'
import { unstable_cache } from 'next/cache'
import { connectDB } from '@/lib/db'
import { Post } from '@/models/Post'
import { Category } from '@/models/Category'
import '@/models/Author'
import '@/models/Tag'

/**
 * Public, unauthenticated reads for /blog — cached with ISR for instant edge responses.
 */

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

const PUBLISHED = {
  status: 'published',
  $or: [
    { publishedAt: { $lte: new Date() } },
    { publishedAt: { $exists: false } },
    { publishedAt: null },
  ],
}

async function fetchFeaturedPosts(limit = 3) {
  await connectDB()
  const posts = await Post.find(PUBLISHED)
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate('author', 'name avatar')
    .populate('categories', 'name slug')
    .lean()
  return serialize(posts)
}

export const getFeaturedPosts = unstable_cache(
  fetchFeaturedPosts,
  ['featured-posts'],
  { revalidate: 1800, tags: ['posts'] }
)

async function fetchLatestPosts(skip = 0, limit = 9) {
  await connectDB()
  const posts = await Post.find(PUBLISHED)
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('author', 'name avatar')
    .populate('categories', 'name slug')
    .lean()
  return serialize(posts)
}

export function getLatestPosts({ skip = 0, limit = 9 }: { skip?: number; limit?: number } = {}) {
  return unstable_cache(
    () => fetchLatestPosts(skip, limit),
    [`latest-posts-${skip}-${limit}`],
    { revalidate: 1800, tags: ['posts'] }
  )()
}

async function fetchPublishedPostsCount() {
  await connectDB()
  return await Post.countDocuments(PUBLISHED)
}

export const getPublishedPostsCount = unstable_cache(
  fetchPublishedPostsCount,
  ['published-posts-count'],
  { revalidate: 1800, tags: ['posts'] }
)

async function fetchPostsByCategorySlug(categorySlug: string) {
  await connectDB()
  const category = await Category.findOne({ slug: categorySlug }).lean()
  if (!category) return { category: null, posts: [] }

  const posts = await Post.find({ ...PUBLISHED, categories: category._id })
    .sort({ publishedAt: -1 })
    .populate('author', 'name avatar')
    .populate('categories', 'name slug')
    .lean()

  return { category: serialize(category), posts: serialize(posts) }
}

export function getPostsByCategorySlug(categorySlug: string) {
  return unstable_cache(
    () => fetchPostsByCategorySlug(categorySlug),
    [`posts-category-${categorySlug}`],
    { revalidate: 1800, tags: ['posts', 'categories'] }
  )()
}

export async function searchPosts(query: string) {
  if (!query.trim()) return []
  await connectDB()
  const posts = await Post.find({ ...PUBLISHED, $text: { $search: query } })
    .populate('author', 'name avatar')
    .populate('categories', 'name slug')
    .lean()
  return serialize(posts)
}

async function fetchPostBySlug(slug: string) {
  await connectDB()
  const post = await Post.findOne({ slug, ...PUBLISHED })
    .populate('author', 'name bio avatar socialLinks')
    .populate('categories', 'name slug')
    .populate('tags', 'name slug')
    .lean()
  return post ? serialize(post) : null
}

export function getPostBySlug(slug: string) {
  return unstable_cache(
    () => fetchPostBySlug(slug),
    [`post-slug-${slug}`],
    { revalidate: 1800, tags: ['posts'] }
  )()
}

async function fetchRelatedPosts(postId: string, categoryIds: string[], limit = 3) {
  await connectDB()
  if (categoryIds.length === 0) return []

  const posts = await Post.find({
    ...PUBLISHED,
    _id: { $ne: postId },
    categories: { $in: categoryIds },
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate('categories', 'name slug')
    .lean()
  return serialize(posts)
}

export function getRelatedPosts(post: { _id: string; categories: { _id: string }[] }, limit = 3) {
  const categoryIds = (post.categories || []).map((c) => c._id)
  return unstable_cache(
    () => fetchRelatedPosts(post._id, categoryIds, limit),
    [`related-posts-${post._id}-${limit}`],
    { revalidate: 1800, tags: ['posts'] }
  )()
}

async function fetchAllCategories() {
  await connectDB()
  const categories = await Category.find().sort({ name: 1 }).lean()
  return serialize(categories)
}

export const getAllCategories = unstable_cache(
  fetchAllCategories,
  ['all-categories'],
  { revalidate: 3600, tags: ['categories'] }
)

async function fetchCategoriesWithCounts() {
  await connectDB()
  const categories = await Category.find().lean()
  const counts = await Promise.all(
    categories.map((cat) => Post.countDocuments({ ...PUBLISHED, categories: cat._id }))
  )
  const list = categories.map((cat, i) => ({
    ...cat,
    count: counts[i],
  }))
  list.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  return serialize(list)
}

export const getCategoriesWithCounts = unstable_cache(
  fetchCategoriesWithCounts,
  ['categories-with-counts'],
  { revalidate: 1800, tags: ['categories', 'posts'] }
)
