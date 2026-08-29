import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/db'
import { Job } from '@/models/Job'
import { Application } from '@/models/Application'
import { uploadBuffer } from '@/lib/r2'
import { isAllowedResumeFile } from '@/lib/file-validation'
import { applyFormSchema } from '@/lib/validation/application'

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
        { status: 400 }
      )
    }

    // 3. File check & buffer parsing
    const resume = formData.get('resume')
    if (!(resume instanceof File) || resume.size === 0) {
      return NextResponse.json({ success: false, error: 'A resume file is required.' }, { status: 400 })
    }

    const [buffer, job] = await Promise.all([
      resume.arrayBuffer().then((ab) => Buffer.from(ab)),
      Job.findOne(
        mongoose.isValidObjectId(id) ? { $or: [{ _id: id }, { slug: id }] } : { slug: id }
      ).select('_id status').lean<{ _id: mongoose.Types.ObjectId; status: string } | null>(),
    ])

    if (!job || job.status !== 'published') {
      return NextResponse.json(
        { success: false, error: 'This role is not accepting applications.' },
        { status: 404 }
      )
    }

    const validation = isAllowedResumeFile(buffer, resume.size)
    if (!validation.ok) {
      return NextResponse.json({ success: false, error: validation.reason }, { status: 400 })
    }

    // 4. Upload resume to R2 storage
    const { key } = await uploadBuffer('resumes', resume.name, validation.mimeType, buffer)

    // 5. Create application record in MongoDB
    await Application.create({
      job: job._id,
      ...parsed.data,
      resumeKey: key,
      resumeFileName: resume.name,
      status: 'Applied',
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Job application submission error:', err)
    return NextResponse.json(
      { success: false, error: 'Unable to submit your application. Please try again.' },
      { status: 500 }
    )
  }
}
