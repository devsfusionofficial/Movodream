import mongoose, { Schema, type InferSchemaType } from 'mongoose'

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

authorSchema.index({ name: 1 })
authorSchema.index({ email: 1 }, { sparse: true })
authorSchema.index({ createdAt: -1 })

export type AuthorDoc = InferSchemaType<typeof authorSchema>

export const Author = mongoose.models.Author ?? mongoose.model('Author', authorSchema)
