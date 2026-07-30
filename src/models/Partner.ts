import { Schema, model, models, type InferSchemaType } from 'mongoose'

const partnerSchema = new Schema(
  {
    name: { type: String, required: true },
    logo: {
      url: { type: String },
      key: { type: String },
    },
    url: { type: String },
    category: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export type PartnerDoc = InferSchemaType<typeof partnerSchema>

export const Partner = models.Partner ?? model('Partner', partnerSchema)
