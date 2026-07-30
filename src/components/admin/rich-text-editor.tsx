'use client'

import { useEditor, EditorContent, type JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Button } from '@/components/ui/button'
import { FileUpload } from './file-upload'

type RichTextEditorProps = {
  initialContent?: JSONContent
  onChange: (value: { json: JSONContent; html: string }) => void
}

/**
 * Produces both the editable JSON (round-tripped back into the editor when
 * re-opening a draft) and rendered HTML (served to public pages directly,
 * so they don't pay a render cost per request) on every change.
 */
export function RichTextEditor({ initialContent, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: initialContent ?? '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange({ json: editor.getJSON(), html: editor.getHTML() })
    },
  })

  if (!editor) return null

  return (
    <div className="rounded-md border">
      <div className="flex flex-wrap items-center gap-1 border-b p-2">
        <Button
          type="button"
          variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </Button>
        <Button
          type="button"
          variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </Button>
        <Button
          type="button"
          variant={editor.isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Button>
        <Button
          type="button"
          variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          List
        </Button>
        <Button
          type="button"
          variant={editor.isActive('blockquote') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </Button>
        <FileUpload
          label="Insert image"
          onUploaded={({ url }) => editor.chain().focus().setImage({ src: url }).run()}
        />
      </div>
      <EditorContent editor={editor} className="prose prose-sm max-w-none p-4 focus:outline-none" />
    </div>
  )
}
