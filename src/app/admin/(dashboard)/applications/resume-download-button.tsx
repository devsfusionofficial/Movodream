'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { getApplicationResumeUrl } from '@/actions/applications'

export function ResumeDownloadButton({ applicationId }: { applicationId: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDownload() {
    startTransition(async () => {
      const result = await getApplicationResumeUrl(applicationId)
      if ('error' in result) {
        toast.error(result.error)
        return
      }
      window.open(result.url, '_blank', 'noopener,noreferrer')
    })
  }

  return (
    <Button variant="outline" onClick={handleDownload} disabled={isPending}>
      {isPending ? 'Preparing link…' : 'Download resume'}
    </Button>
  )
}
