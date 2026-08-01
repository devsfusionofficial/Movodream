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
  const { id } = await params

  await connectDB()
  const job = await Job.findOne(
    mongoose.isValidObjectId(id) ? { $or: [{ _id: id }, { slug: id }] } : { slug: id }
  ).lean<{ _id: mongoose.Types.ObjectId; status: string } | null>()

  if (!job || job.status !== 'published') {
    return NextResponse.json({ success: false, error: 'This role is not accepting applications.' }, { status: 404 })
  }

  const formData = await request.formData()
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
    return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const resume = formData.get('resume')
  if (!(resume instanceof File) || resume.size === 0) {
    return NextResponse.json({ success: false, error: 'A resume file is required.' }, { status: 400 })
  }

  const buffer = Buffer.from(await resume.arrayBuffer())
  const validation = isAllowedResumeFile(buffer, resume.size)
  if (!validation.ok) {
    return NextResponse.json({ success: false, error: validation.reason }, { status: 400 })
  }

  const { key } = await uploadBuffer('resumes', resume.name, validation.mimeType, buffer)

  await new Application({
    job: job._id,
    ...parsed.data,
    resumeKey: key,
    resumeFileName: resume.name,
  }).save()

  return NextResponse.json({ success: true })
}
