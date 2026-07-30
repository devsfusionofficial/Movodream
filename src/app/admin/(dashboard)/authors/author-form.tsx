'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field'
import { FileUpload } from '@/components/admin/file-upload'
import { createAuthor, updateAuthor } from '@/actions/authors'
import { authorSchema, type AuthorInput } from '@/lib/validation/author'

type AuthorFormProps = {
  authorId?: string
  defaultValues?: Partial<AuthorInput>
}

export function AuthorForm({ authorId, defaultValues }: AuthorFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AuthorInput>({
    resolver: zodResolver(authorSchema),
    defaultValues,
  })

  async function onSubmit(values: AuthorInput) {
    const result = authorId ? await updateAuthor(authorId, values) : await createAuthor(values)
    if (!result.success) {
      toast.error(result.error)
      return
    }
    toast.success(authorId ? 'Author updated' : 'Author created')
    router.push('/admin/authors')
    router.refresh()
  }

  const avatarUrl = watch('avatarUrl')

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-xl">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" {...register('name')} />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="bio">Bio</FieldLabel>
          <Textarea id="bio" rows={4} {...register('bio')} />
        </Field>

        <Field>
          <FieldLabel>Avatar</FieldLabel>
          <div className="flex items-center gap-3">
            {avatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
            )}
            <FileUpload
              label={avatarUrl ? 'Replace avatar' : 'Upload avatar'}
              onUploaded={({ url, key }) => {
                setValue('avatarUrl', url)
                setValue('avatarKey', key)
              }}
            />
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="twitter">Twitter / X URL</FieldLabel>
          <Input id="twitter" placeholder="https://…" {...register('twitter')} />
          <FieldError errors={[errors.twitter]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="linkedin">LinkedIn URL</FieldLabel>
          <Input id="linkedin" placeholder="https://…" {...register('linkedin')} />
          <FieldError errors={[errors.linkedin]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="website">Website URL</FieldLabel>
          <Input id="website" placeholder="https://…" {...register('website')} />
          <FieldError errors={[errors.website]} />
        </Field>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : authorId ? 'Save changes' : 'Create author'}
        </Button>
      </FieldGroup>
    </form>
  )
}
