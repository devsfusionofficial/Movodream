'use server'

import { revalidatePath } from 'next/cache'
import type { HydratedDocument } from 'mongoose'
import { requirePermission } from '@/lib/auth-guard'
import { connectDB } from '@/lib/db'
import { Job, type JobDoc } from '@/models/Job'
import { jobSchema, type JobInput } from '@/lib/validation/job'
import { slugify } from '@/lib/utils'

export type ActionResult = { success: true } | { success: false; error: string }

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

export async function listJobs() {
  await requirePermission('jobs', ['read'])
  await connectDB()
  // Projection matters here: the list screens render a handful of columns,
  // but an unprojected find() ships every field of every row to the client
  // — including the full article/JD HTML and editor JSON. Detail screens
  // use their own get<X>(id) and still receive everything.
  const jobs = await Job.find()
    .select('title slug department location employmentType experience qualification skills shortDescription descriptionHtml responsibilitiesHtml applicationDeadline status createdAt')
    .sort({ createdAt: -1 })
    .lean()
  return serialize(jobs)
}

export async function getJob(id: string) {
  await requirePermission('jobs', ['read'])
  await connectDB()
  const job = await Job.findById(id).lean()
  return job ? serialize(job) : null
}

function applyJobInput(doc: HydratedDocument<JobDoc>, input: JobInput) {
  doc.title = input.title.trim()
  doc.slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title)
  doc.department = input.department
  doc.location = input.location
  doc.employmentType = input.employmentType
  doc.experience = input.experience
  doc.qualification = input.qualification
  doc.skills = input.skills
  doc.shortDescription = input.shortDescription?.trim() ?? ''
  doc.markModified('shortDescription')
  doc.descriptionJson = input.descriptionJson
  doc.descriptionHtml = input.descriptionHtml ?? ''
  doc.responsibilitiesJson = input.responsibilitiesJson
  doc.responsibilitiesHtml = input.responsibilitiesHtml ?? ''
  doc.applicationDeadline = input.applicationDeadline ? new Date(input.applicationDeadline) : undefined
  doc.status = input.status
}

export async function createJob(rawInput: JobInput): Promise<ActionResult> {
  const input: JobInput = JSON.parse(JSON.stringify(rawInput))
  await requirePermission('jobs', input.status === 'published' ? ['create', 'publish'] : ['create'])
  const parsed = jobSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  await connectDB()
  try {
    const doc = new Job()
    applyJobInput(doc, parsed.data)
    await doc.save()
  } catch (err: any) {
    if (err?.code === 11000) {
      return { success: false, error: 'A job listing with this title or slug already exists.' }
    }
    return { success: false, error: err instanceof Error ? err.message : 'Failed to create job' }
  }

  revalidatePath('/admin/jobs')
  revalidatePath('/careers')
  return { success: true }
}

export async function updateJob(id: string, rawInput: JobInput): Promise<ActionResult> {
  const input: JobInput = JSON.parse(JSON.stringify(rawInput))
  await requirePermission('jobs', input.status === 'published' ? ['update', 'publish'] : ['update'])
  const parsed = jobSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  await connectDB()
  let slug = ''
  try {
    const doc = await Job.findById(id)
    if (!doc) return { success: false, error: 'Job not found' }
    applyJobInput(doc, parsed.data)
    await doc.save()
    slug = doc.slug
  } catch (err: any) {
    if (err?.code === 11000) {
      return { success: false, error: 'A job listing with this title or slug already exists.' }
    }
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update job' }
  }

  revalidatePath('/admin/jobs')
  revalidatePath(`/admin/jobs/${id}/edit`)
  revalidatePath('/careers')
  if (slug) revalidatePath(`/careers/${slug}`)
  return { success: true }
}

export async function deleteJob(id: string): Promise<ActionResult> {
  await requirePermission('jobs', ['delete'])
  await connectDB()
  try {
    await Job.findByIdAndDelete(id)
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete job' }
  }

  revalidatePath('/admin/jobs')
  revalidatePath('/careers')
  return { success: true }
}
