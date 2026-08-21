import Link from 'next/link'
import { ArrowUpRight, BriefcaseBusiness, CheckCircle2, Clock3, Plus, UsersRound } from 'lucide-react'
import { listJobs } from '@/actions/jobs'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { columns } from './columns'

export default async function JobsPage() {
  const jobs = await listJobs()
  const open = jobs.filter((job) => job.status === 'published').length
  const drafts = jobs.filter((job) => job.status === 'draft').length
  const closed = jobs.filter((job) => job.status === 'closed' || job.status === 'disabled').length

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d71789]">Talent & opportunities</p>
          <h1 className="text-3xl font-semibold tracking-[-0.06em] text-[#21182a] sm:text-4xl">Jobs</h1>
          <p className="mt-3 text-sm text-[#887f8e]">Build the team behind better journeys and experiences.</p>
        </div>
        <Button
          render={<Link href="/admin/jobs/new" />}
          className="h-11 rounded-xl bg-gradient-to-r from-[#d71789] to-[#ff7294] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(215,23,137,0.25)] hover:opacity-95 border-0"
        >
          <Plus className="h-4 w-4" />
          New job
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/jobs?status=published"
          className="group rounded-2xl border border-[#ebe6ee] bg-white p-5 shadow-[0_5px_18px_rgba(34,20,40,0.025)] transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fce8f2] text-[#d71789]">
              <CheckCircle2 className="h-[18px] w-[18px]" />
            </span>
            <ArrowUpRight className="h-4 w-4 text-[#c6bdc9] transition group-hover:text-[#d71789]" />
          </div>
          <p className="mt-5 text-2xl font-semibold tracking-[-0.05em] text-[#2b2032]">{open}</p>
          <p className="mt-1 text-xs text-[#857c8b]">Open positions</p>
        </Link>
        <Link
          href="/admin/jobs?status=draft"
          className="group rounded-2xl border border-[#ebe6ee] bg-white p-5 shadow-[0_5px_18px_rgba(34,20,40,0.025)] transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff3df] text-[#b46b10]">
              <Clock3 className="h-[18px] w-[18px]" />
            </span>
            <ArrowUpRight className="h-4 w-4 text-[#c6bdc9] transition group-hover:text-[#d71789]" />
          </div>
          <p className="mt-5 text-2xl font-semibold tracking-[-0.05em] text-[#2b2032]">{drafts}</p>
          <p className="mt-1 text-xs text-[#857c8b]">Draft listings</p>
        </Link>
        <div className="rounded-2xl border border-[#ebe6ee] bg-[linear-gradient(115deg,#241235,#4c194e)] p-5 text-white shadow-[0_8px_20px_rgba(36,18,53,0.12)]">
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#ff9ab2]">
              <UsersRound className="h-[18px] w-[18px]" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">Recruiting</span>
          </div>
          <p className="mt-5 text-2xl font-semibold tracking-[-0.05em]">{closed}</p>
          <p className="mt-1 text-xs text-white/55">Closed or paused</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#ebe6ee] bg-white p-4 sm:p-4.5 shadow-[0_5px_18px_rgba(34,20,40,0.025)]">
        <DataTable
          title="Opportunity board"
          description="Manage roles, teams, and the next people you want to welcome."
          searchColumnId="title"
          searchPlaceholder="Search job titles..."
          headerActions={
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#fce8f2] px-3 py-1.5 text-[11px] font-semibold text-[#b40d6d]">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              {jobs.length} listings
            </span>
          }
          columns={columns}
          data={jobs}
        />
      </section>
    </div>
  )
}
