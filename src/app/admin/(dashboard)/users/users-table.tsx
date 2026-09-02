'use client'

import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { DataTable } from '@/components/admin/data-table'
import { columns, type UserRow } from './columns'

export function UsersTable({ users }: { users: UserRow[] }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return users

    return users.filter((u) => {
      const isSuper = u.email?.toLowerCase() === 'harman.singh@movodream.com'
      const displayRole = isSuper ? 'Super Admin' : (u.role === 'admin' ? 'Admin' : (u.role || 'Admin'))
      const name = (u.name || '').trim().toLowerCase()
      const email = (u.email || '').trim().toLowerCase()
      const role = displayRole.toLowerCase()

      // Match name or email directly
      if (name.includes(q) || email.includes(q)) return true

      // Role matching:
      // If typing "super" or "super admin" -> matches Super Admin
      if (q === 'super' || q === 'super admin' || q === 'superadmin') {
        return isSuper
      }

      // If typing "admin" -> matches regular Admin users (and anyone with admin in name/email)
      if (q === 'admin') {
        return !isSuper || name.includes('admin') || email.includes('admin')
      }

      // Substring match on role
      return role.includes(q)
    })
  }, [users, searchQuery])

  return (
    <DataTable
      title="User directory"
      description="Active accounts with admin workspace access."
      searchable={false}
      headerActions={
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full min-w-0 max-w-xs sm:w-64">
            <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#858b8f]" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-xl border border-[#dedede] bg-white pl-9 pr-8 text-xs outline-none focus:border-[#d71789] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#fce8f2] px-3 py-1.5 text-[11px] font-semibold text-[#b40d6d]">
            {filteredUsers.length} {filteredUsers.length === 1 ? 'account' : 'accounts'}
          </span>
        </div>
      }
      columns={columns}
      data={filteredUsers}
    />
  )
}
