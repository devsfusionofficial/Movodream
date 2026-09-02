'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError, FieldGroup, FieldDescription } from '@/components/ui/field'
import { createCategory, updateCategory } from '@/actions/categories'
import { categorySchema, type CategoryInput } from '@/lib/validation/category'
import { slugify } from '@/lib/utils'

type CategoryFormProps = {
  categoryId?: string
  defaultValues?: Partial<CategoryInput>
}

export function CategoryForm({ categoryId, defaultValues }: CategoryFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
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

  async function onSubmit(values: CategoryInput) {
    try {
      const cleanInput: CategoryInput = {
        name: values.name.trim(),
        slug: values.slug?.trim() ? slugify(values.slug) : slugify(values.name),
      }
      const result = categoryId ? await updateCategory(categoryId, cleanInput) : await createCategory(cleanInput)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success(categoryId ? 'Category updated successfully' : 'Category created successfully')
      router.push('/admin/categories')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save category')
    }
  }

  function onInvalid(formErrors: FieldErrors<CategoryInput>) {
    const firstError = Object.values(formErrors)[0]?.message
    toast.error(firstError ? String(firstError) : 'Please fill in all required fields.')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="w-full max-w-none">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            placeholder="e.g. Travel Destinations"
            maxLength={50}
            {...register('name')}
            onChange={handleNameChange}
          />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <Input
            id="slug"
            placeholder="e.g. travel-destinations"
            {...register('slug')}
            onChange={handleSlugChange}
          />
          <FieldDescription>Auto-generated from name. Used in URL: /blog/category/&lt;slug&gt;</FieldDescription>
          <FieldError errors={[errors.slug]} />
        </Field>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : categoryId ? 'Save changes' : 'Create category'}
        </Button>
      </FieldGroup>
    </form>
  )
}
