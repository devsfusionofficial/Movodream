import { Schema, model, models, type InferSchemaType } from 'mongoose'

const mediaSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    width: { type: Number },
    height: { type: Number },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

export type MediaDoc = InferSchemaType<typeof mediaSchema>

export const Media = models.Media ?? model('Media', mediaSchema)
