import { Schema, model, models, type InferSchemaType, type HydratedDocument } from 'mongoose'
import { APPLICATION_STATUSES } from '@/lib/application-status'

const applicationSchema = new Schema(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String },
    experience: { type: String },
    qualification: { type: String },
    coverLetter: { type: String },
    resumeKey: { type: String, required: true },
    resumeFileName: { type: String, required: true },
    status: { type: String, enum: APPLICATION_STATUSES, default: 'Applied', index: true },
    internalNotes: { type: String },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

type ApplicationDocument = HydratedDocument<InferSchemaType<typeof applicationSchema>>

applicationSchema.pre<ApplicationDocument>('save', function () {
  // `isNew` flips to false only once the save completes — capture it now so
  // the post-save hook below knows this was a create, not a status update.
  this.$locals.isNewApplication = this.isNew
})

// HR notification only fires on the initial application in background
applicationSchema.post<ApplicationDocument>('save', function (doc) {
  if (!doc.$locals.isNewApplication) return

  // Fire in the background without blocking the HTTP response
  ;(async () => {
    try {
      const { sendApplicationNotification } = await import('@/lib/mailer')
      const { Job } = await import('@/models/Job')

      const job = await Job.findById(doc.job).lean<{ title: string } | null>()
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? ''

      await sendApplicationNotification({
        jobTitle: job?.title ?? 'Unknown role',
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        location: doc.location ?? undefined,
        experience: doc.experience ?? undefined,
        qualification: doc.qualification ?? undefined,
        coverLetter: doc.coverLetter ?? undefined,
        applicationUrl: `${baseUrl}/admin/applications/${doc._id}`,
        resumeFileName: doc.resumeFileName,
      })
    } catch (err) {
      console.error('Failed to send application notification email in background:', err)
    }
  })()
})

// Every admin list sorts by createdAt. Without this index MongoDB does an
// in-memory sort, which is slow and hard-fails past the 32MB sort limit
// once the collection grows.
applicationSchema.index({ createdAt: -1 })
applicationSchema.index({ status: 1, createdAt: -1 })
applicationSchema.index({ job: 1, createdAt: -1 })
applicationSchema.index({ job: 1, status: 1 })
applicationSchema.index({ email: 1 })

export type ApplicationDoc = InferSchemaType<typeof applicationSchema>

export const Application = models.Application ?? model('Application', applicationSchema)
