'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useForm, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Eye,
  Pencil,
  Trash2,
  Building2,
  MapPin,
  ExternalLink,
  Camera,
  Layers,
  Globe,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { FileUpload } from '@/components/admin/file-upload'
import { deleteOffice, updateOffice } from '@/actions/offices'
import { officeSchema, type OfficeInput } from '@/lib/validation/office'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'
import { slugify } from '@/lib/utils'

export type OfficeData = {
  _id: string
  city: string
  slug: string
  role?: string
  address?: string
  gmbLink?: string
  status: 'live' | 'comingSoon'
  description?: string
  image?: { url: string; key?: string } | null
  order?: number
}

export function OfficeRowActions({
  id,
  office,
}: {
  id: string
  office: OfficeData
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  // Edit form state
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OfficeInput>({
    resolver: zodResolver(officeSchema),
    defaultValues: {
      city: office.city || '',
      slug: office.slug || '',
      role: office.role || '',
      address: office.address || '',
      gmbLink: office.gmbLink || '',
      status: office.status || 'live',
      description: office.description || '',
      imageUrl: office.image?.url || '',
      imageKey: office.image?.key || '',
      order: office.order ?? 0,
    },
  })

  const [slugTouched, setSlugTouched] = useState(true)

  function openEditModal() {
    reset({
      city: office.city || '',
      slug: office.slug || '',
      role: office.role || '',
      address: office.address || '',
      gmbLink: office.gmbLink || '',
      status: office.status || 'live',
      description: office.description || '',
      imageUrl: office.image?.url || '',
      imageKey: office.image?.key || '',
      order: office.order ?? 0,
    })
    setViewOpen(false)
    setEditOpen(true)
  }

  function handleCityChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setValue('city', val, { shouldValidate: true })
    if (!slugTouched) {
      setValue('slug', slugify(val), { shouldValidate: true })
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugTouched(true)
    setValue('slug', slugify(e.target.value), { shouldValidate: true })
  }

  const editStatus = watch('status')
  const editImageUrl = watch('imageUrl')

  async function onEditSubmit(values: OfficeInput) {
    try {
      const cleanInput: OfficeInput = JSON.parse(JSON.stringify({
        ...values,
        city: values.city.trim(),
        slug: values.slug?.trim() ? slugify(values.slug) : slugify(values.city),
      }))
      const result = await updateOffice(id, cleanInput)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('Office location updated successfully!')
      setEditOpen(false)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update office location')
    }
  }

  function onEditInvalid(formErrors: FieldErrors<OfficeInput>) {
    const firstError = Object.values(formErrors)[0]?.message
    toast.error(firstError ? String(firstError) : 'Please fix the errors in the form before submitting.')
  }

  function handleDelete() {
    startTransition(async () => {
      try {
        const result = await deleteOffice(id)
        if (!result.success) {
          toast.error(result.error)
          return
        }
        toast.success(`Office location "${office.city}" deleted successfully`)
        setDeleteOpen(false)
        setViewOpen(false)
        router.refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to delete office location')
      }
    })
  }

  const isLive = office.status === 'live'

  return (
    <>
      {/* Table Row Action Buttons */}
      <div className="flex items-center justify-end gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewOpen(true)}
          className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#fce8f2] hover:text-[#d71789]"
          title="View office hub"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={openEditModal}
          className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#f8f3f8]"
          title="Edit office hub"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDeleteOpen(true)}
          disabled={isPending}
          className="gap-1 text-[#b42318] hover:bg-[#fff1f0] hover:text-[#b42318]"
          title="Delete office"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isPending={isPending}
        itemName={office.city}
        itemType="Office Hub"
      />

      {/* 1. UPGRADED VIEW MODAL */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[#ebe6ee] bg-white p-6 shadow-2xl min-w-0">
          <DialogHeader className="border-b border-[#f0edf1] pb-4 min-w-0 pr-10 sm:pr-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fce8f2] text-[#d71789]">
                  <Building2 className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <DialogTitle className="text-xl font-bold tracking-tight text-[#21182a] break-words [overflow-wrap:anywhere]">
                    {office.city}
                  </DialogTitle>
                  <DialogDescription className="mt-0.5 text-xs text-[#857c8b] flex items-center gap-2">
                    <span className="font-semibold text-[#d71789]">{office.role || 'Office'}</span>
                    <span>•</span>
                    <span>Slug: <span className="font-mono text-[#21182a]">/{office.slug}</span></span>
                  </DialogDescription>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                <Badge
                  variant={isLive ? 'default' : 'secondary'}
                  className={
                    isLive
                      ? 'bg-[#e7f7ed] text-[#0f7b3d] border-0 text-xs font-semibold px-2.5 py-1'
                      : 'bg-[#f4f1f5] text-[#6d6174] border-0 text-xs font-semibold px-2.5 py-1'
                  }
                >
                  {isLive ? 'Live HQ' : 'Coming Soon'}
                </Badge>
                {typeof office.order === 'number' && (
                  <span className="rounded-full bg-[#faf8fb] border border-[#e6e1e9] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#857c8b]">
                    #{office.order}
                  </span>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4 text-xs min-w-0">
            {/* Cover Photo if uploaded */}
            {office.image?.url && (
              <div className="overflow-hidden rounded-xl border border-[#ebe6ee] bg-[#faf8fb] relative h-48 w-full shadow-xs">
                <Image
                  src={office.image.url}
                  alt={office.city}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Purpose / Description */}
            {office.description && (
              <div className="rounded-xl border border-[#ebe6ee] bg-[#faf8fb] p-3.5">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#857c8b] block mb-1">
                  Hub Purpose & Description
                </span>
                <p className="text-sm font-medium text-[#21182a] leading-relaxed">
                  {office.description}
                </p>
              </div>
            )}

            {/* Address Box */}
            <div className="rounded-xl border border-[#ebe6ee] bg-[#faf8fb] p-3.5 space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#857c8b] block">
                Physical Location & Address
              </span>
              {office.address ? (
                <p className="text-sm font-medium text-[#21182a] flex items-start gap-2 break-words [overflow-wrap:anywhere]">
                  <MapPin className="h-4 w-4 shrink-0 text-[#d71789] mt-0.5" />
                  <span>{office.address}</span>
                </p>
              ) : (
                <p className="text-xs text-[#857c8b] italic">No physical address specified.</p>
              )}
            </div>

            {/* Google Maps Link Button */}
            {office.gmbLink && (
              <div className="rounded-xl border border-[#ebe6ee] bg-[#faf8fb] p-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#857c8b] block">
                    Google Maps Pin
                  </span>
                  <span className="font-mono text-xs text-[#21182a] truncate block" title={office.gmbLink}>
                    {office.gmbLink}
                  </span>
                </div>
                <a
                  href={office.gmbLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#fce8f2] px-3 py-1.5 text-xs font-semibold text-[#d71789] transition-colors hover:bg-[#f9d5e7]"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Map
                </a>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#f0edf1] pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewOpen(false)}
              className="border-[#e6e1e9]"
            >
              Close
            </Button>
            <Button
              onClick={openEditModal}
              className="gap-1.5 bg-[#d71789] text-white hover:bg-[#b40d6d]"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Office
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. INLINE EDIT MODAL DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#ebe6ee] bg-white p-6 shadow-2xl min-w-0">
          <DialogHeader className="border-b border-[#f0edf1] pb-4 pr-10">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fce8f2] text-[#d71789]">
                <Pencil className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-[#21182a]">
                  Edit Office Location
                </DialogTitle>
                <DialogDescription className="mt-0.5 text-xs text-[#857c8b]">
                  Update identity, address, status, order, and cover photo for this office hub.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit(onEditSubmit, onEditInvalid)} noValidate className="space-y-4 py-3">
            {/* City & Slug */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor={`office-city-${id}`} className="text-xs font-semibold text-[#21182a]">
                  City Name <span className="text-[#d71789]">*</span>
                </FieldLabel>
                <Input
                  id={`office-city-${id}`}
                  placeholder="e.g. Gurugram"
                  className="h-10 rounded-xl border-[#dedede] text-sm focus:border-[#d71789]"
                  {...register('city')}
                  onChange={handleCityChange}
                />
                <FieldError errors={[errors.city]} />
              </Field>

              <Field>
                <FieldLabel htmlFor={`office-slug-${id}`} className="text-xs font-semibold text-[#21182a]">
                  Slug Identifier
                </FieldLabel>
                <Input
                  id={`office-slug-${id}`}
                  placeholder="e.g. gurugram"
                  className="h-10 rounded-xl border-[#dedede] text-sm font-mono text-xs focus:border-[#d71789]"
                  {...register('slug')}
                  onChange={handleSlugChange}
                />
                <FieldError errors={[errors.slug]} />
              </Field>
            </div>

            {/* Status & Display Order */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor={`office-status-${id}`} className="text-xs font-semibold text-[#21182a]">
                  Operational Status <span className="text-[#d71789]">*</span>
                </FieldLabel>
                <Select
                  value={editStatus || 'live'}
                  onValueChange={(val) => {
                    if (val === 'live' || val === 'comingSoon') {
                      setValue('status', val, { shouldDirty: true })
                    }
                  }}
                >
                  <SelectTrigger
                    id={`office-status-${id}`}
                    className="h-10 rounded-xl border-[#dedede] text-xs focus:border-[#d71789]"
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="live">Live / Active HQ</SelectItem>
                    <SelectItem value="comingSoon">Coming Soon</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError errors={[errors.status]} />
              </Field>

              <Field>
                <FieldLabel htmlFor={`office-order-${id}`} className="text-xs font-semibold text-[#21182a]">
                  Display Order
                </FieldLabel>
                <Input
                  id={`office-order-${id}`}
                  type="number"
                  min={0}
                  className="h-10 rounded-xl border-[#dedede] text-xs focus:border-[#d71789]"
                  {...register('order', { valueAsNumber: true })}
                />
                <FieldDescription className="text-[11px] text-[#887f8e]">
                  Auto-shifts existing locations cleanly.
                </FieldDescription>
                <FieldError errors={[errors.order]} />
              </Field>
            </div>

            {/* Hub Role / Designation */}
            <Field>
              <FieldLabel htmlFor={`office-role-${id}`} className="text-xs font-semibold text-[#21182a]">
                Hub Role / Designation
              </FieldLabel>
              <Input
                id={`office-role-${id}`}
                placeholder="e.g. Head Office, Office, Tech Hub, International Hub"
                className="h-10 rounded-xl border-[#dedede] text-xs focus:border-[#d71789]"
                {...register('role')}
              />
              <FieldDescription className="text-[11px] text-[#887f8e]">
                Shown on the About Us page under the city name (e.g. Head Office, Tech Hub, International Hub).
              </FieldDescription>
              <FieldError errors={[errors.role]} />
            </Field>

            {/* Postal Address */}
            <Field>
              <FieldLabel htmlFor={`office-address-${id}`} className="text-xs font-semibold text-[#21182a]">
                Full Postal Address
              </FieldLabel>
              <Textarea
                id={`office-address-${id}`}
                rows={2}
                placeholder="e.g. Unit 402, DLF Cyber City, Sector 24, Gurugram, Haryana"
                className="resize-y rounded-xl border-[#dedede] text-xs focus:border-[#d71789]"
                {...register('address')}
              />
              <FieldError errors={[errors.address]} />
            </Field>

            {/* Google Maps Link & Description */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor={`office-gmbLink-${id}`} className="text-xs font-semibold text-[#21182a]">
                  Google Maps URL (Optional)
                </FieldLabel>
                <Input
                  id={`office-gmbLink-${id}`}
                  placeholder="https://maps.google.com/?q=..."
                  className="h-10 rounded-xl border-[#dedede] text-xs focus:border-[#d71789]"
                  {...register('gmbLink')}
                />
                <FieldError errors={[errors.gmbLink]} />
              </Field>

              <Field>
                <FieldLabel htmlFor={`office-desc-${id}`} className="text-xs font-semibold text-[#21182a]">
                  Hub Purpose (Optional)
                </FieldLabel>
                <Input
                  id={`office-desc-${id}`}
                  placeholder="e.g. Engineering Center"
                  className="h-10 rounded-xl border-[#dedede] text-xs focus:border-[#d71789]"
                  {...register('description')}
                />
                <FieldError errors={[errors.description]} />
              </Field>
            </div>

            {/* Photo Upload / Replace */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-[#21182a]">Location Cover Photo</FieldLabel>
              <div className="flex flex-col gap-3 rounded-xl border border-[#ebe6ee] bg-[#faf8fb] p-3.5 sm:flex-row sm:items-center">
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-[#ebe6ee] bg-white flex items-center justify-center shadow-xs">
                  {editImageUrl ? (
                    <Image src={editImageUrl} alt="Office Photo" fill className="object-cover" />
                  ) : (
                    <Building2 className="h-6 w-6 text-[#d71789]" />
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-xs font-semibold text-[#21182a]">
                    {editImageUrl ? 'Cover Photo Attached' : 'No Cover Photo'}
                  </p>
                  <p className="text-[11px] text-[#887f8e]">JPG, WEBP, or PNG up to 5MB</p>
                  <div className="flex items-center gap-2 pt-1">
                    <FileUpload
                      label={editImageUrl ? 'Replace Photo' : 'Upload Photo'}
                      onUploaded={({ url, key }) => {
                        setValue('imageUrl', url, { shouldDirty: true })
                        setValue('imageKey', key, { shouldDirty: true })
                      }}
                    />
                    {editImageUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setValue('imageUrl', '', { shouldDirty: true })
                          setValue('imageKey', '', { shouldDirty: true })
                        }}
                        className="h-8 border-[#f3d5d5] text-[#b42318] hover:bg-[#fef3f2] hover:text-[#912018] text-xs"
                      >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Field>

            <div className="flex items-center justify-end gap-2.5 border-t border-[#f0edf1] pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(false)}
                className="border-[#e6e1e9]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-1.5 bg-[#d71789] text-white hover:bg-[#b40d6d] font-semibold text-xs h-9 px-4"
              >
                {isSubmitting ? 'Saving...' : 'Save Location Changes'}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
