import { Schema, model, models, type InferSchemaType } from 'mongoose'

const subscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    status: { type: String, enum: ['active', 'unsubscribed'], default: 'active', index: true },
    subscribedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export type SubscriberDoc = InferSchemaType<typeof subscriberSchema>

export const Subscriber = models.Subscriber ?? model('Subscriber', subscriberSchema)
