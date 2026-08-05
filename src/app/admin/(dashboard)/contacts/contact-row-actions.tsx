'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { deleteContactSubmission } from '@/actions/contacts'

export function ContactRowActions({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)

  function handleDelete() {
    if (!confirming) {
      setConfirming(true)
      return
    }
    startTransition(async () => {
      const result = await deleteContactSubmission(id)
      if (!result.success) toast.error(result.error)
      else toast.success('Enquiry deleted')
      setConfirming(false)
    })
  }

  return (
    <div className="flex justify-end gap-2">
      {confirming && (
        <Button variant="ghost" size="sm" onClick={() => setConfirming(false)} disabled={isPending}>
          Cancel
        </Button>
      )}
      <Button
        variant={confirming ? 'destructive' : 'outline'}
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
      >
        {isPending ? 'Deleting…' : confirming ? 'Confirm' : 'Delete'}
      </Button>
    </div>
  )
}
