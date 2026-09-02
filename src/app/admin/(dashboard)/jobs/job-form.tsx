'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm, Controller, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Briefcase, Building2, MapPin, Calendar, Wrench, FileText, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RichTextEditor } from '@/components/admin/rich-text-editor'
import { createJob, updateJob } from '@/actions/jobs'
import { jobSchema, type JobInput } from '@/lib/validation/job'

type JobFormProps = {
  jobId?: string
  defaultValues?: Partial<JobInput>
}

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'] as const

export function JobForm({ jobId, defaultValues }: JobFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<JobInput>({
    resolver: zodResolver(jobSchema),
    defaultValues: { status: 'draft', employmentType: 'Full-time', skills: [], ...defaultValues },
  })

  // Restore draft if a deployment occurred while the user was filling out the form
  useEffect(() => {
    if (!jobId) {
      try {
        const saved = sessionStorage.getItem('movodream_job_form_draft')
        if (saved) {
          const parsed = JSON.parse(saved)
          Object.entries(parsed).forEach(([k, v]) => {
            setValue(k as any, v)
          })
          sessionStorage.removeItem('movodream_job_form_draft')
          toast.info('Restored your draft job listing details.')
        }
      } catch {}
    }
  }, [jobId, setValue])

  const now = new Date()
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  async function onSubmit(values: JobInput) {
    try {
      if (values.applicationDeadline && values.applicationDeadline < todayStr) {
        if (!jobId || values.applicationDeadline !== defaultValues?.applicationDeadline) {
          toast.error('Application deadline cannot be in the past. Please select today or a future date.')
          return
        }
      }
      const cleanInput: JobInput = JSON.parse(JSON.stringify(values))
      const result = jobId ? await updateJob(jobId, cleanInput) : await createJob(cleanInput)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      // Clear draft on successful submit
      try {
        sessionStorage.removeItem('movodream_job_form_draft')
      } catch {}
      toast.success(jobId ? 'Job listing updated' : 'Job listing created successfully!')
      router.push('/admin/jobs')
      router.refresh()
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (
        msg.includes('Server Action') ||
        msg.includes('was not found on the server') ||
        msg.includes('failed-to-find-server-action')
      ) {
        try {
          sessionStorage.setItem('movodream_job_form_draft', JSON.stringify(values))
        } catch {}
        toast.error('A new application update was just deployed. Refreshing your page and keeping your draft intact...', {
          duration: 5000,
        })
        setTimeout(() => {
          window.location.reload()
        }, 1200)
        return
      }
      toast.error(err instanceof Error ? err.message : 'Failed to save job listing')
    }
  }

  function onInvalid(formErrors: FieldErrors<JobInput>) {
    const errorValues = Object.values(formErrors)
    const firstErr = errorValues[0]
    const message = typeof firstErr?.message === 'string' ? firstErr.message : 'Please fill all required fields before submitting.'
    toast.error(message)
  }

  const skills = watch('skills') ?? []

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="w-full">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Column (Primary Content & Editors) - 7 cols */}
        <div className="space-y-6 lg:col-span-7">
          {/* Section 1: Job Title & Slug */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#f0edf1] pb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fce8f2] text-[#d71789]">
                <Briefcase className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-bold text-[#21182a]">Role Title & Identity</h3>
            </div>

            <Field>
              <FieldLabel htmlFor="title" className="text-xs font-semibold text-[#21182a]">
                Job Position Title <span className="text-[#d71789]">*</span>
              </FieldLabel>
              <Input
                id="title"
                placeholder="e.g. Senior Frontend Engineer"
                className="h-10 rounded-xl border-[#dedede] text-sm focus:border-[#d71789]"
                {...register('title')}
              />
              <FieldError errors={[errors.title]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="slug" className="text-xs font-semibold text-[#21182a]">
                URL Slug
              </FieldLabel>
              <Input
                id="slug"
                placeholder="e.g. senior-frontend-engineer"
                className="h-10 rounded-xl border-[#dedede] text-xs font-mono focus:border-[#d71789]"
                {...register('slug')}
              />
              <FieldDescription className="text-[11px] text-[#887f8e]">
                Auto-generated from title if left blank.
              </FieldDescription>
              <FieldError errors={[errors.slug]} />
            </Field>
          </div>

          {/* Section 2: Job Overview Description */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 border-b border-[#f0edf1] pb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fce8f2] text-[#d71789]">
                <FileText className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-bold text-[#21182a]">
                Job Description & Summary <span className="text-[#d71789]">*</span>
              </h3>
            </div>

            <Field>
              <Controller
                control={control}
                name="descriptionJson"
                render={({ field }) => (
                  <RichTextEditor
                    initialContent={field.value}
                    onChange={({ json, html }) => {
                      field.onChange(json)
                      setValue('descriptionHtml', html, { shouldValidate: true })
                    }}
                  />
                )}
              />
              <input type="hidden" {...register('descriptionHtml')} />
              <FieldError errors={[errors.descriptionHtml]} />
            </Field>
          </div>

          {/* Section 3: Responsibilities */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 border-b border-[#f0edf1] pb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fce8f2] text-[#d71789]">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-bold text-[#21182a]">Key Responsibilities & Scope</h3>
            </div>

            <Field>
              <Controller
                control={control}
                name="responsibilitiesJson"
                render={({ field }) => (
                  <RichTextEditor
                    initialContent={field.value}
                    onChange={({ json, html }) => {
                      field.onChange(json)
                      setValue('responsibilitiesHtml', html)
                    }}
                  />
                )}
              />
            </Field>
          </div>
        </div>

        {/* Right Column (Parameters, Meta & Skills) - 5 cols */}
        <div className="space-y-6 lg:col-span-5">
          {/* Metadata Card */}
          <div className="rounded-2xl border border-[#ebe6ee] bg-[#faf8fb] p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#eee8f0] pb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fce8f2] text-[#d71789]">
                <Building2 className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-bold text-[#21182a]">Role Parameters</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="department" className="text-xs font-semibold text-[#21182a]">
                  Department
                </FieldLabel>
                <Input
                  id="department"
                  placeholder="e.g. Engineering"
                  className="h-10 rounded-xl border-[#dedede] bg-white text-xs focus:border-[#d71789]"
                  {...register('department')}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="location" className="text-xs font-semibold text-[#21182a]">
                  Location <span className="text-[#d71789]">*</span>
                </FieldLabel>
                <Input
                  id="location"
                  placeholder="e.g. Delhi / Remote"
                  className="h-10 rounded-xl border-[#dedede] bg-white text-xs focus:border-[#d71789]"
                  {...register('location')}
                />
                <FieldError errors={[errors.location]} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="employmentType" className="text-xs font-semibold text-[#21182a]">
                  Employment Type <span className="text-[#d71789]">*</span>
                </FieldLabel>
                <Select
                  value={watch('employmentType') || 'Full-time'}
                  onValueChange={(v) => v && setValue('employmentType', v as JobInput['employmentType'], { shouldValidate: true })}
                >
                  <SelectTrigger id="employmentType" className="h-10 w-full rounded-xl border-[#dedede] bg-white text-xs focus:border-[#d71789]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[errors.employmentType]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="status" className="text-xs font-semibold text-[#21182a]">
                  Publishing Status
                </FieldLabel>
                <Select
                  value={watch('status') || 'draft'}
                  onValueChange={(v) => v && setValue('status', v as JobInput['status'])}
                >
                  <SelectTrigger id="status" className="h-10 w-full rounded-xl border-[#dedede] bg-white text-xs focus:border-[#d71789]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError errors={[errors.status]} />
              </Field>
            </div>
          </div>

          {/* Requirements Card */}
          <div className="rounded-2xl border border-[#ebe6ee] bg-[#faf8fb] p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#eee8f0] pb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fce8f2] text-[#d71789]">
                <Wrench className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-bold text-[#21182a]">Candidate Requirements</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="experience" className="text-xs font-semibold text-[#21182a]">
                  Experience Level
                </FieldLabel>
                <Input
                  id="experience"
                  placeholder="e.g. 3-5 years"
                  className="h-10 rounded-xl border-[#dedede] bg-white text-xs focus:border-[#d71789]"
                  {...register('experience')}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="qualification" className="text-xs font-semibold text-[#21182a]">
                  Qualification
                </FieldLabel>
                <Input
                  id="qualification"
                  placeholder="e.g. B.Tech / Bachelor's"
                  className="h-10 rounded-xl border-[#dedede] bg-white text-xs focus:border-[#d71789]"
                  {...register('qualification')}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="applicationDeadline" className="text-xs font-semibold text-[#21182a]">
                Application Deadline
              </FieldLabel>
              <Input
                id="applicationDeadline"
                type="date"
                min={todayStr}
                className="h-10 rounded-xl border-[#dedede] bg-white text-xs focus:border-[#d71789]"
                {...register('applicationDeadline')}
              />
              <FieldDescription className="text-[11px] text-[#887f8e]">
                Candidates can apply until this date. Past dates cannot be selected.
              </FieldDescription>
              <FieldError errors={[errors.applicationDeadline]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="skills" className="text-xs font-semibold text-[#21182a]">
                Required Skills
              </FieldLabel>
              <Input
                id="skills"
                placeholder="e.g. React, Node.js, TypeScript"
                defaultValue={skills.join(', ')}
                onBlur={(e) =>
                  setValue(
                    'skills',
                    e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
                className="h-10 rounded-xl border-[#dedede] bg-white text-xs focus:border-[#d71789]"
              />
              <FieldDescription className="text-[11px] text-[#887f8e]">
                Separate skills with commas.
              </FieldDescription>

              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg bg-[#f0eaff] px-2 py-0.5 text-[11px] font-semibold text-[#6b43bb] border border-[#e2d5ff]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </Field>
          </div>

          {/* Action Buttons Container */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              render={<Link href="/admin/jobs" />}
              className="border-[#e6e1e9] text-[#21182a] hover:bg-[#f8f3f8]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 bg-gradient-to-r from-[#d71789] to-[#ff7294] px-6 text-white shadow-[0_6px_20px_rgba(215,23,137,0.25)] hover:opacity-95 border-0 font-semibold"
            >
              {isSubmitting ? 'Saving...' : jobId ? 'Save Job Changes' : 'Create Job Listing'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
