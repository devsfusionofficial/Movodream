import Link from 'next/link'
import { ArrowUpRight, BriefcaseBusiness, FileText, Plus, Sparkles, Users, UserRound } from 'lucide-react'
import { requireSession } from '@/lib/auth-guard'
import { getDashboardData } from '@/lib/queries/dashboard'
import { FormattedDate, FormattedRelativeDate } from '@/components/admin/formatted-date'

function statusTone(status?: string) {
  if (status === 'published' || status === 'active' || status === 'Hired') return 'bg-[#fce8f2] text-[#d71789]'
  if (status === 'draft' || status === 'Applied') return 'bg-[#fff4df] text-[#a56806]'
  return 'bg-[#f1edf3] text-[#756b7b]'
}

export default async function AdminDashboardPage() {
  const session = await requireSession()

  const { metrics: counts, recentPosts, recentApplications } = await getDashboardData({
    canReadPosts: true,
    canReadJobs: true,
    canReadApplications: true,
    canReadSubscribers: true,
  })

  const metrics = [
    {
      label: 'Published posts',
      value: counts.publishedPosts,
      total: counts.totalPosts,
      icon: FileText,
      color: 'text-[#d71789]',
      bg: 'bg-[#fce8f2]',
      href: '/admin/posts',
    },
    {
      label: 'Open opportunities',
      value: counts.publishedJobs,
      total: counts.totalJobs,
      icon: BriefcaseBusiness,
      color: 'text-[#6b43bb]',
      bg: 'bg-[#f0eaff]',
      href: '/admin/jobs',
    },
    {
      label: 'Applications',
      value: counts.totalApplications,
      total: counts.appliedApplications,
      icon: Users,
      color: 'text-[#197a85]',
      bg: 'bg-[#e6f7f7]',
      href: '/admin/applications',
    },
    {
      label: 'Active subscribers',
      value: counts.activeSubscribers,
      total: counts.totalSubscribers,
      icon: UserRound,
      color: 'text-[#b46b10]',
      bg: 'bg-[#fff3df]',
      href: '/admin/subscribers',
    },
  ]

  return (
    <div className="mx-auto max-w-[1440px] space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d71789]">
            Good to see you, {session.user.name?.split(' ')[0] ?? 'there'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#21182a]">
            Your workspace at a glance.
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#887f8e]">
            Keep your content, people, and opportunities moving forward.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex h-10 sm:h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d71789] to-[#ff7294] px-4 sm:px-5 text-xs sm:text-sm font-semibold text-white shadow-[0_8px_20px_rgba(215,23,137,0.25)] hover:opacity-95 border-0 transition shrink-0"
        >
          <Plus className="h-4 w-4" />
          Create a post
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Link
              href={metric.href}
              key={metric.label}
              className="group rounded-2xl border border-[#ebe6ee] bg-white p-4 sm:p-5 shadow-[0_5px_18px_rgba(34,20,40,0.025)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(34,20,40,0.08)]"
            >
              <div className="flex items-start justify-between">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${metric.bg} ${metric.color}`}>
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <ArrowUpRight className="h-4 w-4 text-[#c5bdc9] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#d71789]" />
              </div>
              <p className="mt-4 text-2xl font-bold tracking-tight text-[#2b2032]">{metric.value}</p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-[#857c8b]">{metric.label}</p>
                <span className="text-[10px] font-semibold text-[#aaa1af]">{metric.total} total</span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Activity Sections */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="overflow-hidden rounded-2xl border border-[#ebe6ee] bg-white shadow-[0_5px_18px_rgba(34,20,40,0.025)]">
          <div className="flex items-center justify-between border-b border-[#f0edf1] px-4 sm:px-6 py-4">
            <div>
              <h2 className="text-sm sm:text-[15px] font-bold text-[#2b2032]">Recent content</h2>
              <p className="mt-0.5 text-xs text-[#978e9e]">Your latest posts and publishing activity</p>
            </div>
            <Link href="/admin/posts" className="text-xs font-semibold text-[#b40d6d] hover:underline">
              View all
            </Link>
          </div>
          {recentPosts.length ? (
            <div className="divide-y divide-[#f3eff4]">
              {recentPosts.map((post) => (
                <Link
                  href={`/admin/posts/${post._id}/edit`}
                  key={post._id}
                  className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3.5 transition hover:bg-[#fcf9fc]"
                >
                  <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-[#fce8f2] text-[#d71789]">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs sm:text-sm font-semibold text-[#382b40]">
                      {post.title ?? 'Untitled post'}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#a39aa7]">
                      <FormattedDate date={post.createdAt} /> · <FormattedRelativeDate date={post.createdAt} />
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize shrink-0 ${statusTone(post.status)}`}>
                    {post.status ?? 'draft'}
                  </span>
                  <ArrowUpRight className="hidden h-4 w-4 text-[#c4bac7] sm:block shrink-0" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-6 py-10 text-center">
              <Sparkles className="mx-auto h-6 w-6 text-[#d71789]" />
              <p className="mt-3 text-sm font-medium text-[#564a5d]">No posts yet</p>
              <Link href="/admin/posts/new" className="mt-2 inline-block text-xs font-semibold text-[#b40d6d]">
                Create your first post
              </Link>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#ebe6ee] bg-white shadow-[0_5px_18px_rgba(34,20,40,0.025)]">
          <div className="flex items-center justify-between border-b border-[#f0edf1] px-4 sm:px-6 py-4">
            <div>
              <h2 className="text-sm sm:text-[15px] font-bold text-[#2b2032]">Latest applications</h2>
              <p className="mt-0.5 text-xs text-[#978e9e]">People interested in joining</p>
            </div>
            <Link href="/admin/applications" className="text-xs font-semibold text-[#b40d6d] hover:underline">
              View all
            </Link>
          </div>
          {recentApplications.length ? (
            <div className="divide-y divide-[#f3eff4]">
              {recentApplications.map((application) => (
                <Link
                  href={`/admin/applications/${application._id}`}
                  key={application._id}
                  className="flex items-center gap-3 px-4 sm:px-6 py-3.5 transition hover:bg-[#fcf9fc]"
                >
                  <span className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-[#f0eaff] text-xs font-bold text-[#6b43bb]">
                    {(application.name ?? 'A').slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs sm:text-sm font-semibold text-[#382b40]">
                      {application.name ?? 'Applicant'}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-[#a39aa7]">
                      {application.job?.title ?? 'General application'} · <FormattedRelativeDate date={application.createdAt} />
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ${statusTone(application.status)}`}>
                    {application.status ?? 'Applied'}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-6 py-10 text-center">
              <Users className="mx-auto h-6 w-6 text-[#6b43bb]" />
              <p className="mt-3 text-sm font-medium text-[#564a5d]">No applications yet</p>
              <p className="mt-1 text-xs text-[#a39aa7]">New candidates will appear here.</p>
            </div>
          )}
        </section>
      </div>

      {/* Footer Banner */}
      <section className="rounded-2xl bg-[linear-gradient(110deg,#241235_0%,#391747_65%,#621747_100%)] p-5 sm:p-7 text-white shadow-[0_14px_32px_rgba(36,18,53,0.14)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ff9ab2]">Keep creating</p>
            <h2 className="mt-1 text-lg sm:text-xl font-bold tracking-tight">Every great journey starts with a story.</h2>
            <p className="mt-1 max-w-lg text-xs sm:text-sm leading-relaxed text-white/70">
              Publish a new destination guide, update your opportunities, or keep your community in the loop.
            </p>
          </div>
          <Link
            href="/admin/posts/new"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-[#241235] transition hover:bg-[#fff1f7]"
          >
            <Plus className="h-4 w-4" />
            Start creating
          </Link>
        </div>
      </section>
    </div>
  )
}
