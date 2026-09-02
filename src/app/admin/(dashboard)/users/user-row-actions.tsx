'use client'

import { useState, useTransition } from 'react'
import { Eye, Shield, Trash2, UserCheck, Calendar, Lock } from 'lucide-react'
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
import { formatAdminDate } from '@/lib/date-format'

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

  const name = user?.name || 'Admin User'
  const email = user?.email || 'N/A'
  const isProtectedUser = email.toLowerCase() === 'harman.singh@movodream.com'

  function handleRoleChange(next: string | null) {
    if (!next) return
    startTransition(async () => {
      const result = await setUserRole(userId, next as CreateUserInput['role'])
      if (!result.success) toast.error(result.error)
      else toast.success('Role updated')
    })
  }

  function handleDelete() {
    if (isProtectedUser) {
      toast.error('This Super Admin account cannot be deleted.')
      setDeleteOpen(false)
      return
    }
    startTransition(async () => {
      const result = await removeUser(userId)
      if (!result.success) toast.error(result.error)
      else toast.success('User deleted')
      setDeleteOpen(false)
      setViewOpen(false)
    })
  }

  return (
    <>
      <div className="flex items-center justify-end gap-2 outline-none h-7">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewOpen(true)}
          className="h-7 w-[68px] gap-1 border-[#e6e1e9] text-[#21182a] hover:bg-[#fce8f2] hover:text-[#d71789] justify-center items-center text-[0.8rem] leading-none"
          title="View user details"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
        {isProtectedUser ? (
          <span
            className="inline-flex h-7 w-[78px] shrink-0 items-center justify-center rounded-[min(var(--radius-md),12px)] border border-[#e6e1e9] bg-[#faf8fb] text-[0.8rem] font-medium text-[#857c8b] select-none leading-none text-center"
            title="Super Admin account is locked and cannot be deleted"
          >
            Protected
          </span>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            disabled={isPending}
            className="h-7 w-[78px] justify-center items-center text-[#b42318] hover:bg-[#fff1f0] text-[0.8rem] leading-none text-center"
          >
            Delete
          </Button>
        )}
      </div>

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isPending={isPending}
        itemName={email}
        itemType="User Account"
      />

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[#ebe6ee] bg-white p-5 sm:p-6 shadow-2xl min-w-0">
          <DialogHeader className="border-b border-[#f0edf1] pb-4 pr-10 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 min-w-0">
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-xl font-bold tracking-tight text-[#21182a] break-words [overflow-wrap:anywhere]">
                  {name}
                </DialogTitle>
                <DialogDescription className="mt-0.5 flex items-center gap-1.5 text-xs text-[#857c8b] min-w-0 truncate">
                  <Shield className="h-3.5 w-3.5 shrink-0 text-[#d71789]" />
                  {isProtectedUser ? 'Super Admin System User' : 'Admin System User'}
                </DialogDescription>
              </div>
              <span className="rounded-full bg-[#fce8f2] px-3 py-1 text-xs font-semibold capitalize text-[#d71789] border border-[#f7d4e5] shrink-0 flex items-center gap-1">
                {isProtectedUser && <Lock className="h-3 w-3" />}
                {isProtectedUser ? 'Super Admin' : 'Admin'}
              </span>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-3 text-xs min-w-0">
            <div className="rounded-xl border border-[#f0edf1] bg-[#faf8fb] p-3 min-w-0 overflow-hidden">
              <span className="text-[#857c8b] block mb-1 font-semibold uppercase tracking-wider">Email Address</span>
              <span className="font-medium text-[#21182a] flex items-center gap-1.5 min-w-0 break-all [overflow-wrap:anywhere]">
                <UserCheck className="h-3.5 w-3.5 shrink-0 text-[#d71789]" />
                <span className="break-all">{email}</span>
              </span>
            </div>
            {user?.createdAt && (
              <div className="rounded-xl border border-[#f0edf1] bg-[#faf8fb] p-3 min-w-0 overflow-hidden">
                <span className="text-[#857c8b] block mb-1 font-semibold uppercase tracking-wider">Member Since</span>
                <span className="font-medium text-[#21182a] flex items-center gap-1.5 min-w-0">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-[#d71789]" />
                  <span>{formatAdminDate(user.createdAt)}</span>
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#f0edf1] pt-4">
            <Button variant="outline" size="sm" onClick={() => setViewOpen(false)} className="border-[#e6e1e9]">
              Close
            </Button>
            {!isProtectedUser && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setViewOpen(false)
                  setDeleteOpen(true)
                }}
                disabled={isPending}
              >
                Delete User
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
