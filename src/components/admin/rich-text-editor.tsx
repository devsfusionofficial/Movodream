'use client'

import { useEditor, EditorContent, type JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Trash2, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FileUpload } from './file-upload'

type RichTextEditorProps = {
  initialContent?: JSONContent
  onChange: (value: { json: JSONContent; html: string }) => void
}

/**
 * Clean & feature-rich TipTap Rich Text Editor supporting Bold, Italic,
 * Headings (H2/H3), Bullet/Numbered Lists, Blockquotes, and Image insertion/removal.
 */
export function RichTextEditor({ initialContent, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'admin-editor-image',
        },
      }),
    ],
    content: initialContent ?? '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange({ json: editor.getJSON(), html: editor.getHTML() })
    },
  })

  if (!editor) return null

  const isImageActive = editor.isActive('image')

  return (
    <div className="admin-editor-container rounded-2xl border border-[#ebe5ee] bg-white shadow-xs overflow-hidden transition focus-within:border-[#d71789] focus-within:ring-2 focus-within:ring-[#d71789]/15">
      {/* Clean & Simple Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#f0edf1] bg-[#faf8fb] p-2 sm:p-2.5">
        {/* Bold */}
        <Button
          type="button"
          variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-8 px-2.5 text-xs font-semibold rounded-lg ${
            editor.isActive('bold')
              ? 'bg-[#d71789] text-white hover:bg-[#c0157a]'
              : 'text-[#44384b] hover:bg-[#efeaf1]'
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-3.5 w-3.5 mr-1" />
          Bold
        </Button>

        {/* Italic */}
        <Button
          type="button"
          variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-8 px-2.5 text-xs font-semibold rounded-lg ${
            editor.isActive('italic')
              ? 'bg-[#d71789] text-white hover:bg-[#c0157a]'
              : 'text-[#44384b] hover:bg-[#efeaf1]'
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-3.5 w-3.5 mr-1" />
          Italic
        </Button>

        {/* Heading 2 */}
        <Button
          type="button"
          variant={editor.isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`h-8 px-2.5 text-xs font-semibold rounded-lg ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-[#d71789] text-white hover:bg-[#c0157a]'
              : 'text-[#44384b] hover:bg-[#efeaf1]'
          }`}
          title="Heading 2"
        >
          <Heading2 className="h-3.5 w-3.5 mr-1" />
          H2
        </Button>

        {/* Heading 3 */}
        <Button
          type="button"
          variant={editor.isActive('heading', { level: 3 }) ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`h-8 px-2.5 text-xs font-semibold rounded-lg ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-[#d71789] text-white hover:bg-[#c0157a]'
              : 'text-[#44384b] hover:bg-[#efeaf1]'
          }`}
          title="Heading 3"
        >
          <Heading3 className="h-3.5 w-3.5 mr-1" />
          H3
        </Button>

        <div className="h-4 w-[1px] bg-[#e6e0ea] mx-0.5" />

        {/* Bullet List */}
        <Button
          type="button"
          variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-8 px-2.5 text-xs font-semibold rounded-lg ${
            editor.isActive('bulletList')
              ? 'bg-[#d71789] text-white hover:bg-[#c0157a]'
              : 'text-[#44384b] hover:bg-[#efeaf1]'
          }`}
          title="Bullet List"
        >
          <List className="h-3.5 w-3.5 mr-1" />
          Bullets
        </Button>

        {/* Ordered List */}
        <Button
          type="button"
          variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-8 px-2.5 text-xs font-semibold rounded-lg ${
            editor.isActive('orderedList')
              ? 'bg-[#d71789] text-white hover:bg-[#c0157a]'
              : 'text-[#44384b] hover:bg-[#efeaf1]'
          }`}
          title="Numbered List"
        >
          <ListOrdered className="h-3.5 w-3.5 mr-1" />
          Numbered
        </Button>

        <div className="h-4 w-[1px] bg-[#e6e0ea] mx-0.5" />

        {/* Insert Image */}
        <FileUpload
          label="Insert image"
          onUploaded={({ url }) => {
            editor.chain().focus().setImage({ src: url }).run()
          }}
        />

        {/* Remove Image (active when an image is clicked) */}
        {isImageActive && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              editor.chain().focus().deleteSelection().run()
            }}
            className="h-8 px-3 text-xs font-semibold rounded-lg border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 shadow-xs ring-2 ring-rose-300 animate-in fade-in"
            title="Delete the selected image"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5 text-rose-600" />
            Delete Image
          </Button>
        )}
      </div>

      {/* Floating Helper when an image is clicked */}
      {isImageActive && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-200 bg-rose-50/95 px-3.5 py-2 text-xs text-rose-900 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2 min-w-0">
            <ImageIcon className="h-4 w-4 shrink-0 text-rose-600" />
            <p className="m-0 text-xs font-medium text-rose-900 leading-snug">
              Image selected. Press <kbd className="inline-block rounded border border-rose-300 bg-white/80 px-1.5 py-0.5 font-mono text-[11px] font-bold text-rose-800 shadow-2xs">Backspace</kbd> or click <strong>Delete Image</strong> to remove it.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => editor.chain().focus().deleteSelection().run()}
            className="h-6.5 shrink-0 px-2.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-md shadow-xs transition-colors"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Remove Now
          </Button>
        </div>
      )}

      {/* Main Editable Content Area */}
      <div className="admin-editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
