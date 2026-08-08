'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { deleteTag } from '@/actions/tags'

export function TagRowActions({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('Delete this tag?')) return
    startTransition(async () => {
      const result = await deleteTag(id)
      if (!result.success) toast.error(result.error)
      else toast.success('Tag deleted')
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" render={<Link href={`/admin/tags/${id}/edit`} />}>
        Edit
      </Button>
      <Button variant="ghost" size="sm" className="text-[#b42318] hover:bg-[#fff1f0] hover:text-[#b42318]" onClick={handleDelete} disabled={isPending}>
        {isPending ? 'Deleting…' : 'Delete'}
      </Button>
    </div>
  )
}
