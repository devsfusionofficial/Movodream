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

postSchema.pre<PostDocument>('save', function () {
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

  // TODO(Phase 6): trigger the subscriber-broadcast email job here once the
  // Subscriber model + broadcast job exist.
})

export type PostDoc = InferSchemaType<typeof postSchema>

export const Post = models.Post ?? model('Post', postSchema)
