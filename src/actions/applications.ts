'use server'

import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/auth-guard'
import { connectDB } from '@/lib/db'
import { Application } from '@/models/Application'
// `populate('job')` needs the Job schema registered in this server bundle.
import '@/models/Job'
import { createDownloadUrl, objectExists } from '@/lib/r2'
import { applicationStatusSchema, type ApplicationStatusInput } from '@/lib/validation/application'

export type ActionResult = { success: true } | { success: false; error: string }

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

export async function listApplications() {
  await requirePermission('applications', ['read'])
  await connectDB()
  // Projection matters here: the list screens render a handful of columns,
  // but an unprojected find() ships every field of every row to the client
  // — including the full article/JD HTML and editor JSON. Detail screens
  // use their own get<X>(id) and still receive everything.
  const applications = await Application.find()
    .select('name email status createdAt job')
    .sort({ createdAt: -1 })
    .populate('job', 'title')
    .lean()
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
  if (!application.resumeKey) return { error: 'No resume was attached to this application' }

  // The application record outlives the file: the resumes/ retention rule
  // deletes the object but leaves this row behind. Check before signing, so
  // the recruiter gets a clear message rather than a NoSuchKey XML page.
  if (!(await objectExists(application.resumeKey))) {
    return { error: 'This resume is no longer available — it passed the retention period and was deleted.' }
  }

  const url = await createDownloadUrl(application.resumeKey)
  return { url }
}

export async function deleteApplication(id: string): Promise<ActionResult> {
  await requirePermission('applications', ['delete'])
  await connectDB()
  try {
    await Application.findByIdAndDelete(id)
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete application' }
  }

  revalidatePath('/admin/applications')
  return { success: true }
}
