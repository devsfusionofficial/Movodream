'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Eye,
  Pencil,
  Trash2,
  Building2,
  ExternalLink,
  Globe,
  Tag,
  Hash,
  Upload,
} from 'lucide-react'
import { useForm, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { FileUpload } from '@/components/admin/file-upload'
import { deletePartner, updatePartner } from '@/actions/partners'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'
import { partnerSchema, type PartnerInput } from '@/lib/validation/partner'

export type PartnerRecord = {
  _id?: string
  name?: string
  category?: string
  url?: string
  websiteUrl?: string
  logo?: {
    url?: string
    key?: string
  }
  order?: number
  createdAt?: string | Date
}

export function PartnerRowActions({
  id,
  partner,
}: {
  id: string
  partner?: PartnerRecord
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const partnerUrl = partner?.url || partner?.websiteUrl || ''
  const partnerLogo = partner?.logo?.url || ''
  const partnerLogoKey = partner?.logo?.key || ''
  const name = partner?.name || 'Partner Profile'

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PartnerInput>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: partner?.name || '',
      category: partner?.category || '',
      url: partnerUrl,
      order: partner?.order ?? 0,
      logoUrl: partnerLogo,
      logoKey: partnerLogoKey,
    },
  })

  // Keep form in sync when partner prop changes or edit opens
  useEffect(() => {
    if (editOpen) {
      reset({
        name: partner?.name || '',
        category: partner?.category || '',
        url: partnerUrl,
        order: partner?.order ?? 0,
        logoUrl: partnerLogo,
        logoKey: partnerLogoKey,
      })
    }
  }, [editOpen, partner, partnerUrl, partnerLogo, partnerLogoKey, reset])

  async function handleEditSubmit(values: PartnerInput) {
    try {
      const cleanInput: PartnerInput = JSON.parse(JSON.stringify(values))
      const result = await updatePartner(id, cleanInput)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('Partner updated successfully')
      setEditOpen(false)
      router.refresh()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update partner')
    }
  }

  function onEditInvalid(formErrors: FieldErrors<PartnerInput>) {
    const errorValues = Object.values(formErrors)
    const firstErr = errorValues[0]
    const message = typeof firstErr?.message === 'string' ? firstErr.message : 'Please check the form for errors.'
    toast.error(message)
  }

  function handleDelete() {
    startTransition(async () => {
      try {
        const result = await deletePartner(id)
        if (!result.success) {
          toast.error(result.error)
        } else {
          toast.success('Partner deleted successfully')
          router.refresh()
        }
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete partner')
      } finally {
        setDeleteOpen(false)
        setViewOpen(false)
      }
    })
  }

  const currentLogoUrl = watch('logoUrl')

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewOpen(true)}
          className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#fce8f2] hover:text-[#d71789]"
          title="View partner details"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditOpen(true)}
          className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#f8f3f8]"
          title="Edit partner"
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
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </div>

      {/* Delete Confirm Modal */}
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isPending={isPending}
        itemName={name}
        itemType="Partner"
      />

      {/* View Partner Modal */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[#ebe6ee] bg-white p-5 sm:p-6 shadow-2xl min-w-0">
          <DialogHeader className="border-b border-[#f0edf1] pb-4 pr-8 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              {partnerLogo ? (
                <div className="h-12 w-12 rounded-xl border border-[#ebe6ee] bg-[#faf8fb] p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  <img src={partnerLogo} alt={name} className="h-full w-full object-contain" />
                </div>
              ) : (
                <div className="h-12 w-12 rounded-xl border border-[#f7d4e5] bg-[#fce8f2] text-[#d71789] flex items-center justify-center shrink-0 text-base font-bold uppercase shadow-sm">
                  {name.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-xl font-bold tracking-tight text-[#21182a] break-words [overflow-wrap:anywhere]">
                  {name}
                </DialogTitle>
                <DialogDescription className="mt-0.5 text-xs text-[#857c8b] min-w-0 truncate">
                  {partner?.category || 'General Partner'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3.5 py-4 text-xs min-w-0">
            {/* Logo Preview Banner (if logo exists) */}
            {partnerLogo && (
              <div className="rounded-xl border border-[#f0ebf2] bg-[#fdfbfd] p-4 flex flex-col items-center justify-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#857c8b]">Partner Brand Logo</span>
                <div className="h-16 max-w-full flex items-center justify-center p-1">
                  <img src={partnerLogo} alt={name} className="max-h-full max-w-full object-contain" />
                </div>
              </div>
            )}

            {/* Quick Details Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-[#f0ebf2] bg-[#faf8fb] p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#857c8b]">
                  <Tag className="h-3.5 w-3.5 text-[#d71789]" />
                  <span>Category</span>
                </div>
                <p className="mt-1 text-xs font-bold text-[#21182a] truncate">
                  {partner?.category || 'General'}
                </p>
              </div>

              <div className="rounded-xl border border-[#f0ebf2] bg-[#faf8fb] p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#857c8b]">
                  <Hash className="h-3.5 w-3.5 text-[#d71789]" />
                  <span>Display Order</span>
                </div>
                <p className="mt-1 text-xs font-bold text-[#21182a]">
                  #{partner?.order ?? 0}
                </p>
              </div>
            </div>

            {/* Website URL Box */}
            <div className="rounded-xl border border-[#ebe6ee] bg-[#faf8fb] p-3.5 min-w-0">
              <span className="text-[#857c8b] block mb-1 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-[#d71789]" />
                <span>Website URL</span>
              </span>
              {partnerUrl ? (
                <a
                  href={partnerUrl.startsWith('http') ? partnerUrl : `https://${partnerUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#d71789] hover:underline inline-flex items-center gap-1.5 break-all [overflow-wrap:anywhere]"
                >
                  <span>{partnerUrl}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
              ) : (
                <span className="text-xs text-[#857c8b] italic">No website URL attached</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#f0edf1] pt-4">
            <Button variant="outline" size="sm" onClick={() => setViewOpen(false)} className="border-[#e6e1e9]">
              Close
            </Button>
            <Button
              onClick={() => {
                setViewOpen(false)
                setEditOpen(true)
              }}
              className="gap-1.5 bg-[#d71789] text-white hover:bg-[#b40d6d]"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Partner
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Partner Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[#ebe6ee] bg-white p-5 sm:p-6 shadow-2xl min-w-0">
          <DialogHeader className="border-b border-[#f0edf1] pb-3.5 pr-8 min-w-0">
            <DialogTitle className="text-xl font-bold tracking-tight text-[#21182a] flex items-center gap-2">
              <Pencil className="h-5 w-5 text-[#d71789]" />
              <span>Edit Partner</span>
            </DialogTitle>
            <DialogDescription className="mt-0.5 text-xs text-[#857c8b]">
              Update partner details, branding logo, and display order.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleEditSubmit, onEditInvalid)} noValidate className="space-y-4 py-3">
            <Field>
              <FieldLabel htmlFor={`partner-name-${id}`} className="text-xs font-semibold text-[#21182a]">
                Partner Name <span className="text-[#d71789]">*</span>
              </FieldLabel>
              <Input
                id={`partner-name-${id}`}
                placeholder="e.g. Razorpay / CleverTap"
                className="h-10 rounded-xl border-[#dedede] text-xs focus:border-[#d71789]"
                {...register('name')}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor={`partner-cat-${id}`} className="text-xs font-semibold text-[#21182a]">
                  Category
                </FieldLabel>
                <Input
                  id={`partner-cat-${id}`}
                  placeholder="e.g. Technology Partner"
                  className="h-10 rounded-xl border-[#dedede] text-xs focus:border-[#d71789]"
                  {...register('category')}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor={`partner-order-${id}`} className="text-xs font-semibold text-[#21182a]">
                  Display Order
                </FieldLabel>
                <Input
                  id={`partner-order-${id}`}
                  type="number"
                  min={0}
                  className="h-10 rounded-xl border-[#dedede] text-xs focus:border-[#d71789]"
                  {...register('order', { valueAsNumber: true })}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor={`partner-url-${id}`} className="text-xs font-semibold text-[#21182a]">
                Website URL
              </FieldLabel>
              <Input
                id={`partner-url-${id}`}
                placeholder="https://example.com"
                className="h-10 rounded-xl border-[#dedede] text-xs focus:border-[#d71789]"
                {...register('url')}
              />
              <FieldError errors={[errors.url]} />
            </Field>

            {/* Logo Upload / Preview */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-[#21182a]">Partner Logo</FieldLabel>
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#ebe6ee] bg-[#faf8fb] p-3">
                {currentLogoUrl ? (
                  <div className="relative group shrink-0">
                    <div className="h-12 w-12 rounded-lg border border-[#ebe6ee] bg-white p-1 flex items-center justify-center overflow-hidden shadow-xs">
                      <img src={currentLogoUrl} alt="" className="h-full w-full object-contain" />
                    </div>
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-lg border border-dashed border-[#dedede] bg-white flex items-center justify-center shrink-0 text-[#a49aa9]">
                    <Upload className="h-5 w-5" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FileUpload
                    label={currentLogoUrl ? 'Replace logo' : 'Upload logo'}
                    onUploaded={({ url, key }) => {
                      setValue('logoUrl', url, { shouldDirty: true, shouldValidate: true })
                      setValue('logoKey', key, { shouldDirty: true })
                    }}
                  />
                  {currentLogoUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setValue('logoUrl', '', { shouldDirty: true, shouldValidate: true })
                        setValue('logoKey', '', { shouldDirty: true })
                      }}
                      className="border-[#f3d5d5] text-[#b42318] hover:bg-[#fef3f2] hover:text-[#912018]"
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </Field>

            <div className="flex items-center justify-between gap-3 border-t border-[#f0edf1] pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(false)}
                disabled={isSubmitting}
                className="border-[#e6e1e9]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-1.5 bg-gradient-to-r from-[#d71789] to-[#ff7294] text-white shadow-sm border-0"
              >
                {isSubmitting ? 'Saving changes…' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
