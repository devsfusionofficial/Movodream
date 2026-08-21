'use client'

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

type TagFormProps = { tagId?: string; defaultValues?: Partial<TagInput> }

export function TagForm({ tagId, defaultValues }: TagFormProps) {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TagInput>({ resolver: zodResolver(tagSchema), defaultValues })

  async function onSubmit(values: TagInput) {
    const result = tagId ? await updateTag(tagId, values) : await createTag(values)
    if (!result.success) { toast.error(result.error); return }
    toast.success(tagId ? 'Tag updated' : 'Tag created')
    router.push('/admin/tags')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-none outline-none">
      <div className="mb-4 flex items-center gap-3 border-b border-[#f0e9f0] pb-3.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0f7] text-[#e20b87]"><Tag className="h-4 w-4" /></div>
        <div><p className="text-sm font-semibold text-[#33283a]">Tag details</p><p className="mt-0.5 text-xs text-[#998d9c]">Keep labels short, recognizable, and URL-friendly.</p></div>
      </div>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" placeholder="e.g. Travel technology" {...register('name')} />
          <FieldError errors={[errors.name]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <Input id="slug" placeholder="e.g. travel-technology" {...register('slug')} />
          <FieldDescription>Used in the URL: /blog?tag=&lt;slug&gt;. Use lowercase words separated by hyphens.</FieldDescription>
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
