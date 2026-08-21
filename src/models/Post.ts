import { Schema, model, models, type InferSchemaType, type HydratedDocument } from 'mongoose'
import { slugify, computeReadingTime } from '@/lib/utils'

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    heroImage: {
      url: { type: String },
      key: { type: String },
    },
    excerpt: { type: String },
    contentJson: { type: Schema.Types.Mixed },
    contentHtml: { type: String, default: '' },
    author: { type: Schema.Types.ObjectId, ref: 'Author' },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    status: { type: String, enum: ['draft', 'scheduled', 'published'], default: 'draft', index: true },
    publishedAt: { type: Date },
    readingTime: { type: Number, default: 1 },
    seo: {
      title: { type: String },
      description: { type: String },
      ogImage: { type: String },
    },
  },
  { timestamps: true }
)

postSchema.index({ status: 1, publishedAt: -1 })
postSchema.index({ title: 'text', excerpt: 'text' })

type PostDocument = HydratedDocument<InferSchemaType<typeof postSchema>>

// Slug must exist before Mongoose validates the required `slug` path, so
// this runs pre('validate'), not pre('save') — validation happens first.
postSchema.pre<PostDocument>('validate', function () {
  if (!this.slug && this.title) this.slug = slugify(this.title)
  if (this.isModified('contentHtml')) this.readingTime = computeReadingTime(this.contentHtml ?? '')

  const willPublish = this.isModified('status') && this.status === 'published'
  if (willPublish && !this.publishedAt) this.publishedAt = new Date()
  this.$locals.justPublished = willPublish
})

// Revalidation only works inside a real Next.js request scope — guarded so
// this hook is also safe to run from scripts/seed.ts, which imports this
// model directly outside any request context.
postSchema.post<PostDocument>('save', async function (doc) {
  if (!doc.$locals.justPublished) return

  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/blog')
    revalidatePath(`/blog/${doc.slug}`)
  } catch {
    // Not in a request scope (e.g. seed script) — nothing to revalidate.
  }

  try {
    const { sendPostPublishedBroadcast } = await import('@/lib/mailer')
    const { Subscriber } = await import('@/models/Subscriber')

    const subscribers = await Subscriber.find({ status: 'active' }).select('email').lean<{ email: string }[]>()
    if (subscribers.length > 0) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://movodream.com'
      await sendPostPublishedBroadcast({
        postTitle: doc.title,
        postExcerpt: doc.excerpt ?? undefined,
        postUrl: `${siteUrl}/blog/${doc.slug}`,
        subscriberEmails: subscribers.map((s) => s.email),
      })
    }
  } catch (err) {
    console.error('Failed to send post-published subscriber broadcast:', err)
  }
})

// Every admin list sorts by createdAt. Without this index MongoDB does an
// in-memory sort, which is slow and hard-fails past the 32MB sort limit
// once the collection grows.
postSchema.index({ createdAt: -1 })

export type PostDoc = InferSchemaType<typeof postSchema>

export const Post = models.Post ?? model('Post', postSchema)
