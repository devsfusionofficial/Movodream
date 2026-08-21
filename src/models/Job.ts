import { Schema, model, models, type InferSchemaType, type HydratedDocument } from 'mongoose'
import { slugify } from '@/lib/utils'

const jobSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    department: { type: String },
    location: { type: String },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
      default: 'Full-time',
    },
    experience: { type: String },
    qualification: { type: String },
    skills: [{ type: String }],
    descriptionJson: { type: Schema.Types.Mixed },
    descriptionHtml: { type: String, default: '' },
    responsibilitiesJson: { type: Schema.Types.Mixed },
    responsibilitiesHtml: { type: String, default: '' },
    applicationDeadline: { type: Date },
    status: { type: String, enum: ['draft', 'published', 'disabled', 'closed'], default: 'draft', index: true },
  },
  { timestamps: true }
)

type JobDocument = HydratedDocument<InferSchemaType<typeof jobSchema>>

// Same reasoning as Post: slug must exist before the required-path
// validation runs, so this is pre('validate'), not pre('save').
jobSchema.pre<JobDocument>('validate', function () {
  if (!this.slug && this.title) this.slug = slugify(this.title)
})

// Every admin list sorts by createdAt. Without this index MongoDB does an
// in-memory sort, which is slow and hard-fails past the 32MB sort limit
// once the collection grows.
jobSchema.index({ createdAt: -1 })

export type JobDoc = InferSchemaType<typeof jobSchema>

export const Job = models.Job ?? model('Job', jobSchema)
