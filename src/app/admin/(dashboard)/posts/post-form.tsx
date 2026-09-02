'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, Controller, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ArrowLeft, Check, Clock3, ImagePlus, LayoutTemplate, Search, Tag, UserRound, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldError, FieldGroup, FieldDescription } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileUpload } from '@/components/admin/file-upload'
import { RichTextEditor } from '@/components/admin/rich-text-editor'
import { createPost, updatePost } from '@/actions/posts'
import { postSchema, type PostInput } from '@/lib/validation/post'
import { slugify } from '@/lib/utils'

type Option = { _id: string; name: string }
type PostFormProps = { postId?: string; defaultValues?: Partial<PostInput>; authors: Option[]; categories: Option[]; tags: Option[] }
const inputClass = 'h-11 rounded-xl border-[#e8e1ea] bg-white text-sm shadow-none placeholder:text-[#b2a8b5] focus:border-[#d71789] focus:ring-4 focus:ring-[#d71789]/10'

function SectionTitle({ icon: Icon, title, description }: { icon: typeof LayoutTemplate; title: string; description: string }) {
  return <div className="mb-4 flex items-start gap-3"><span className="flex h-10 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fce8f2] text-[#d71789]"><Icon className="h-4 w-4" /></span><div><h2 className="text-[15px] font-semibold text-[#33283a]">{title}</h2><p className="mt-1 text-xs leading-5 text-[#998f9f]">{description}</p></div></div>
}

