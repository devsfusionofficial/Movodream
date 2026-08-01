'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateApplicationStatus } from '@/actions/applications'
import { APPLICATION_STATUSES, type ApplicationStatus } from '@/lib/application-status'

export function ApplicationStatusForm({
  applicationId,
  status,
  internalNotes,
}: {
  applicationId: string
  status: ApplicationStatus
  internalNotes?: string
}) {
  const [nextStatus, setNextStatus] = useState<ApplicationStatus>(status)
  const [notes, setNotes] = useState(internalNotes ?? '')
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    startTransition(async () => {
      const result = await updateApplicationStatus(applicationId, { status: nextStatus, internalNotes: notes })
      if (!result.success) toast.error(result.error)
      else toast.success('Application updated')
    })
  }

  return (
    <div className="max-w-md space-y-4">
      <Field>
        <FieldLabel htmlFor="status">Status</FieldLabel>
        <Select value={nextStatus} onValueChange={(v) => v && setNextStatus(v as ApplicationStatus)}>
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {APPLICATION_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="internalNotes">Internal notes</FieldLabel>
        <Textarea id="internalNotes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </Field>

      <Button onClick={handleSave} disabled={isPending}>
        {isPending ? 'Saving…' : 'Save'}
      </Button>
    </div>
  )
}
