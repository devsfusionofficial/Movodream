import { Schema, model, models, type InferSchemaType } from 'mongoose'

const subscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    status: { type: String, enum: ['active', 'unsubscribed'], default: 'active', index: true },
    subscribedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

// Every admin list sorts by createdAt. Without this index MongoDB does an
// in-memory sort, which is slow and hard-fails past the 32MB sort limit
// once the collection grows.
subscriberSchema.index({ createdAt: -1 })
subscriberSchema.index({ status: 1, createdAt: -1 })

export type SubscriberDoc = InferSchemaType<typeof subscriberSchema>

export const Subscriber = models.Subscriber ?? model('Subscriber', subscriberSchema)
