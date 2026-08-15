import 'server-only'
import { connectDB } from '@/lib/db'
import { Post } from '@/models/Post'
import { Category } from '@/models/Category'
import '@/models/Author'
import '@/models/Tag'

/**
 * Public, unauthenticated reads for /blog — distinct from actions/posts.ts,
 * which is the admin-gated CRUD layer.
 */

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

const PUBLISHED = { status: 'published', publishedAt: { $lte: new Date() } }

export async function getFeaturedPosts(limit = 3) {
  await connectDB()
  const posts = await Post.find(PUBLISHED)
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate('author', 'name avatar')
    .populate('categories', 'name slug')
    .lean()
  return serialize(posts)
}

export async function getLatestPosts({ skip = 0, limit = 9 }: { skip?: number; limit?: number } = {}) {
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

export async function getPublishedPostsCount() {
  await connectDB()
  return await Post.countDocuments(PUBLISHED)
}

export async function getPostsByCategorySlug(categorySlug: string) {
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

export async function searchPosts(query: string) {
  if (!query.trim()) return []
  await connectDB()
  const posts = await Post.find({ ...PUBLISHED, $text: { $search: query } })
    .populate('author', 'name avatar')
    .populate('categories', 'name slug')
    .lean()
  return serialize(posts)
}

export async function getPostBySlug(slug: string) {
  await connectDB()
  const post = await Post.findOne({ slug, ...PUBLISHED })
    .populate('author', 'name bio avatar socialLinks')
    .populate('categories', 'name slug')
    .populate('tags', 'name slug')
    .lean()
  return post ? serialize(post) : null
}

export async function getRelatedPosts(post: { _id: string; categories: { _id: string }[] }, limit = 3) {
  await connectDB()
  const categoryIds = post.categories.map((c) => c._id)
  if (categoryIds.length === 0) return []

  const posts = await Post.find({
    ...PUBLISHED,
    _id: { $ne: post._id },
    categories: { $in: categoryIds },
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate('categories', 'name slug')
    .lean()
  return serialize(posts)
}

export async function getAllCategories() {
  await connectDB()
  const categories = await Category.find().sort({ name: 1 }).lean()
  return serialize(categories)
}

export async function getCategoriesWithCounts() {
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
