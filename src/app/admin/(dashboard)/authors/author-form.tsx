'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { User, FileText, Camera, Globe, Sparkles, CheckCircle2, ArrowRight, Share2, Link2, Mail, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field'
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
    defaultValues: {
      name: '',
      email: '',
      bio: '',
      avatarUrl: '',
      avatarKey: '',
      twitter: '',
      linkedin: '',
      website: '',
      ...defaultValues,
    },
  })

  const avatarUrl = watch('avatarUrl')
  const name = watch('name')
  const bio = watch('bio')
  const email = watch('email')
  const twitter = watch('twitter')
  const linkedin = watch('linkedin')
  const website = watch('website')

  const initial = name ? name.trim().charAt(0).toUpperCase() : 'A'

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full pb-10">
      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Form Sections */}
        <div className="space-y-6 lg:col-span-7">
          {/* Section 1: Basic Information */}
          <div className="rounded-2xl border border-[#ebe6ee] bg-white p-6 shadow-xs sm:p-7 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#f0edf1] pb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fce8f2] text-[#d71789]">
                <User className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-bold text-[#21182a]">Basic Information</h3>
            </div>

            <Field>
              <FieldLabel htmlFor="name" className="text-xs font-semibold text-[#21182a]">
                Author Full Name <span className="text-[#d71789]">*</span>
              </FieldLabel>
              <Input
                id="name"
                placeholder="e.g. John Doe"
                className="h-11 rounded-xl border-[#ebe6ee] bg-white text-sm focus:border-[#d71789] focus:ring-4 focus:ring-[#d71789]/10"
                {...register('name')}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="email" className="text-xs font-semibold text-[#21182a]">
                Email Address (Optional)
              </FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="e.g. author@movodream.com"
                className="h-11 rounded-xl border-[#ebe6ee] bg-white text-sm focus:border-[#d71789] focus:ring-4 focus:ring-[#d71789]/10"
                {...register('email')}
              />
              <FieldError errors={[errors.email]} />
            </Field>
          </div>

          {/* Section 2: Biography */}
          <div className="rounded-2xl border border-[#ebe6ee] bg-white p-6 shadow-xs sm:p-7 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#f0edf1] pb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fce8f2] text-[#d71789]">
                <FileText className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-bold text-[#21182a]">Author Bio</h3>
            </div>

            <Field>
              <FieldLabel htmlFor="bio" className="text-xs font-semibold text-[#21182a]">
                Short Biography / Tagline
              </FieldLabel>
              <Textarea
                id="bio"
                rows={4}
                placeholder="Write a brief professional background or description about this author..."
                className="resize-y rounded-xl border-[#ebe6ee] bg-white text-sm shadow-none focus:border-[#d71789] focus:ring-4 focus:ring-[#d71789]/10"
                {...register('bio')}
              />
              <FieldDescription className="text-[11px] text-[#887f8e]">
                This will appear at the bottom of published articles and author profile cards.
              </FieldDescription>
              <FieldError errors={[errors.bio]} />
            </Field>
          </div>

          {/* Section 3: Profile Avatar */}
          <div className="rounded-2xl border border-[#ebe6ee] bg-white p-6 shadow-xs sm:p-7 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#f0edf1] pb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fce8f2] text-[#d71789]">
                <Camera className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-bold text-[#21182a]">Profile Avatar</h3>
            </div>

            <Field>
              <FieldLabel className="text-xs font-semibold text-[#21182a]">Avatar Image</FieldLabel>
              <div className="flex items-center gap-4 rounded-xl border border-[#ebe6ee] bg-[#faf8fb] p-4">
                <div className="relative group shrink-0">
                  <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-[#f7d4e5] bg-[#fce8f2] shadow-sm flex items-center justify-center">
                    {avatarUrl ? (
                      <Image src={avatarUrl} alt="Avatar Preview" fill className="object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-[#d71789]">{initial}</span>
                    )}
                  </div>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setValue('avatarUrl', '', { shouldDirty: true })
                        setValue('avatarKey', '', { shouldDirty: true })
                      }}
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#b42318] shadow-sm border border-[#f3d5d5] hover:bg-[#fef3f2] hover:text-[#912018] transition-transform hover:scale-110"
                      title="Remove avatar"
                      aria-label="Remove avatar"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-semibold text-[#21182a]">
                    {avatarUrl ? 'Profile Avatar Uploaded' : 'Upload Author Photo'}
                  </p>
                  <p className="text-[11px] text-[#887f8e]">Recommended size: 400x400px (PNG, JPG, WEBP)</p>
                  <div className="pt-1 flex items-center gap-2">
                    <FileUpload
                      label={avatarUrl ? 'Replace Photo' : 'Upload Photo'}
                      onUploaded={({ url, key }) => {
                        setValue('avatarUrl', url, { shouldDirty: true })
                        setValue('avatarKey', key, { shouldDirty: true })
                      }}
                    />
                    {avatarUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setValue('avatarUrl', '', { shouldDirty: true })
                          setValue('avatarKey', '', { shouldDirty: true })
                        }}
                        className="border-[#f3d5d5] text-[#b42318] hover:bg-[#fef3f2] hover:text-[#912018]"
                      >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Field>
          </div>

          {/* Section 4: Social Connections */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-[#f0edf1] pb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fce8f2] text-[#d71789]">
                <Globe className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-bold text-[#21182a]">Social Presence & Web Links</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="twitter" className="text-xs font-semibold text-[#21182a]">
                  Twitter / X Profile
                </FieldLabel>
                <Input
                  id="twitter"
                  placeholder="https://x.com/username"
                  className="h-10 rounded-xl border-[#dedede] text-xs focus:border-[#d71789]"
                  {...register('twitter')}
                />
                <FieldError errors={[errors.twitter]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="linkedin" className="text-xs font-semibold text-[#21182a]">
                  LinkedIn Profile
                </FieldLabel>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/username"
                  className="h-10 rounded-xl border-[#dedede] text-xs focus:border-[#d71789]"
                  {...register('linkedin')}
                />
                <FieldError errors={[errors.linkedin]} />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="website" className="text-xs font-semibold text-[#21182a]">
                Personal Website / Portfolio
              </FieldLabel>
              <Input
                id="website"
                placeholder="https://authorwebsite.com"
                className="h-10 rounded-xl border-[#dedede] text-xs focus:border-[#d71789]"
                {...register('website')}
              />
              <FieldError errors={[errors.website]} />
            </Field>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-[#f0edf1] pt-5">
            <Button
              type="button"
              variant="outline"
              render={<Link href="/admin/authors" />}
              className="border-[#e6e1e9] text-[#21182a] hover:bg-[#f8f3f8]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 bg-gradient-to-r from-[#d71789] to-[#ff7294] px-6 text-white shadow-[0_6px_20px_rgba(215,23,137,0.25)] hover:opacity-95 border-0 font-semibold"
            >
              {isSubmitting ? 'Saving...' : authorId ? 'Save Profile Changes' : 'Create Author Profile'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right Column - Live Preview */}
        <div className="sticky top-6 space-y-4 lg:col-span-5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#887f8e] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#d71789]" />
              Live Profile Preview
            </span>
            <span className="rounded-full bg-[#fce8f2] px-2.5 py-0.5 text-[10px] font-bold text-[#d71789] border border-[#f7d4e5]">
              Public Identity
            </span>
          </div>

          {/* Card Container */}
          <div className="overflow-hidden rounded-2xl border border-[#ebe6ee] bg-white shadow-[0_8px_30px_rgba(34,20,40,0.06)]">
            {/* Header Banner */}
            <div className="h-24 bg-gradient-to-r from-[#241235] via-[#4c194e] to-[#d71789] relative p-4 flex items-end justify-end">
              <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold text-white/80 backdrop-blur-xs border border-white/15">
                Movodream Author
              </span>
            </div>

            {/* Avatar & Info */}
            <div className="relative px-6 pb-6 pt-0">
              <div className="-mt-12 mb-4 flex items-end justify-between">
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-[#fce8f2] shadow-md flex items-center justify-center">
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt={name || 'Author'} fill className="object-cover" />
                  ) : (
                    <span className="text-3xl font-extrabold text-[#d71789]">{initial}</span>
                  )}
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#039855] bg-[#ecfdf3] px-2.5 py-1 rounded-full border border-[#abefc6]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified Voice
                </span>
              </div>

              <h4 className="text-xl font-bold text-[#21182a]">
                {name || 'Author Full Name'}
              </h4>
              <p className="text-xs font-medium text-[#d71789] mt-0.5">
                Editorial Contributor
              </p>
              {email && (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-[#857c8b]">
                  <Mail className="h-3.5 w-3.5 text-[#d71789]" />
                  {email}
                </p>
              )}

              {/* Bio Preview */}
              <div className="mt-4 rounded-xl border border-[#f0edf1] bg-[#faf8fb] p-3 text-xs leading-relaxed text-[#382b40] italic">
                "{bio || 'Author biography will appear here as you type in the form...'}"
              </div>

              {/* Social Links Preview */}
              <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-[#f0edf1]">
                {twitter ? (
                  <a href={twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-[#f0f7ff] px-2.5 py-1 text-xs font-semibold text-[#0284c7] border border-[#bae6fd]">
                    <Share2 className="h-3.5 w-3.5" />
                    Twitter / X
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-[#faf8fb] px-2.5 py-1 text-xs font-medium text-[#a49aa9] border border-[#eee8f0]">
                    <Share2 className="h-3.5 w-3.5" />
                    No Twitter
                  </span>
                )}

                {linkedin ? (
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-[#f0f4ff] px-2.5 py-1 text-xs font-semibold text-[#0a66c2] border border-[#c7d2fe]">
                    <Link2 className="h-3.5 w-3.5" />
                    LinkedIn
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-[#faf8fb] px-2.5 py-1 text-xs font-medium text-[#a49aa9] border border-[#eee8f0]">
                    <Link2 className="h-3.5 w-3.5" />
                    No LinkedIn
                  </span>
                )}

                {website && (
                  <a href={website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-[#fce8f2] px-2.5 py-1 text-xs font-semibold text-[#d71789] border border-[#f7d4e5]">
                    <Globe className="h-3.5 w-3.5" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
