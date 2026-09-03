import { NextResponse, after } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/db'
import { Job } from '@/models/Job'
import { Application } from '@/models/Application'
import { uploadBuffer } from '@/lib/r2'
import { isAllowedResumeFile } from '@/lib/file-validation'
import { applyFormSchema } from '@/lib/validation/application'
import { sendApplicationNotification } from '@/lib/mailer'
import { isJobDeadlinePassed } from '@/lib/job-status'

type RouteParams = { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: RouteParams) {
  try {
    // 1. Concurrently parse params, formData, and initialize DB connection
    const [{ id }, formData] = await Promise.all([
      params,
      request.formData(),
      connectDB(),
    ])

    // 2. Immediate in-memory schema validation (0ms latency)
    const fields = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      location: String(formData.get('location') ?? ''),
      experience: String(formData.get('experience') ?? ''),
      qualification: String(formData.get('qualification') ?? ''),
      coverLetter: String(formData.get('coverLetter') ?? ''),
    }

    const parsed = applyFormSchema.safeParse(fields)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    // 3. File check & buffer parsing
    const resume = formData.get('resume')
    if (!(resume instanceof File) || resume.size === 0) {
      return NextResponse.json(
        { success: false, error: 'A resume file is required.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    const [buffer, job] = await Promise.all([
      resume.arrayBuffer().then((ab) => Buffer.from(ab)),
      Job.findOne(
        mongoose.isValidObjectId(id) ? { $or: [{ _id: id }, { slug: id }] } : { slug: id }
      ).select('_id title status applicationDeadline').lean<{ _id: mongoose.Types.ObjectId; title?: string; status: string; applicationDeadline?: Date } | null>(),
    ])

    if (!job || job.status !== 'published') {
      return NextResponse.json(
        { success: false, error: 'This role is not accepting applications.' },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    if (isJobDeadlinePassed(job.applicationDeadline)) {
      return NextResponse.json(
        { success: false, error: 'The application deadline for this position has passed. This role is no longer accepting applications.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    const validation = isAllowedResumeFile(buffer, resume.size)
    if (!validation.ok) {
      return NextResponse.json(
        { success: false, error: validation.reason },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    // 4. Upload resume to R2 storage
    const { key } = await uploadBuffer('resumes', resume.name, validation.mimeType, buffer)

    // 5. Create application record in MongoDB
    const appDoc = new Application({
      job: job._id,
      ...parsed.data,
      resumeKey: key,
      resumeFileName: resume.name,
      status: 'Applied',
    })
    appDoc.$locals.skipHookEmail = true
    const application = await appDoc.save()

    // 6. Asynchronously send email notification to HR using Next.js after()
    after(async () => {
      try {
        const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://movodream.com').replace(/\/+$/, '')
        await sendApplicationNotification({
          jobTitle: job.title || 'Career Opportunity',
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          location: parsed.data.location,
          experience: parsed.data.experience,
          qualification: parsed.data.qualification,
          coverLetter: parsed.data.coverLetter,
          applicationUrl: `${siteUrl}/admin/applications/${application._id}`,
          resumeFileName: resume.name,
        })
      } catch (notifyErr) {
        console.error('Background application notification error:', notifyErr)
      }
    })

    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    console.error('Job application submission error:', err)
    return NextResponse.json(
      { success: false, error: 'Unable to submit your application. Please try again.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
