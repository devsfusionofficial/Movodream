import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const officeSchema = new Schema(
  {
    city: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    address: { type: String },
    gmbLink: { type: String },
    status: { type: String, enum: ['live', 'comingSoon'], default: 'comingSoon' },
    description: { type: String },
    image: {
      url: { type: String },
      key: { type: String },
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

officeSchema.index({ order: 1, city: 1 })
officeSchema.index({ status: 1, order: 1 })
officeSchema.index({ createdAt: -1 })

export type OfficeDoc = InferSchemaType<typeof officeSchema>

export const Office = mongoose.models.Office ?? mongoose.model('Office', officeSchema)
