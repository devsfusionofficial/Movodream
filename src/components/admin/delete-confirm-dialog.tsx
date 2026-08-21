'use client'

import { AlertTriangle, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type DeleteConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void | Promise<void>
  isPending?: boolean
  title?: string
  description?: string
  itemName?: string
  itemType?: string
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
  title,
  description,
  itemName,
  itemType = 'item',
}: DeleteConfirmDialogProps) {
  const modalTitle = title || `Delete ${itemType}?`
  const modalDescription =
    description ||
    `Are you sure you want to delete ${itemName ? `"${itemName}"` : `this ${itemType}`}? This action is permanent and cannot be undone.`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border border-[#fee4e2] bg-white p-6 shadow-2xl">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff1f0] text-[#d92d20] border border-[#fecdca]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-[#21182a]">
                {modalTitle}
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-xs text-[#857c8b]">
                Permanent action warning
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-3">
          <div className="rounded-xl border border-[#fecdca] bg-[#fffbfa] p-3 text-xs leading-relaxed text-[#b42318]">
            {modalDescription}
          </div>

          {itemName && (
            <div className="rounded-xl border border-[#ebe6ee] bg-[#faf8fb] p-3 text-xs flex items-center justify-between">
              <span className="text-[#857c8b] font-medium">Target {itemType}:</span>
              <span className="font-bold text-[#21182a] truncate max-w-[200px]">{itemName}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-[#f0edf1] pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="border-[#e6e1e9] text-[#21182a] hover:bg-[#f8f3f8]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={isPending}
            className="gap-1.5 bg-[#d92d20] hover:bg-[#b42318] text-white font-semibold shadow-sm"
          >
            <Trash2 className="h-4 w-4" />
            {isPending ? 'Deleting...' : 'Delete Permanently'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
