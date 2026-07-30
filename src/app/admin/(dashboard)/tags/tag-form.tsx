'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError, FieldGroup, FieldDescription } from '@/components/ui/field'
import { createTag, updateTag } from '@/actions/tags'
import { tagSchema, type TagInput } from '@/lib/validation/tag'

type TagFormProps = {
  tagId?: string
  defaultValues?: Partial<TagInput>
}

export function TagForm({ tagId, defaultValues }: TagFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TagInput>({
    resolver: zodResolver(tagSchema),
    defaultValues,
  })

  async function onSubmit(values: TagInput) {
    const result = tagId ? await updateTag(tagId, values) : await createTag(values)
    if (!result.success) {
      toast.error(result.error)
      return
    }
    toast.success(tagId ? 'Tag updated' : 'Tag created')
    router.push('/admin/tags')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-xl">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" {...register('name')} />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <Input id="slug" placeholder="e.g. ai" {...register('slug')} />
          <FieldDescription>Used in the URL: /blog?tag=&lt;slug&gt;</FieldDescription>
          <FieldError errors={[errors.slug]} />
        </Field>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : tagId ? 'Save changes' : 'Create tag'}
        </Button>
      </FieldGroup>
    </form>
  )
}
