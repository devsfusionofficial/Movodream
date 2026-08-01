'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { updateSubscriberStatus } from '@/actions/subscribers'

export function SubscriberRowActions({ id, status }: { id: string; status: 'active' | 'unsubscribed' }) {
  const [isPending, startTransition] = useTransition()
  const nextStatus = status === 'active' ? 'unsubscribed' : 'active'

  function handleToggle() {
    startTransition(async () => {
      const result = await updateSubscriberStatus(id, nextStatus)
      if (!result.success) toast.error(result.error)
      else toast.success(nextStatus === 'active' ? 'Resubscribed' : 'Unsubscribed')
    })
  }

  return (
    <Button variant="outline" size="sm" onClick={handleToggle} disabled={isPending}>
      {status === 'active' ? 'Unsubscribe' : 'Resubscribe'}
    </Button>
  )
}
