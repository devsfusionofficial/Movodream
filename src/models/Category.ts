import { Schema, model, models, type InferSchemaType } from 'mongoose'

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
)

export type CategoryDoc = InferSchemaType<typeof categorySchema>

export const Category = models.Category ?? model('Category', categorySchema)
