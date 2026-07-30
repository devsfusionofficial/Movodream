'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { removeUser, setUserRole } from '@/actions/users'
import type { CreateUserInput } from '@/lib/validation/user'

export function UserRowActions({ userId, role }: { userId: string; role: string }) {
  const [isPending, startTransition] = useTransition()

  function handleRoleChange(next: string | null) {
    if (!next) return
    startTransition(async () => {
      const result = await setUserRole(userId, next as CreateUserInput['role'])
      if (!result.success) toast.error(result.error)
      else toast.success('Role updated')
    })
  }

  function handleRemove() {
    if (!confirm('Remove this user? This cannot be undone.')) return
    startTransition(async () => {
      const result = await removeUser(userId)
      if (!result.success) toast.error(result.error)
      else toast.success('User removed')
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={role} onValueChange={handleRoleChange} disabled={isPending}>
        <SelectTrigger className="h-8 w-28">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="editor">Editor</SelectItem>
          <SelectItem value="hr">HR</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="ghost" size="sm" onClick={handleRemove} disabled={isPending}>
        Remove
      </Button>
    </div>
  )
}
