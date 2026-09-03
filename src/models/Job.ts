import { Schema, model, models, type InferSchemaType, type HydratedDocument } from 'mongoose'
import { slugify } from '@/lib/utils'

const jobSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    department: { type: String, trim: true },
    location: { type: String, trim: true },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
      default: 'Full-time',
    },
    experience: { type: String, trim: true },
    qualification: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    shortDescription: { type: String, default: '', trim: true },
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
  if (this.department) this.department = this.department.trim()
  if (this.location) this.location = this.location.trim()
})

// Every admin list sorts by createdAt. Without this index MongoDB does an
// in-memory sort, which is slow and hard-fails past the 32MB sort limit
// once the collection grows.
jobSchema.index({ createdAt: -1 })
jobSchema.index({ status: 1, createdAt: -1 })
jobSchema.index({ status: 1, department: 1, location: 1 })

export type JobDoc = InferSchemaType<typeof jobSchema>

if (models.Job && !models.Job.schema.paths.shortDescription) {
  delete (models as any).Job
}

export const Job = models.Job ?? model('Job', jobSchema)
