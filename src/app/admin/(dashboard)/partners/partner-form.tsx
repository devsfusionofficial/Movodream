'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field'
import { FileUpload } from '@/components/admin/file-upload'
import { createPartner, updatePartner } from '@/actions/partners'
import { partnerSchema, type PartnerInput } from '@/lib/validation/partner'

type PartnerFormProps = {
  partnerId?: string
  defaultValues?: Partial<PartnerInput>
}

export function PartnerForm({ partnerId, defaultValues }: PartnerFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PartnerInput>({
    resolver: zodResolver(partnerSchema),
    defaultValues: { order: 0, ...defaultValues },
  })

  async function onSubmit(values: PartnerInput) {
    const result = partnerId ? await updatePartner(partnerId, values) : await createPartner(values)
    if (!result.success) {
      toast.error(result.error)
      return
    }
    toast.success(partnerId ? 'Partner updated' : 'Partner created')
    router.push('/admin/partners')
    router.refresh()
  }

  const logoUrl = watch('logoUrl')

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-xl">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" {...register('name')} />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="category">Category</FieldLabel>
          <Input id="category" placeholder="e.g. Technology partner" {...register('category')} />
        </Field>

        <Field>
          <FieldLabel htmlFor="url">Website URL</FieldLabel>
          <Input id="url" placeholder="https://…" {...register('url')} />
          <FieldError errors={[errors.url]} />
        </Field>

        <Field>
          <FieldLabel>Logo</FieldLabel>
          <div className="flex items-center gap-3">
            {logoUrl && (
              <Image src={logoUrl} alt="" width={48} height={48} className="h-12 w-12 rounded object-contain bg-muted" />
            )}
            <FileUpload
              label={logoUrl ? 'Replace logo' : 'Upload logo'}
              onUploaded={({ url, key }) => {
                setValue('logoUrl', url)
                setValue('logoKey', key)
              }}
            />
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="order">Display order</FieldLabel>
          <Input id="order" type="number" {...register('order', { valueAsNumber: true })} />
        </Field>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : partnerId ? 'Save changes' : 'Create partner'}
        </Button>
      </FieldGroup>
    </form>
  )
}
