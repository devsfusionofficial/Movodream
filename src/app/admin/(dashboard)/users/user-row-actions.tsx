'use client'

import { useState, useTransition } from 'react'
import { Eye, Shield, Trash2, UserCheck, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { removeUser, setUserRole } from '@/actions/users'
import type { CreateUserInput } from '@/lib/validation/user'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'

export function UserRowActions({
  userId,
  user,
}: {
  userId: string
  user?: {
    name?: string | null
    email?: string
    role?: string
    createdAt?: Date | string
  }
}) {
  const [isPending, startTransition] = useTransition()
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleRoleChange(next: string | null) {
    if (!next) return
    startTransition(async () => {
      const result = await setUserRole(userId, next as CreateUserInput['role'])
      if (!result.success) toast.error(result.error)
      else toast.success('Role updated')
    })
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await removeUser(userId)
      if (!result.success) toast.error(result.error)
      else toast.success('User removed')
      setDeleteOpen(false)
      setViewOpen(false)
    })
  }

  const role = user?.role || 'editor'
  const name = user?.name || 'Admin User'
  const email = user?.email || 'N/A'

  return (
    <>
      <div className="flex items-center justify-end gap-2 outline-none">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewOpen(true)}
          className="gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#fce8f2] hover:text-[#d71789]"
          title="View user details"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDeleteOpen(true)}
          disabled={isPending}
          className="text-[#b42318] hover:bg-[#fff1f0]"
        >
          Remove
        </Button>
      </div>

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleRemove}
        isPending={isPending}
        itemName={email}
        itemType="User Account"
      />

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-md rounded-2xl border border-[#ebe6ee] bg-white p-6 shadow-2xl">
          <DialogHeader className="border-b border-[#f0edf1] pb-4 pr-10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-[#21182a]">
                  {name}
                </DialogTitle>
                <DialogDescription className="mt-0.5 flex items-center gap-1.5 text-xs text-[#857c8b]">
                  <Shield className="h-3.5 w-3.5 text-[#d71789]" />
                  Admin System User
                </DialogDescription>
              </div>
              <span className="rounded-full bg-[#fce8f2] px-3 py-1 text-xs font-semibold capitalize text-[#d71789] border border-[#f7d4e5]">
                {role}
              </span>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-3 text-xs">
            <div className="rounded-xl border border-[#f0edf1] bg-[#faf8fb] p-3">
              <span className="text-[#857c8b] block mb-1 font-semibold uppercase tracking-wider">Email Address</span>
              <span className="font-medium text-[#21182a] flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-[#d71789]" />
                {email}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#f0edf1] pt-4">
            <Button variant="outline" size="sm" onClick={() => setViewOpen(false)} className="border-[#e6e1e9]">
              Close
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setViewOpen(false)
                setDeleteOpen(true)
              }}
              disabled={isPending}
            >
              Remove User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
