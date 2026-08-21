'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Building2, MapPin, Globe, Camera, ArrowRight, Layers, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field'
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
    defaultValues: { status: 'live', order: 0, city: '', slug: '', address: '', description: '', ...defaultValues },
  })

  async function onSubmit(values: OfficeInput) {
    const result = officeId ? await updateOffice(officeId, values) : await createOffice(values)
    if (!result.success) {
      toast.error(result.error)
      return
    }
    toast.success(officeId ? 'Office location updated' : 'Office location created successfully!')
    router.push('/admin/offices')
    router.refresh()
  }

  const imageUrl = watch('imageUrl')
  const status = watch('status')

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
      <div className="space-y-6">
        {/* Section 1: Office Identity (2D Grid) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#f0edf1] pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fce8f2] text-[#d71789]">
              <Building2 className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-bold text-[#21182a]">Office Location & Identity</h3>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="city" className="text-xs font-semibold text-[#21182a]">
                City Name <span className="text-[#d71789]">*</span>
              </FieldLabel>
              <Input
                id="city"
                placeholder="e.g. New Delhi"
                className="h-10 rounded-xl border-[#dedede] text-sm focus:border-[#d71789]"
                {...register('city')}
              />
              <FieldError errors={[errors.city]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="slug" className="text-xs font-semibold text-[#21182a]">
                URL Slug
              </FieldLabel>
              <Input
                id="slug"
                placeholder="e.g. new-delhi"
                className="h-10 rounded-xl border-[#dedede] text-xs font-mono focus:border-[#d71789]"
                {...register('slug')}
              />
              <FieldError errors={[errors.slug]} />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="status" className="text-xs font-semibold text-[#21182a]">
                Hub Status
              </FieldLabel>
              <Select
                value={status || 'live'}
                onValueChange={(v) => v && setValue('status', v as OfficeInput['status'])}
              >
                <SelectTrigger id="status" className="h-10 rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="live">Live Location</SelectItem>
                  <SelectItem value="comingSoon">Coming Soon</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={[errors.status]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="order" className="text-xs font-semibold text-[#21182a]">
                Display Sorting Order
              </FieldLabel>
              <Input
                id="order"
                type="number"
                placeholder="0"
                className="h-10 rounded-xl border-[#dedede] text-xs focus:border-[#d71789]"
                {...register('order', { valueAsNumber: true })}
              />
            </Field>
          </div>
        </div>

        {/* Section 2: Address & Google Maps Touchpoint (2D Grid) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 border-b border-[#f0edf1] pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fce8f2] text-[#d71789]">
              <MapPin className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-bold text-[#21182a]">Address & Touchpoints</h3>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="address" className="text-xs font-semibold text-[#21182a]">
                Street Address
              </FieldLabel>
              <Input
                id="address"
                placeholder="e.g. Connaught Place, Block M, New Delhi"
                className="h-10 rounded-xl border-[#dedede] text-sm focus:border-[#d71789]"
                {...register('address')}
              />
              <FieldError errors={[errors.address]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="gmbLink" className="text-xs font-semibold text-[#21182a]">
                Google Business Profile / Maps Link
              </FieldLabel>
              <Input
                id="gmbLink"
                placeholder="https://maps.google.com/..."
                className="h-10 rounded-xl border-[#dedede] text-xs focus:border-[#d71789]"
                {...register('gmbLink')}
              />
              <FieldError errors={[errors.gmbLink]} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="description" className="text-xs font-semibold text-[#21182a]">
              Office Description & Regional Focus
            </FieldLabel>
            <Textarea
              id="description"
              rows={3}
              placeholder="Describe this office hub location, operating team, or regional focus..."
              className="rounded-xl border-[#dedede] text-sm leading-relaxed focus:border-[#d71789]"
              {...register('description')}
            />
          </Field>
        </div>

        {/* Section 3: Photo Upload (2D Grid Banner) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 border-b border-[#f0edf1] pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fce8f2] text-[#d71789]">
              <Camera className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-bold text-[#21182a]">Location Photo</h3>
          </div>

          <Field>
            <FieldLabel className="text-xs font-semibold text-[#21182a]">Hub Cover Photo</FieldLabel>
            <div className="flex flex-col gap-4 rounded-xl border border-[#ebe6ee] bg-[#faf8fb] p-4 sm:flex-row sm:items-center">
              <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border border-[#ebe6ee] bg-white flex items-center justify-center shadow-xs">
                {imageUrl ? (
                  <Image src={imageUrl} alt="Office Photo" fill className="object-cover" />
                ) : (
                  <Building2 className="h-7 w-7 text-[#d71789]" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs font-semibold text-[#21182a]">
                  {imageUrl ? 'Office Cover Photo Uploaded' : 'Upload Office Photo'}
                </p>
                <p className="text-[11px] text-[#887f8e]">Recommended size: 1200x800px (JPG, WEBP, PNG)</p>
                <div className="pt-1">
                  <FileUpload
                    label={imageUrl ? 'Replace Photo' : 'Upload Photo'}
                    onUploaded={({ url, key }) => {
                      setValue('imageUrl', url)
                      setValue('imageKey', key)
                    }}
                  />
                </div>
              </div>
            </div>
          </Field>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#f0edf1] pt-5">
          <Button
            type="button"
            variant="outline"
            render={<Link href="/admin/offices" />}
            className="border-[#e6e1e9] text-[#21182a] hover:bg-[#f8f3f8]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="gap-2 bg-gradient-to-r from-[#d71789] to-[#ff7294] px-6 text-white shadow-[0_6px_20px_rgba(215,23,137,0.25)] hover:opacity-95 border-0 font-semibold"
          >
            {isSubmitting ? 'Saving...' : officeId ? 'Save Location Changes' : 'Create Office Location'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  )
}
