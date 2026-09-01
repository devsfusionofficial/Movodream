'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { deleteApplication } from '@/actions/applications'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'

export function DeleteApplicationButton({
  applicationId,
  candidateName,
}: {
  applicationId: string
  candidateName?: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteApplication(applicationId)
      if (!result.success) {
        toast.error(result.error)
      } else {
        toast.success('Application deleted successfully')
        router.push('/admin/applications')
      }
      setDeleteOpen(false)
    })
  }

  const name = candidateName || 'this candidate'

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setDeleteOpen(true)}
        className="gap-1.5 border-[#fee4e2] text-[#d92d20] hover:bg-[#fff1f0] hover:text-[#b42318] hover:border-[#fecdca]"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete application
      </Button>

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isPending={isPending}
        title="Delete Job Application?"
        itemName={candidateName}
        itemType="application"
        description={`Are you sure you want to permanently delete the job application for "${name}"? This action cannot be undone.`}
      />
    </>
  )
}
