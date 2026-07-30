'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { deleteCategory } from '@/actions/categories'

export function CategoryRowActions({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('Delete this category?')) return
    startTransition(async () => {
      const result = await deleteCategory(id)
      if (!result.success) toast.error(result.error)
      else toast.success('Category deleted')
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" render={<Link href={`/admin/categories/${id}/edit`} />}>
        Edit
      </Button>
      <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isPending}>
        Delete
      </Button>
    </div>
  )
}
