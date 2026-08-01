'use server'

import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/auth-guard'
import { connectDB } from '@/lib/db'
import { Application } from '@/models/Application'
import { createDownloadUrl } from '@/lib/r2'
import { applicationStatusSchema, type ApplicationStatusInput } from '@/lib/validation/application'

export type ActionResult = { success: true } | { success: false; error: string }

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

export async function listApplications() {
  await requirePermission('applications', ['read'])
  await connectDB()
  const applications = await Application.find().sort({ createdAt: -1 }).populate('job', 'title').lean()
  return serialize(applications)
}

export async function getApplication(id: string) {
  await requirePermission('applications', ['read'])
  await connectDB()
  const application = await Application.findById(id).populate('job', 'title').lean()
  return application ? serialize(application) : null
}

export async function updateApplicationStatus(id: string, input: ApplicationStatusInput): Promise<ActionResult> {
  await requirePermission('applications', ['updateStatus'])
  const parsed = applicationStatusSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  await connectDB()
  try {
    await Application.findByIdAndUpdate(id, parsed.data)
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update status' }
  }

  revalidatePath('/admin/applications')
  revalidatePath(`/admin/applications/${id}`)
  return { success: true }
}

export async function getApplicationResumeUrl(id: string): Promise<{ url: string } | { error: string }> {
  await requirePermission('applications', ['read'])
  await connectDB()
  const application = await Application.findById(id).lean<{ resumeKey: string } | null>()
  if (!application) return { error: 'Application not found' }

  const url = await createDownloadUrl(application.resumeKey)
  return { url }
}
