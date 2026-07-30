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

export type ContactSubmissionDoc = InferSchemaType<typeof contactSubmissionSchema>

export const ContactSubmission = models.ContactSubmission ?? model('ContactSubmission', contactSubmissionSchema)
