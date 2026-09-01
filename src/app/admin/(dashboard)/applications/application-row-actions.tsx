'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Eye, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { deleteApplication } from '@/actions/applications'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'

export function ApplicationRowActions({
  id,
  candidateName,
}: {
  id: string
  candidateName?: string
}) {
  const [isPending, startTransition] = useTransition()
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteApplication(id)
      if (!result.success) {
        toast.error(result.error)
      } else {
        toast.success('Application deleted successfully')
      }
      setDeleteOpen(false)
    })
  }

  const name = candidateName || 'this candidate'

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        <Button
          variant="outline"
          size="sm"
          render={<Link href={`/admin/applications/${id}`} />}
          className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#fce8f2] hover:text-[#d71789]"
          title="View application details"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDeleteOpen(true)}
          className="gap-1 border-[#fee4e2] text-[#d92d20] hover:bg-[#fff1f0] hover:text-[#b42318] hover:border-[#fecdca]"
          title="Delete application"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </div>

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isPending={isPending}
        title="Delete Job Application?"
        itemName={candidateName}
        itemType="application"
        description={`Are you sure you want to delete the job application from "${name}"? This action is permanent and cannot be undone.`}
      />
    </>
  )
}
