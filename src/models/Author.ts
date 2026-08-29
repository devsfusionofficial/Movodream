import { Schema, model, models, type InferSchemaType } from 'mongoose'

const authorSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true },
    bio: { type: String },
    avatar: {
      url: { type: String },
      key: { type: String },
    },
    socialLinks: {
      twitter: { type: String },
      linkedin: { type: String },
      website: { type: String },
    },
  },
  { timestamps: true }
)

export type AuthorDoc = InferSchemaType<typeof authorSchema>

export const Author = models.Author ?? model('Author', authorSchema)
