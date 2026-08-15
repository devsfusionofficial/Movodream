'use client'

import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError, FieldGroup, FieldDescription } from '@/components/ui/field'
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

  async function onSubmit(values: JobInput) {
    try {
      const cleanInput: JobInput = JSON.parse(JSON.stringify(values))
      const result = jobId ? await updateJob(jobId, cleanInput) : await createJob(cleanInput)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success(jobId ? 'Job updated' : 'Job created')
      router.push('/admin/jobs')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save job')
    }
  }

  const skills = watch('skills') ?? []

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-none">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input id="title" {...register('title')} />
          <FieldError errors={[errors.title]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <Input id="slug" placeholder="Auto-generated from title if left blank" {...register('slug')} />
          <FieldError errors={[errors.slug]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="department">Department</FieldLabel>
          <Input id="department" {...register('department')} />
        </Field>

        <Field>
          <FieldLabel htmlFor="location">Location</FieldLabel>
          <Input id="location" placeholder="e.g. Delhi / Remote" {...register('location')} />
        </Field>

        <Field>
          <FieldLabel htmlFor="employmentType">Employment type</FieldLabel>
          <Select
            value={watch('employmentType')}
            onValueChange={(v) => v && setValue('employmentType', v as JobInput['employmentType'])}
          >
            <SelectTrigger id="employmentType">
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
        </Field>

        <Field>
          <FieldLabel htmlFor="experience">Experience</FieldLabel>
          <Input id="experience" placeholder="e.g. 2-4 years" {...register('experience')} />
        </Field>

        <Field>
          <FieldLabel htmlFor="qualification">Qualification</FieldLabel>
          <Input id="qualification" {...register('qualification')} />
        </Field>

        <Field>
          <FieldLabel htmlFor="skills">Skills</FieldLabel>
          <Input
            id="skills"
            placeholder="Comma-separated, e.g. React, Node.js, MongoDB"
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
          />
          <FieldDescription>Separate each skill with a comma.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel>Description</FieldLabel>
          <Controller
            control={control}
            name="descriptionJson"
            render={({ field }) => (
              <RichTextEditor
                initialContent={field.value}
                onChange={({ json, html }) => {
                  field.onChange(json)
                  setValue('descriptionHtml', html)
                }}
              />
            )}
          />
        </Field>

        <Field>
          <FieldLabel>Responsibilities</FieldLabel>
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

        <Field>
          <FieldLabel htmlFor="applicationDeadline">Application deadline</FieldLabel>
          <Input id="applicationDeadline" type="date" {...register('applicationDeadline')} />
        </Field>

        <Field>
          <FieldLabel htmlFor="status">Status</FieldLabel>
          <Select value={watch('status')} onValueChange={(v) => v && setValue('status', v as JobInput['status'])}>
            <SelectTrigger id="status">
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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : jobId ? 'Save changes' : 'Create job'}
        </Button>
      </FieldGroup>
    </form>
  )
}
