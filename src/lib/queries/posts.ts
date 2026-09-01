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

const POST_CARD_FIELDS = 'title slug excerpt heroImage author categories tags publishedAt readingTime status createdAt'

async function fetchFeaturedPosts(limit = 3) {
  try {
    await connectDB()
    const posts = await Post.find(PUBLISHED)
      .select(POST_CARD_FIELDS)
      .sort({ publishedAt: -1 })
      .limit(limit)
      .populate('author', 'name avatar')
      .populate('categories', 'name slug')
      .lean()
    return serialize(posts)
  } catch (error) {
    console.error('Failed to fetch featured posts:', error)
    return []
  }
}

export const getFeaturedPosts = unstable_cache(
  fetchFeaturedPosts,
  ['featured-posts'],
  { revalidate: 1800, tags: ['posts'] }
)

async function fetchLatestPosts(skip = 0, limit = 9) {
  try {
    await connectDB()
    const posts = await Post.find(PUBLISHED)
      .select(POST_CARD_FIELDS)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name avatar')
      .populate('categories', 'name slug')
      .lean()
    return serialize(posts)
  } catch (error) {
    console.error('Failed to fetch latest posts:', error)
    return []
  }
}

export function getLatestPosts({ skip = 0, limit = 9 }: { skip?: number; limit?: number } = {}) {
  return unstable_cache(
    () => fetchLatestPosts(skip, limit),
    [`latest-posts-${skip}-${limit}`],
    { revalidate: 1800, tags: ['posts'] }
  )()
}

async function fetchPublishedPostsCount() {
  try {
    await connectDB()
    return await Post.countDocuments(PUBLISHED)
  } catch (error) {
    console.error('Failed to fetch published posts count:', error)
    return 0
  }
}

export const getPublishedPostsCount = unstable_cache(
  fetchPublishedPostsCount,
  ['published-posts-count'],
  { revalidate: 1800, tags: ['posts'] }
)

async function fetchPostsByCategorySlug(categorySlug: string) {
  try {
    await connectDB()
    const category = await Category.findOne({ slug: categorySlug }).lean()
    if (!category) return { category: null, posts: [] }

    const posts = await Post.find({ ...PUBLISHED, categories: category._id })
      .select(POST_CARD_FIELDS)
      .sort({ publishedAt: -1 })
      .populate('author', 'name avatar')
      .populate('categories', 'name slug')
      .lean()

    return { category: serialize(category), posts: serialize(posts) }
  } catch (error) {
    console.error(`Failed to fetch posts by category ${categorySlug}:`, error)
    return { category: null, posts: [] }
  }
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
  try {
    await connectDB()
    const posts = await Post.find({ ...PUBLISHED, $text: { $search: query } })
      .select(POST_CARD_FIELDS)
      .populate('author', 'name avatar')
      .populate('categories', 'name slug')
      .lean()
    return serialize(posts)
  } catch (error) {
    console.error('Failed to search posts:', error)
    return []
  }
}

async function fetchPostBySlug(slug: string) {
  try {
    await connectDB()
    const post = await Post.findOne({ slug, ...PUBLISHED })
      .populate('author', 'name bio avatar socialLinks')
      .populate('categories', 'name slug')
      .populate('tags', 'name slug')
      .lean()
    return post ? serialize(post) : null
  } catch (error) {
    console.error(`Failed to fetch post by slug ${slug}:`, error)
    return null
  }
}

export function getPostBySlug(slug: string) {
  return unstable_cache(
    () => fetchPostBySlug(slug),
    [`post-slug-${slug}`],
    { revalidate: 1800, tags: ['posts'] }
  )()
}

async function fetchRelatedPosts(postId: string, categoryIds: string[], limit = 3) {
  if (categoryIds.length === 0) return []
  try {
    await connectDB()
    const posts = await Post.find({
      ...PUBLISHED,
      _id: { $ne: postId },
      categories: { $in: categoryIds },
    })
      .select('title slug excerpt heroImage categories publishedAt readingTime')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .populate('categories', 'name slug')
      .lean()
    return serialize(posts)
  } catch (error) {
    console.error('Failed to fetch related posts:', error)
    return []
  }
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
  try {
    await connectDB()
    const categories = await Category.find().sort({ name: 1 }).lean()
    return serialize(categories)
  } catch (error) {
    console.error('Failed to fetch all categories:', error)
    return []
  }
}

export const getAllCategories = unstable_cache(
  fetchAllCategories,
  ['all-categories'],
  { revalidate: 3600, tags: ['categories'] }
)

async function fetchCategoriesWithCounts() {
  try {
    await connectDB()
    // Run category fetch and single aggregation group count concurrently
    const [categories, categoryCounts] = await Promise.all([
      Category.find().sort({ name: 1 }).lean(),
      Post.aggregate([
        { $match: PUBLISHED },
        { $unwind: '$categories' },
        { $group: { _id: '$categories', count: { $sum: 1 } } },
      ]),
    ])

    const countMap = new Map(categoryCounts.map((c) => [String(c._id), c.count]))
    const list = categories.map((cat) => ({
      ...cat,
      count: countMap.get(String(cat._id)) ?? 0,
    }))

    list.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    return serialize(list)
  } catch (error) {
    console.error('Failed to fetch categories with counts:', error)
    return []
  }
}

export const getCategoriesWithCounts = unstable_cache(
  fetchCategoriesWithCounts,
  ['categories-with-counts'],
  { revalidate: 1800, tags: ['categories', 'posts'] }
)
