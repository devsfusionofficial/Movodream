'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ArrowLeft, Check, Clock3, ImagePlus, LayoutTemplate, Search, Tag, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldError, FieldGroup, FieldDescription } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileUpload } from '@/components/admin/file-upload'
import { RichTextEditor } from '@/components/admin/rich-text-editor'
import { createPost, updatePost } from '@/actions/posts'
import { postSchema, type PostInput } from '@/lib/validation/post'

type Option = { _id: string; name: string }
type PostFormProps = { postId?: string; defaultValues?: Partial<PostInput>; authors: Option[]; categories: Option[]; tags: Option[] }
const inputClass = 'h-11 rounded-xl border-[#e8e1ea] bg-white text-sm shadow-none placeholder:text-[#b2a8b5] focus:border-[#d71789] focus:ring-4 focus:ring-[#d71789]/10'

function SectionTitle({ icon: Icon, title, description }: { icon: typeof LayoutTemplate; title: string; description: string }) {
  return <div className="mb-4 flex items-start gap-3"><span className="flex h-10 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fce8f2] text-[#d71789]"><Icon className="h-4 w-4" /></span><div><h2 className="text-[15px] font-semibold text-[#33283a]">{title}</h2><p className="mt-1 text-xs leading-5 text-[#998f9f]">{description}</p></div></div>
}

