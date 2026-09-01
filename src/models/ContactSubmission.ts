import { Schema, model, models, type InferSchemaType } from 'mongoose'

const contactSubmissionSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Every admin list sorts by createdAt. Without this index MongoDB does an
// in-memory sort, which is slow and hard-fails past the 32MB sort limit
// once the collection grows.
contactSubmissionSchema.index({ createdAt: -1 })
contactSubmissionSchema.index({ emailSent: 1, createdAt: -1 })

export type ContactSubmissionDoc = InferSchemaType<typeof contactSubmissionSchema>

export const ContactSubmission = models.ContactSubmission ?? model('ContactSubmission', contactSubmissionSchema)