export function PostForm({ postId, defaultValues, authors, categories, tags }: PostFormProps) {
  const router = useRouter()
  const { register, handleSubmit, setValue, watch, control, formState: { errors, isSubmitting } } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: { status: 'draft', categoryIds: [], tagIds: [], ...defaultValues },
  })

  const [slugTouched, setSlugTouched] = useState(Boolean(defaultValues?.slug))

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setValue('title', val, { shouldValidate: true })
    if (!slugTouched) {
      setValue('slug', slugify(val), { shouldValidate: true })
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugTouched(true)
    setValue('slug', slugify(e.target.value), { shouldValidate: true })
  }

  async function onSubmit(values: PostInput) {
    try {
      const cleanInput: PostInput = JSON.parse(JSON.stringify({
        ...values,
        title: values.title.trim(),
        slug: values.slug?.trim() ? slugify(values.slug) : slugify(values.title),
        categoryIds: values.categoryIds?.filter(Boolean) ?? [],
        tagIds: values.tagIds?.filter(Boolean) ?? [],
      }))
      const result = postId ? await updatePost(postId, cleanInput) : await createPost(cleanInput)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success(postId ? 'Post updated successfully' : 'Post created successfully')
      router.push('/admin/posts')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save post')
    }
  }

  function onInvalid(formErrors: FieldErrors<PostInput>) {
    const firstError = Object.values(formErrors)[0]?.message
    toast.error(firstError ? String(firstError) : 'Please fill in all required fields.')
  }

  const heroImageUrl = watch('heroImageUrl')
  const status = watch('status')
  const authorId = watch('authorId')
  const selectedAuthor = authors.find((author) => author._id === authorId)
  const categoryIds = watch('categoryIds') ?? []
  const tagIds = watch('tagIds') ?? []
  const [tagSearch, setTagSearch] = useState('')

  const selectedTagsList = tags.filter((tag) => tagIds.includes(tag._id))
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase().trim())
  )

  function toggleId(field: 'categoryIds' | 'tagIds', id: string, current: string[]) {
    setValue(field, current.includes(id) ? current.filter((c) => c !== id) : [...current, id], { shouldDirty: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="w-full pb-10 outline-none">
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.75fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-[#ebe5ed] bg-white p-6 shadow-[0_5px_18px_rgba(34,20,40,0.025)] sm:p-7">
            <SectionTitle icon={LayoutTemplate} title="Story details" description="Give your post a clear identity and an inviting introduction." />
            <FieldGroup className="gap-5 outline-none">
              <Field>
                <FieldLabel htmlFor="title" className="text-[13px] font-semibold text-[#403445]">Title <span className="text-[#d71789]">*</span></FieldLabel>
                <Input
                  id="title"
                  placeholder="A title people will want to read"
                  className={`${inputClass} h-14 px-4 text-base font-medium`}
                  {...register('title')}
                  onChange={handleTitleChange}
                />
                <FieldError errors={[errors.title]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="slug" className="text-[13px] font-semibold text-[#403445]">URL slug</FieldLabel>
                <Input
                  id="slug"
                  placeholder="e.g. exploring-hidden-gems"
                  className={inputClass}
                  {...register('slug')}
                  onChange={handleSlugChange}
                />
                <FieldDescription className="text-xs text-[#998f9f]">Auto-generated from title if left blank. Use lowercase words separated by hyphens.</FieldDescription>
                <FieldError errors={[errors.slug]} />
              </Field>
              <Field><FieldLabel htmlFor="excerpt" className="text-[13px] font-semibold text-[#403445]">Excerpt <span className="text-[#d71789]">*</span></FieldLabel><Textarea id="excerpt" rows={4} placeholder="Summarize the value of this story in one or two sentences…" className="resize-y rounded-xl border-[#e8e1ea] bg-white text-sm shadow-none placeholder:text-[#b2a8b5] focus:border-[#d71789] focus:ring-4 focus:ring-[#d71789]/10" {...register('excerpt')} /><FieldDescription className="text-xs text-[#998f9f]">Shown on blog cards and used as a fallback SEO description.</FieldDescription><FieldError errors={[errors.excerpt]} /></Field>
            </FieldGroup>
          </section>

          <section className="rounded-2xl border border-[#ebe5ed] bg-white p-6 shadow-[0_5px_18px_rgba(34,20,40,0.025)] sm:p-7">
            <SectionTitle icon={ImagePlus} title="Featured image" description="Choose a strong visual to represent this post across the site." />
            <div className={`rounded-2xl border border-dashed ${heroImageUrl ? 'border-[#e8d4e2] bg-[#fffafe]' : 'border-[#ded5e1] bg-[#fcfafc]'} p-4`}>
              {heroImageUrl ? (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative group shrink-0">
                    <Image
                      src={heroImageUrl}
                      alt="Post hero preview"
                      width={180}
                      height={110}
                      className="h-[110px] w-[180px] rounded-xl object-cover ring-1 ring-[#eadde7]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setValue('heroImageUrl', '', { shouldDirty: true })
                        setValue('heroImageKey', '', { shouldDirty: true })
                      }}
                      className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#b42318] shadow-md border border-[#f3d5d5] hover:bg-[#fef3f2] hover:text-[#912018] transition-transform hover:scale-110"
                      title="Remove image"
                      aria-label="Remove image"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#403445]">Featured image ready</p>
                    <p className="mt-1 text-xs text-[#998f9f]">This image will appear on blog cards and social previews.</p>
                    <div className="mt-3 flex items-center gap-2">
                      <FileUpload
                        label="Replace image"
                        onUploaded={({ url, key }) => {
                          setValue('heroImageUrl', url, { shouldDirty: true })
                          setValue('heroImageKey', key, { shouldDirty: true })
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setValue('heroImageUrl', '', { shouldDirty: true })
                          setValue('heroImageKey', '', { shouldDirty: true })
                        }}
                        className="border-[#f3d5d5] text-[#b42318] hover:bg-[#fef3f2] hover:text-[#912018]"
                      >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Remove image
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-7 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#d71789] shadow-sm">
                    <ImagePlus className="h-5 w-5" />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-[#403445]">Add a featured image</p>
                  <p className="mt-1 mb-4 text-xs text-[#998f9f]">JPG, PNG or WEBP · Recommended 1200 × 630px</p>
                  <FileUpload
                    label="Upload image"
                    onUploaded={({ url, key }) => {
                      setValue('heroImageUrl', url, { shouldDirty: true })
                      setValue('heroImageKey', key, { shouldDirty: true })
                    }}
                  />
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-[#ebe5ed] bg-white p-6 shadow-[0_5px_18px_rgba(34,20,40,0.025)] sm:p-7">
            <SectionTitle icon={Search} title="Article content" description="Write, format, and structure the story your readers will experience." />
            <Field><FieldLabel className="text-[13px] font-semibold text-[#403445]">Content <span className="text-[#d71789]">*</span></FieldLabel><Controller control={control} name="contentJson" render={({ field }) => <RichTextEditor initialContent={field.value} onChange={({ json, html }) => { field.onChange(json); setValue('contentHtml', html, { shouldDirty: true }) }} />} /><FieldError errors={[errors.contentJson]} /></Field>
          </section>
        </div>

        <div className="space-y-6 xl:sticky xl:top-6">
          <section className="rounded-2xl border border-[#ebe5ed] bg-white p-6 shadow-[0_5px_18px_rgba(34,20,40,0.025)]">
            <SectionTitle icon={Check} title="Publishing" description="Choose who owns this story and when it becomes visible." />
            <FieldGroup className="gap-5">
              <Field><FieldLabel htmlFor="status" className="text-[13px] font-semibold text-[#403445]">Status</FieldLabel><Select value={status || 'draft'} onValueChange={(v) => v && setValue('status', v as PostInput['status'], { shouldDirty: true })}><SelectTrigger id="status" className={inputClass}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft · only visible to your team</SelectItem><SelectItem value="published">Published · visible on the site</SelectItem></SelectContent></Select><FieldError errors={[errors.status]} /></Field>
              <Field><FieldLabel htmlFor="authorId" className="text-[13px] font-semibold text-[#403445]">Author</FieldLabel><div className="relative min-w-0"><UserRound className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#a79ba9]" /><Select value={authorId || ''} onValueChange={(v) => v && setValue('authorId', v, { shouldDirty: true })}><SelectTrigger id="authorId" className={`${inputClass} pl-10 min-w-0 overflow-hidden`}><span className={`block flex-1 min-w-0 truncate text-left pr-2 ${selectedAuthor ? 'text-[#33283a]' : 'text-[#a79ba9]'}`} title={selectedAuthor?.name}>{selectedAuthor?.name ?? 'Select author'}</span></SelectTrigger><SelectContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">{authors.map((author) => <SelectItem key={author._id} value={author._id} className="min-w-0"><span className="truncate block" title={author.name}>{author.name}</span></SelectItem>)}</SelectContent></Select></div></Field>
            </FieldGroup>
          </section>

          <section className="rounded-2xl border border-[#ebe5ed] bg-white p-6 shadow-[0_5px_18px_rgba(34,20,40,0.025)]">
            <SectionTitle icon={Tag} title="Organization" description="Help readers discover this story by topic and theme." />
            <div className="space-y-5">
              {/* CATEGORIES */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FieldLabel className="text-[13px] font-semibold text-[#403445]">Categories</FieldLabel>
                    {categoryIds.length > 0 && (
                      <span className="rounded-full bg-[#fce8f2] px-2 py-0.5 text-[10px] font-bold text-[#b40d6d] border border-[#f7d4e5]">
                        {categoryIds.length} selected
                      </span>
                    )}
                  </div>
                  {categoryIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setValue('categoryIds', [], { shouldDirty: true })}
                      className="text-[11px] font-semibold text-[#827687] hover:text-[#d71789] hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {categories.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                    {categories.map((category) => {
                      const active = categoryIds.includes(category._id)
                      return (
                        <button
                          key={category._id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => toggleId('categoryIds', category._id, categoryIds)}
                          title={category.name}
                          className={`group inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer max-w-full min-w-0 ${
                            active
                              ? 'border-[#d71789] bg-[#fce8f2] text-[#b40d6d] shadow-2xs'
                              : 'border-[#e8e1ea] bg-white text-[#716478] hover:border-[#d8a7c1] hover:bg-[#fff9fc] hover:text-[#b40d6d]'
                          }`}
                        >
                          {active ? (
                            <Check className="h-3 w-3 shrink-0 text-[#b40d6d]" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#d8a7c1] group-hover:bg-[#b40d6d] shrink-0" />
                          )}
                          <span className="truncate max-w-[170px] sm:max-w-[200px]">{category.name}</span>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-[#e0d6e4] bg-[#faf8fb] p-3 text-center text-xs text-[#8c7f91]">
                    No categories found.{' '}
                    <Link href="/admin/categories/new" className="font-semibold text-[#d71789] hover:underline">
                      Create category
                    </Link>
                  </div>
                )}
              </div>

              {/* TAGS */}
              <div className="space-y-2.5 pt-4 border-t border-[#f3edf5]">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FieldLabel className="text-[13px] font-semibold text-[#403445]">Tags</FieldLabel>
                    {tagIds.length > 0 && (
                      <span className="rounded-full bg-[#f0eaff] px-2 py-0.5 text-[10px] font-bold text-[#6b43bb] border border-[#dcd0f7]">
                        {tagIds.length} selected
                      </span>
                    )}
                  </div>
                  {tagIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setValue('tagIds', [], { shouldDirty: true })}
                      className="text-[11px] font-semibold text-[#827687] hover:text-[#6b43bb] hover:underline cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Selected Active Tags Tray */}
                {selectedTagsList.length > 0 && (
                  <div className="rounded-xl border border-[#e4daf5] bg-[#faf8ff] p-2.5 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#82719a] flex items-center gap-1">
                      <Check className="h-3 w-3 text-[#6b43bb]" />
                      Selected Tags ({selectedTagsList.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTagsList.map((tag) => (
                        <span
                          key={tag._id}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#cfbfee] bg-white px-2 py-0.5 text-xs font-semibold text-[#6b43bb] shadow-2xs max-w-full"
                          title={tag.name}
                        >
                          <span className="truncate max-w-[150px] sm:max-w-[180px]">#{tag.name}</span>
                          <button
                            type="button"
                            onClick={() => toggleId('tagIds', tag._id, tagIds)}
                            className="ml-0.5 rounded p-0.5 text-[#a79ba9] hover:bg-[#f0eaff] hover:text-[#b40d6d] cursor-pointer"
                            title={`Remove ${tag.name}`}
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search Bar for Tags */}
                {tags.length > 5 && (
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#a79ba9]" />
                    <input
                      type="text"
                      value={tagSearch}
                      onChange={(e) => setTagSearch(e.target.value)}
                      placeholder="Filter tags..."
                      className="h-8.5 w-full rounded-xl border border-[#e8e1ea] bg-[#faf8fb] pl-8.5 pr-7 text-xs text-[#33283a] placeholder:text-[#a79ba9] focus:border-[#6b43bb] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6b43bb]/15 transition"
                    />
                    {tagSearch && (
                      <button
                        type="button"
                        onClick={() => setTagSearch('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-4 w-4 items-center justify-center rounded-full bg-[#e8e1ea] text-[10px] text-[#6d6072] hover:bg-[#d8a7c1] hover:text-white cursor-pointer"
                      >
                        ×
                      </button>
                    )}
                  </div>
                )}

                {/* Available Tags Cloud */}
                <div className="max-h-48 overflow-y-auto pr-1">
                  {filteredTags.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {filteredTags.map((tag) => {
                        const active = tagIds.includes(tag._id)
                        return (
                          <button
                            key={tag._id}
                            type="button"
                            aria-pressed={active}
                            onClick={() => toggleId('tagIds', tag._id, tagIds)}
                            title={tag.name}
                            className={`group inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition cursor-pointer max-w-full min-w-0 ${
                              active
                                ? 'border-[#6b43bb] bg-[#f0eaff] text-[#6b43bb] font-semibold shadow-2xs ring-1 ring-[#6b43bb]/20'
                                : 'border-[#e8e1ea] bg-white text-[#5f5264] hover:border-[#b9a9db] hover:bg-[#faf7ff] hover:text-[#6b43bb]'
                            }`}
                          >
                            {active ? (
                              <Check className="h-3 w-3 shrink-0 text-[#6b43bb]" />
                            ) : (
                              <span className="text-[#b2a5ba] group-hover:text-[#6b43bb] text-[11px] font-mono shrink-0">#</span>
                            )}
                            <span className="truncate max-w-[170px] sm:max-w-[200px]">{tag.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-[#e0d6e4] bg-[#faf8fb] p-3 text-center text-xs text-[#8c7f91]">
                      {tagSearch ? (
                        <>
                          No tags match &ldquo;<span className="font-semibold text-[#33283a]">{tagSearch}</span>&rdquo;
                          <button
                            type="button"
                            onClick={() => setTagSearch('')}
                            className="block mx-auto mt-1 font-semibold text-[#6b43bb] hover:underline"
                          >
                            Clear search
                          </button>
                        </>
                      ) : (
                        <>
                          No tags created yet.{' '}
                          <Link href="/admin/tags/new" className="font-semibold text-[#6b43bb] hover:underline">
                            Create tag
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#ebe5ed] bg-white p-6 shadow-[0_5px_18px_rgba(34,20,40,0.025)]"><SectionTitle icon={Search} title="Search preview" description="Improve how this post appears in search results." /><FieldGroup className="gap-5"><Field><FieldLabel htmlFor="seoTitle" className="text-[13px] font-semibold text-[#403445]">SEO title</FieldLabel><Input id="seoTitle" placeholder="Defaults to the post title" className={inputClass} {...register('seoTitle')} /></Field><Field><FieldLabel htmlFor="seoDescription" className="text-[13px] font-semibold text-[#403445]">SEO description</FieldLabel><Textarea id="seoDescription" rows={3} placeholder="Defaults to the excerpt" className="resize-none rounded-xl border-[#e8e1ea] text-sm shadow-none placeholder:text-[#b2a8b5] focus:border-[#d71789] focus:ring-4 focus:ring-[#d71789]/10" {...register('seoDescription')} /></Field></FieldGroup></section>
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 rounded-2xl border border-[#e8e1ea] bg-white p-3 outline-none shadow-[0_8px_24px_rgba(34,20,40,0.06)] sm:flex-row sm:items-center sm:justify-between"><Link href="/admin/posts" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-[#827687] transition hover:bg-[#f8f3f8] hover:text-[#3e3045]"><ArrowLeft className="h-4 w-4" />Cancel</Link><div className="flex items-center gap-3"><span className="hidden text-xs text-[#a095a4] sm:inline">Changes are saved when you submit</span><Button type="submit" disabled={isSubmitting} className="h-10 min-w-[142px] rounded-xl bg-[#241235] px-5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(36,18,53,0.18)] hover:bg-[#351747]">{isSubmitting ? 'Saving…' : postId ? 'Save changes' : 'Create post'}</Button></div></div>
    </form>
  )
}
