'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Tag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError, FieldGroup, FieldDescription } from '@/components/ui/field'
import { createTag, updateTag } from '@/actions/tags'
import { tagSchema, type TagInput } from '@/lib/validation/tag'

import { slugify } from '@/lib/utils'
import type { FieldErrors } from 'react-hook-form'

type TagFormProps = { tagId?: string; defaultValues?: Partial<TagInput> }

export function TagForm({ tagId, defaultValues }: TagFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TagInput>({
    resolver: zodResolver(tagSchema),
    defaultValues: { name: '', slug: '', ...defaultValues },
  })

  const [slugTouched, setSlugTouched] = useState(Boolean(defaultValues?.slug))

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setValue('name', val, { shouldValidate: true })
    if (!slugTouched) {
      setValue('slug', slugify(val), { shouldValidate: true })
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugTouched(true)
    setValue('slug', slugify(e.target.value), { shouldValidate: true })
  }

  async function onSubmit(values: TagInput) {
    try {
      const cleanInput: TagInput = {
        name: values.name.trim(),
        slug: values.slug?.trim() ? slugify(values.slug) : slugify(values.name),
      }
      const result = tagId ? await updateTag(tagId, cleanInput) : await createTag(cleanInput)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success(tagId ? 'Tag updated successfully' : 'Tag created successfully')
      router.push('/admin/tags')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save tag')
    }
  }

  function onInvalid(formErrors: FieldErrors<TagInput>) {
    const firstError = Object.values(formErrors)[0]?.message
    toast.error(firstError ? String(firstError) : 'Please fill in all required fields.')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="w-full max-w-none outline-none">
      <div className="mb-4 flex items-center gap-3 border-b border-[#f0e9f0] pb-3.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0f7] text-[#e20b87]"><Tag className="h-4 w-4" /></div>
        <div><p className="text-sm font-semibold text-[#33283a]">Tag details</p><p className="mt-0.5 text-xs text-[#998d9c]">Keep labels short, recognizable, and URL-friendly.</p></div>
      </div>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            placeholder="e.g. Travel technology"
            {...register('name')}
            onChange={handleNameChange}
          />
          <FieldError errors={[errors.name]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <Input
            id="slug"
            placeholder="e.g. travel-technology"
            {...register('slug')}
            onChange={handleSlugChange}
          />
          <FieldDescription>Auto-generated from name. Used in URL: /blog?tag=&lt;slug&gt;.</FieldDescription>
          <FieldError errors={[errors.slug]} />
        </Field>
        <div className="flex flex-col-reverse items-stretch justify-end gap-3 border-t border-[#f0e9f0] pt-4 sm:flex-row sm:items-center">
          <Button type="button" variant="ghost" render={<Link href="/admin/tags" />} className="text-[#887f8e]">Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : tagId ? 'Save changes' : 'Create tag'}</Button>
        </div>
      </FieldGroup>
    </form>
  )
}