export function PostForm({ postId, defaultValues, authors, categories, tags }: PostFormProps) {
  const router = useRouter()
  const { register, handleSubmit, setValue, watch, control, formState: { errors, isSubmitting } } = useForm<PostInput>({ resolver: zodResolver(postSchema), defaultValues: { status: 'draft', categoryIds: [], tagIds: [], ...defaultValues } })

  async function onSubmit(values: PostInput) {
    const result = postId ? await updatePost(postId, values) : await createPost(values)
    if (!result.success) { toast.error(result.error); return }
    toast.success(postId ? 'Post updated' : 'Post created')
    router.push('/admin/posts')
    router.refresh()
  }

  const heroImageUrl = watch('heroImageUrl')
  const status = watch('status')
  const authorId = watch('authorId')
  const selectedAuthor = authors.find((author) => author._id === authorId)
  const categoryIds = watch('categoryIds') ?? []
  const tagIds = watch('tagIds') ?? []
  function toggleId(field: 'categoryIds' | 'tagIds', id: string, current: string[]) { setValue(field, current.includes(id) ? current.filter((c) => c !== id) : [...current, id], { shouldDirty: true }) }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full pb-10 outline-none">
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.75fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-[#ebe5ed] bg-white p-6 shadow-[0_5px_18px_rgba(34,20,40,0.025)] sm:p-7">
            <SectionTitle icon={LayoutTemplate} title="Story details" description="Give your post a clear identity and an inviting introduction." />
            <FieldGroup className="gap-5 outline-none">
              <Field><FieldLabel htmlFor="title" className="text-[13px] font-semibold text-[#403445]">Title <span className="text-[#d71789]">*</span></FieldLabel><Input id="title" placeholder="A title people will want to read" className={`${inputClass} h-14 px-4 text-base font-medium`} {...register('title')} /><FieldError errors={[errors.title]} /></Field>
              <Field><FieldLabel htmlFor="slug" className="text-[13px] font-semibold text-[#403445]">URL slug</FieldLabel><Input id="slug" placeholder="e.g. exploring-hidden-gems" className={inputClass} {...register('slug')} /><FieldDescription className="text-xs text-[#998f9f]">Auto-generated from title if left blank. Use lowercase words separated by hyphens.</FieldDescription><FieldError errors={[errors.slug]} /></Field>
              <Field><FieldLabel htmlFor="excerpt" className="text-[13px] font-semibold text-[#403445]">Excerpt <span className="text-[#d71789]">*</span></FieldLabel><Textarea id="excerpt" rows={4} placeholder="Summarize the value of this story in one or two sentences…" className="resize-y rounded-xl border-[#e8e1ea] bg-white text-sm shadow-none placeholder:text-[#b2a8b5] focus:border-[#d71789] focus:ring-4 focus:ring-[#d71789]/10" {...register('excerpt')} /><FieldDescription className="text-xs text-[#998f9f]">Shown on blog cards and used as a fallback SEO description.</FieldDescription><FieldError errors={[errors.excerpt]} /></Field>
            </FieldGroup>
          </section>

          <section className="rounded-2xl border border-[#ebe5ed] bg-white p-6 shadow-[0_5px_18px_rgba(34,20,40,0.025)] sm:p-7">
            <SectionTitle icon={ImagePlus} title="Featured image" description="Choose a strong visual to represent this post across the site." />
            <div className={`rounded-2xl border border-dashed ${heroImageUrl ? 'border-[#e8d4e2] bg-[#fffafe]' : 'border-[#ded5e1] bg-[#fcfafc]'} p-4`}>
              {heroImageUrl ? <div className="flex flex-col gap-4 sm:flex-row sm:items-center"><Image src={heroImageUrl} alt="Post hero preview" width={180} height={110} className="h-[110px] w-[180px] rounded-xl object-cover ring-1 ring-[#eadde7]" /><div><p className="text-sm font-semibold text-[#403445]">Featured image ready</p><p className="mt-1 text-xs text-[#998f9f]">This image will appear on blog cards and social previews.</p><FileUpload label="Replace image" onUploaded={({ url, key }) => { setValue('heroImageUrl', url, { shouldDirty: true }); setValue('heroImageKey', key, { shouldDirty: true }) }} /></div></div> : <div className="flex flex-col items-center justify-center py-7 text-center"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#d71789] shadow-sm"><ImagePlus className="h-5 w-5" /></span><p className="mt-3 text-sm font-semibold text-[#403445]">Add a featured image</p><p className="mt-1 mb-4 text-xs text-[#998f9f]">JPG, PNG or WEBP · Recommended 1200 × 630px</p><FileUpload label="Upload image" onUploaded={({ url, key }) => { setValue('heroImageUrl', url, { shouldDirty: true }); setValue('heroImageKey', key, { shouldDirty: true }) }} /></div>}
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
              <Field><FieldLabel htmlFor="status" className="text-[13px] font-semibold text-[#403445]">Status</FieldLabel><Select value={status || 'draft'} onValueChange={(v) => v && setValue('status', v as PostInput['status'], { shouldDirty: true })}><SelectTrigger id="status" className={inputClass}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft · only visible to your team</SelectItem><SelectItem value="scheduled">Scheduled · publish later</SelectItem><SelectItem value="published">Published · visible on the site</SelectItem></SelectContent></Select><FieldError errors={[errors.status]} /></Field>
              {status === 'scheduled' && <Field><FieldLabel htmlFor="publishedAt" className="text-[13px] font-semibold text-[#403445]">Publish at</FieldLabel><div className="relative"><Clock3 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a79ba9]" /><Input id="publishedAt" type="datetime-local" className={`${inputClass} pl-10`} {...register('publishedAt')} /></div></Field>}
              <Field><FieldLabel htmlFor="authorId" className="text-[13px] font-semibold text-[#403445]">Author</FieldLabel><div className="relative"><UserRound className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#a79ba9]" /><Select value={authorId || ''} onValueChange={(v) => v && setValue('authorId', v, { shouldDirty: true })}><SelectTrigger id="authorId" className={`${inputClass} pl-10`}><span className={`flex flex-1 text-left ${selectedAuthor ? 'text-[#33283a]' : 'text-[#a79ba9]'}`}>{selectedAuthor?.name ?? 'Select author'}</span></SelectTrigger><SelectContent>{authors.map((author) => <SelectItem key={author._id} value={author._id}>{author.name}</SelectItem>)}</SelectContent></Select></div></Field>
            </FieldGroup>
          </section>

          <section className="rounded-2xl border border-[#ebe5ed] bg-white p-6 shadow-[0_5px_18px_rgba(34,20,40,0.025)]"><SectionTitle icon={Tag} title="Organization" description="Help readers discover this story by topic." /><div className="space-y-5"><Field><FieldLabel className="text-[13px] font-semibold text-[#403445]">Categories</FieldLabel><div className="flex flex-wrap gap-2">{categories.map((category) => { const active = categoryIds.includes(category._id); return <button key={category._id} type="button" aria-pressed={active} onClick={() => toggleId('categoryIds', category._id, categoryIds)} className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${active ? 'border-[#d71789] bg-[#fce8f2] text-[#b40d6d]' : 'border-[#e8e1ea] bg-white text-[#827687] hover:border-[#d8a7c1] hover:text-[#b40d6d]'}`}>{active && <Check className="mr-1 inline h-3 w-3" />}{category.name}</button> })}</div></Field><Field><FieldLabel className="text-[13px] font-semibold text-[#403445]">Tags</FieldLabel><div className="flex flex-wrap gap-2">{tags.map((tag) => { const active = tagIds.includes(tag._id); return <button key={tag._id} type="button" aria-pressed={active} onClick={() => toggleId('tagIds', tag._id, tagIds)} className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${active ? 'border-[#6b43bb] bg-[#f0eaff] text-[#6b43bb]' : 'border-[#e8e1ea] bg-white text-[#827687] hover:border-[#b9a9db] hover:text-[#6b43bb]'}`}>{active && <Check className="mr-1 inline h-3 w-3" />}{tag.name}</button> })}</div></Field></div></section>

          <section className="rounded-2xl border border-[#ebe5ed] bg-white p-6 shadow-[0_5px_18px_rgba(34,20,40,0.025)]"><SectionTitle icon={Search} title="Search preview" description="Improve how this post appears in search results." /><FieldGroup className="gap-5"><Field><FieldLabel htmlFor="seoTitle" className="text-[13px] font-semibold text-[#403445]">SEO title</FieldLabel><Input id="seoTitle" placeholder="Defaults to the post title" className={inputClass} {...register('seoTitle')} /></Field><Field><FieldLabel htmlFor="seoDescription" className="text-[13px] font-semibold text-[#403445]">SEO description</FieldLabel><Textarea id="seoDescription" rows={3} placeholder="Defaults to the excerpt" className="resize-none rounded-xl border-[#e8e1ea] text-sm shadow-none placeholder:text-[#b2a8b5] focus:border-[#d71789] focus:ring-4 focus:ring-[#d71789]/10" {...register('seoDescription')} /></Field></FieldGroup></section>
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 rounded-2xl border border-[#e8e1ea] bg-white p-3 outline-none shadow-[0_8px_24px_rgba(34,20,40,0.06)] sm:flex-row sm:items-center sm:justify-between"><Link href="/admin/posts" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-[#827687] transition hover:bg-[#f8f3f8] hover:text-[#3e3045]"><ArrowLeft className="h-4 w-4" />Cancel</Link><div className="flex items-center gap-3"><span className="hidden text-xs text-[#a095a4] sm:inline">Changes are saved when you submit</span><Button type="submit" disabled={isSubmitting} className="h-10 min-w-[142px] rounded-xl bg-[#241235] px-5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(36,18,53,0.18)] hover:bg-[#351747]">{isSubmitting ? 'Saving…' : postId ? 'Save changes' : 'Create post'}</Button></div></div>
    </form>
  )
}
