import { Schema, model, models, type InferSchemaType } from 'mongoose'

const tagSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
)

tagSchema.index({ name: 1 })
tagSchema.index({ createdAt: -1 })

export type TagDoc = InferSchemaType<typeof tagSchema>

export const Tag = models.Tag ?? model('Tag', tagSchema)
