'use client'

import { useState } from 'react'
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export type SubscriberItem = {
  _id: string
  email: string
  status: 'active' | 'unsubscribed'
  subscribedAt?: string
  createdAt: string
  updatedAt?: string
}

export function MarketingSubscribersFilter({ subscribers }: { subscribers: SubscriberItem[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [userFilter, setUserFilter] = useState<'all' | 'active' | 'unsubscribed'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'unsubscribed'>('all')
  const [joinedFilter, setJoinedFilter] = useState<'all' | '7d' | '30d' | '90d'>('all')
  const [exitDateFilter, setExitDateFilter] = useState<'all' | 'has_exit' | 'no_exit'>('all')

  // Pagination state
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const filteredSubscribers = subscribers.filter((sub) => {
    if (searchQuery && !sub.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (userFilter !== 'all' && sub.status !== userFilter) {
      return false
    }
    if (statusFilter !== 'all' && sub.status !== statusFilter) {
      return false
    }
    if (joinedFilter !== 'all') {
      const date = new Date(sub.subscribedAt ?? sub.createdAt)
      const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
      if (joinedFilter === '7d' && diffDays > 7) return false
      if (joinedFilter === '30d' && diffDays > 30) return false
      if (joinedFilter === '90d' && diffDays > 90) return false
    }
    if (exitDateFilter === 'has_exit' && sub.status !== 'unsubscribed') return false
    if (exitDateFilter === 'no_exit' && sub.status === 'unsubscribed') return false

    return true
  })

  const totalRecords = filteredSubscribers.length
  const pageCount = Math.ceil(totalRecords / pageSize) || 1
  const currentPage = Math.min(pageIndex, pageCount - 1)

  const paginatedSubscribers = filteredSubscribers.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  )

  const hasActiveFilters =
    searchQuery !== '' ||
    userFilter !== 'all' ||
    statusFilter !== 'all' ||
    joinedFilter !== 'all' ||
    exitDateFilter !== 'all'

  function handleSearchChange(val: string) {
    setSearchQuery(val)
    setPageIndex(0)
  }

  function handleFilterChange<T>(setter: (val: T) => void, val: T) {
    setter(val)
    setPageIndex(0)
  }

  function resetFilters() {
    setSearchQuery('')
    setUserFilter('all')
    setStatusFilter('all')
    setJoinedFilter('all')
    setExitDateFilter('all')
    setPageIndex(0)
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <label className="relative block flex-1">
          <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#858b8f]" />
          <input
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-9 w-full rounded-xl border border-[#dedede] bg-white pl-9 pr-8 text-xs outline-none focus:border-[#d71789] transition-colors"
            placeholder="Search subscribers by email..."
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </label>

        <Select
          value={userFilter}
          onValueChange={(v) => v && handleFilterChange(setUserFilter, v as 'all' | 'active' | 'unsubscribed')}
        >
          <SelectTrigger className="h-9 w-auto min-w-[130px] rounded-xl border-[#dedede] bg-white text-xs text-[#333]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All users</SelectItem>
            <SelectItem value="active">Opted-in users</SelectItem>
            <SelectItem value="unsubscribed">Opted-out users</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(v) => v && handleFilterChange(setStatusFilter, v as 'all' | 'active' | 'unsubscribed')}
        >
          <SelectTrigger className="h-9 w-auto min-w-[130px] rounded-xl border-[#dedede] bg-white text-xs text-[#333]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Opted in</SelectItem>
            <SelectItem value="unsubscribed">Opted out</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={joinedFilter}
          onValueChange={(v) => v && handleFilterChange(setJoinedFilter, v as 'all' | '7d' | '30d' | '90d')}
        >
          <SelectTrigger className="h-9 w-auto min-w-[140px] rounded-xl border-[#dedede] bg-white text-xs text-[#333]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Joined (All time)</SelectItem>
            <SelectItem value="7d">Joined (Last 7 days)</SelectItem>
            <SelectItem value="30d">Joined (Last 30 days)</SelectItem>
            <SelectItem value="90d">Joined (Last 90 days)</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={exitDateFilter}
          onValueChange={(v) => v && handleFilterChange(setExitDateFilter, v as 'all' | 'has_exit' | 'no_exit')}
        >
          <SelectTrigger className="h-9 w-auto min-w-[130px] rounded-xl border-[#dedede] bg-white text-xs text-[#333]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Exit date (All)</SelectItem>
            <SelectItem value="has_exit">Has exit date</SelectItem>
            <SelectItem value="no_exit">No exit date</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex h-9 items-center gap-1 rounded-xl border border-[#f7d4e5] bg-[#fce8f2] px-3 text-xs font-semibold text-[#d71789] hover:bg-[#f7d4e5] transition-colors shrink-0 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Table List */}
      <div className="overflow-hidden rounded-xl border border-[#ebe6ee] bg-white shadow-xs">
        <div className="grid grid-cols-[1.3fr_2fr_1fr_1fr_1fr] border-b border-[#ebe6ee] bg-[#fbf9fc] px-4 py-3 text-xs font-bold text-[#21182a]">
          <span>Subscriber</span>
          <span>Email</span>
          <span>Marketing</span>
          <span>Joined</span>
          <span>Exit date</span>
        </div>

        {paginatedSubscribers.length > 0 ? (
          paginatedSubscribers.map((subscriber) => (
            <div
              key={subscriber._id}
              className="grid grid-cols-[1.3fr_2fr_1fr_1fr_1fr] items-center border-b border-[#f3eff4] px-4 py-3 text-sm last:border-0 hover:bg-[#fcf9fc] transition-colors"
            >
              <span className="font-semibold text-[#21182a]">Subscriber</span>
              <span className="text-xs text-[#382b40] font-medium">{subscriber.email}</span>
              <span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    subscriber.status === 'active'
                      ? 'bg-[#fce8f2] text-[#d71789] border border-[#f7d4e5]'
                      : 'bg-[#f3f3f3] text-[#4b4f52]'
                  }`}
                >
                  {subscriber.status === 'active' ? 'Opted in' : 'Opted out'}
                </span>
              </span>
              <span className="text-xs text-[#857c8b]">
                {new Date(subscriber.subscribedAt ?? subscriber.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="text-xs text-[#857c8b]">
                {subscriber.status === 'unsubscribed'
                  ? new Date(subscriber.updatedAt ?? subscriber.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : '—'}
              </span>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-sm text-[#887f8e]">
            No marketing subscribers match your active filters.
          </div>
        )}
      </div>

      {/* Pagination Controls Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1 text-xs text-[#887f8e]">
        <div className="flex flex-wrap items-center gap-3">
          <span>
            Showing <strong className="text-[#21182a]">{paginatedSubscribers.length}</strong> of{' '}
            <strong className="text-[#21182a]">{totalRecords}</strong> subscribers
          </span>

          <div className="flex items-center gap-1.5 border-l border-[#e8e1ea] pl-3">
            <span>Rows:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                if (val) {
                  setPageSize(Number(val))
                  setPageIndex(0)
                }
              }}
            >
              <SelectTrigger size="sm" className="h-7 w-16 rounded-lg border-[#dedede] bg-white text-xs font-semibold text-[#21182a]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="mr-1 text-xs text-[#887f8e]">
            Page <strong className="text-[#21182a]">{totalRecords > 0 ? currentPage + 1 : 0}</strong> of{' '}
            <strong className="text-[#21182a]">{pageCount}</strong>
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="h-8 gap-1 rounded-lg border-[#e6e1e9] text-xs font-medium hover:bg-[#fce8f2] hover:text-[#d71789] disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </Button>

          {pageCount > 1 && (
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPageIndex(i)}
                  className={`h-7 w-7 rounded-lg text-xs font-semibold transition ${
                    currentPage === i
                      ? 'bg-[#d71789] text-white shadow-xs'
                      : 'border border-[#e6e1e9] bg-white text-[#21182a] hover:bg-[#fce8f2] hover:text-[#d71789]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
            disabled={currentPage >= pageCount - 1}
            className="h-8 gap-1 rounded-lg border-[#e6e1e9] text-xs font-medium hover:bg-[#fce8f2] hover:text-[#d71789] disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
