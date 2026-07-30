'use client'

import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
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

type PostFormProps = {
  postId?: string
  defaultValues?: Partial<PostInput>
  authors: Option[]
  categories: Option[]
  tags: Option[]
}

export function PostForm({ postId, defaultValues, authors, categories, tags }: PostFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: { status: 'draft', categoryIds: [], tagIds: [], ...defaultValues },
  })

  async function onSubmit(values: PostInput) {
    const result = postId ? await updatePost(postId, values) : await createPost(values)
    if (!result.success) {
      toast.error(result.error)
      return
    }
    toast.success(postId ? 'Post updated' : 'Post created')
    router.push('/admin/posts')
    router.refresh()
  }

  const heroImageUrl = watch('heroImageUrl')
  const status = watch('status')
  const categoryIds = watch('categoryIds') ?? []
  const tagIds = watch('tagIds') ?? []

  function toggleId(field: 'categoryIds' | 'tagIds', id: string, current: string[]) {
    setValue(field, current.includes(id) ? current.filter((c) => c !== id) : [...current, id])
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-2xl">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input id="title" {...register('title')} />
          <FieldError errors={[errors.title]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <Input id="slug" placeholder="Auto-generated from title if left blank" {...register('slug')} />
          <FieldError errors={[errors.slug]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="excerpt">Excerpt</FieldLabel>
          <Textarea id="excerpt" rows={3} {...register('excerpt')} />
          <FieldDescription>Shown on /blog cards and used as a fallback SEO description.</FieldDescription>
          <FieldError errors={[errors.excerpt]} />
        </Field>

        <Field>
          <FieldLabel>Hero image</FieldLabel>
          <div className="flex items-center gap-3">
            {heroImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={heroImageUrl} alt="" className="h-16 w-28 rounded object-cover" />
            )}
            <FileUpload
              label={heroImageUrl ? 'Replace image' : 'Upload image'}
              onUploaded={({ url, key }) => {
                setValue('heroImageUrl', url)
                setValue('heroImageKey', key)
              }}
            />
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="authorId">Author</FieldLabel>
          <Select value={watch('authorId') || undefined} onValueChange={(v) => v && setValue('authorId', v)}>
            <SelectTrigger id="authorId">
              <SelectValue placeholder="Select author" />
            </SelectTrigger>
            <SelectContent>
              {authors.map((author) => (
                <SelectItem key={author._id} value={author._id}>
                  {author.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>Categories</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const active = categoryIds.includes(category._id)
              return (
                <button
                  key={category._id}
                  type="button"
                  onClick={() => toggleId('categoryIds', category._id, categoryIds)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    active ? 'border-foreground bg-foreground text-background' : 'border-input text-foreground/70'
                  }`}
                >
                  {category.name}
                </button>
              )
            })}
          </div>
        </Field>

        <Field>
          <FieldLabel>Tags</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const active = tagIds.includes(tag._id)
              return (
                <button
                  key={tag._id}
                  type="button"
                  onClick={() => toggleId('tagIds', tag._id, tagIds)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    active ? 'border-foreground bg-foreground text-background' : 'border-input text-foreground/70'
                  }`}
                >
                  {tag.name}
                </button>
              )
            })}
          </div>
        </Field>

        <Field>
          <FieldLabel>Content</FieldLabel>
          <Controller
            control={control}
            name="contentJson"
            render={({ field }) => (
              <RichTextEditor
                initialContent={field.value}
                onChange={({ json, html }) => {
                  field.onChange(json)
                  setValue('contentHtml', html)
                }}
              />
            )}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="status">Status</FieldLabel>
          <Select value={status} onValueChange={(v) => v && setValue('status', v as PostInput['status'])}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          <FieldError errors={[errors.status]} />
        </Field>

        {status === 'scheduled' && (
          <Field>
            <FieldLabel htmlFor="publishedAt">Publish at</FieldLabel>
            <Input id="publishedAt" type="datetime-local" {...register('publishedAt')} />
          </Field>
        )}

        <Field>
          <FieldLabel htmlFor="seoTitle">SEO title</FieldLabel>
          <Input id="seoTitle" placeholder="Defaults to the post title" {...register('seoTitle')} />
        </Field>

        <Field>
          <FieldLabel htmlFor="seoDescription">SEO description</FieldLabel>
          <Textarea id="seoDescription" rows={2} placeholder="Defaults to the excerpt" {...register('seoDescription')} />
        </Field>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : postId ? 'Save changes' : 'Create post'}
        </Button>
      </FieldGroup>
    </form>
  )
}
