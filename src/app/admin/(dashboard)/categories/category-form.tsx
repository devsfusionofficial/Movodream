'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError, FieldGroup, FieldDescription } from '@/components/ui/field'
import { createCategory, updateCategory } from '@/actions/categories'
import { categorySchema, type CategoryInput } from '@/lib/validation/category'

type CategoryFormProps = {
  categoryId?: string
  defaultValues?: Partial<CategoryInput>
}

export function CategoryForm({ categoryId, defaultValues }: CategoryFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  })

  async function onSubmit(values: CategoryInput) {
    const result = categoryId ? await updateCategory(categoryId, values) : await createCategory(values)
    if (!result.success) {
      toast.error(result.error)
      return
    }
    toast.success(categoryId ? 'Category updated' : 'Category created')
    router.push('/admin/categories')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-none">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" {...register('name')} />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <Input id="slug" placeholder="e.g. travel-technology" {...register('slug')} />
          <FieldDescription>Used in the URL: /blog/category/&lt;slug&gt;</FieldDescription>
          <FieldError errors={[errors.slug]} />
        </Field>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : categoryId ? 'Save changes' : 'Create category'}
        </Button>
      </FieldGroup>
    </form>
  )
}
