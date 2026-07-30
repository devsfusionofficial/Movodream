'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldError, FieldGroup, FieldDescription } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileUpload } from '@/components/admin/file-upload'
import { createOffice, updateOffice } from '@/actions/offices'
import { officeSchema, type OfficeInput } from '@/lib/validation/office'

type OfficeFormProps = {
  officeId?: string
  defaultValues?: Partial<OfficeInput>
}

export function OfficeForm({ officeId, defaultValues }: OfficeFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OfficeInput>({
    resolver: zodResolver(officeSchema),
    defaultValues: { status: 'comingSoon', order: 0, ...defaultValues },
  })

  async function onSubmit(values: OfficeInput) {
    const result = officeId ? await updateOffice(officeId, values) : await createOffice(values)
    if (!result.success) {
      toast.error(result.error)
      return
    }
    toast.success(officeId ? 'Office updated' : 'Office created')
    router.push('/admin/offices')
    router.refresh()
  }

  const imageUrl = watch('imageUrl')

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-xl">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="city">City</FieldLabel>
          <Input id="city" {...register('city')} />
          <FieldError errors={[errors.city]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <Input id="slug" placeholder="e.g. delhi" {...register('slug')} />
          <FieldDescription>Used in the URL: /offices/&lt;slug&gt;</FieldDescription>
          <FieldError errors={[errors.slug]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="status">Status</FieldLabel>
          <Select value={watch('status')} onValueChange={(v) => v && setValue('status', v as OfficeInput['status'])}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="comingSoon">Coming Soon</SelectItem>
            </SelectContent>
          </Select>
          <FieldError errors={[errors.status]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="address">Address</FieldLabel>
          <Input id="address" {...register('address')} />
        </Field>

        <Field>
          <FieldLabel htmlFor="gmbLink">Google Business Profile link</FieldLabel>
          <Input id="gmbLink" placeholder="https://…" {...register('gmbLink')} />
          <FieldError errors={[errors.gmbLink]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea id="description" rows={4} {...register('description')} />
        </Field>

        <Field>
          <FieldLabel>Photo</FieldLabel>
          <div className="flex items-center gap-3">
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" className="h-12 w-12 rounded object-cover" />
            )}
            <FileUpload
              label={imageUrl ? 'Replace photo' : 'Upload photo'}
              onUploaded={({ url, key }) => {
                setValue('imageUrl', url)
                setValue('imageKey', key)
              }}
            />
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="order">Display order</FieldLabel>
          <Input id="order" type="number" {...register('order', { valueAsNumber: true })} />
        </Field>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : officeId ? 'Save changes' : 'Create office'}
        </Button>
      </FieldGroup>
    </form>
  )
}
