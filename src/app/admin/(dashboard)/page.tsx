import Link from 'next/link'
import { ArrowUpRight, BriefcaseBusiness, FileText, Plus, Sparkles, Users, UserRound } from 'lucide-react'
import { listApplications } from '@/actions/applications'
import { listJobs } from '@/actions/jobs'
import { listPosts } from '@/actions/posts'
import { listSubscribers } from '@/actions/subscribers'
import { requireSession } from '@/lib/auth-guard'
import { roles, type AppRole } from '@/lib/permissions'

type DashboardItem = { _id?: string; title?: string; name?: string; email?: string; status?: string; createdAt?: string; appliedAt?: string; job?: { title?: string } }

function canRead(role: AppRole, resource: keyof typeof import('@/lib/permissions').statement) {
  return roles[role]?.authorize({ [resource]: ['read'] } as never)?.success ?? false
}

function relativeDate(value?: string) {
  if (!value) return 'Recently'
  const date = new Date(value)
  const days = Math.floor((Date.now() - date.getTime()) / 86400000)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

function statusTone(status?: string) {
  if (status === 'published' || status === 'active' || status === 'Hired') return 'bg-[#fce8f2] text-[#d71789]'
  if (status === 'draft' || status === 'Applied') return 'bg-[#fff4df] text-[#a56806]'
  return 'bg-[#f1edf3] text-[#756b7b]'
}

export default async function AdminDashboardPage() {
  const session = await requireSession()
  const role = ((session.user as { role?: AppRole }).role ?? 'editor') as AppRole
  const [posts, jobs, applications, subscribers] = await Promise.all([
    canRead(role, 'posts') ? listPosts() : Promise.resolve([]),
    canRead(role, 'jobs') ? listJobs() : Promise.resolve([]),
    canRead(role, 'applications') ? listApplications() : Promise.resolve([]),
    canRead(role, 'subscribers') ? listSubscribers() : Promise.resolve([]),
  ])
  const postItems = posts as DashboardItem[]
  const jobItems = jobs as DashboardItem[]
  const applicationItems = applications as DashboardItem[]
  const subscriberItems = subscribers as DashboardItem[]
  const recentPosts = postItems.slice(0, 4)
  const recentApplications = applicationItems.slice(0, 4)

  const metrics = [
    { label: 'Published posts', value: postItems.filter((post) => post.status === 'published').length, total: postItems.length, icon: FileText, color: 'text-[#d71789]', bg: 'bg-[#fce8f2]', href: '/admin/posts' },
    { label: 'Open opportunities', value: jobItems.filter((job) => job.status === 'published').length, total: jobItems.length, icon: BriefcaseBusiness, color: 'text-[#6b43bb]', bg: 'bg-[#f0eaff]', href: '/admin/jobs' },
    { label: 'Applications', value: applicationItems.length, total: applicationItems.filter((application) => application.status === 'Applied').length, icon: Users, color: 'text-[#197a85]', bg: 'bg-[#e6f7f7]', href: '/admin/applications' },
    { label: 'Active subscribers', value: subscriberItems.filter((subscriber) => subscriber.status === 'active').length, total: subscriberItems.length, icon: UserRound, color: 'text-[#b46b10]', bg: 'bg-[#fff3df]', href: '/admin/subscribers' },
  ]

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d71789]">Good to see you, {session.user.name?.split(' ')[0] ?? 'there'}</p><h1 className="text-3xl font-semibold tracking-[-0.055em] text-[#21182a] sm:text-4xl">Your workspace at a glance.</h1><p className="mt-3 text-sm text-[#887f8e]">Keep your content, people, and opportunities moving forward.</p></div><Link href="/admin/posts/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d71789] to-[#ff7294] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(215,23,137,0.25)] hover:opacity-95 border-0 transition"><Plus className="h-4 w-4" />Create a post</Link></div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => { const Icon = metric.icon; return <Link href={metric.href} key={metric.label} className="group rounded-2xl border border-[#ebe6ee] bg-white p-5 shadow-[0_5px_18px_rgba(34,20,40,0.025)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(34,20,40,0.08)]"><div className="flex items-start justify-between"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${metric.bg} ${metric.color}`}><Icon className="h-[18px] w-[18px]" /></span><ArrowUpRight className="h-4 w-4 text-[#c5bdc9] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#d71789]" /></div><p className="mt-6 text-2xl font-semibold tracking-[-0.05em] text-[#2b2032]">{metric.value}</p><div className="mt-1 flex items-center justify-between gap-2"><p className="text-xs text-[#857c8b]">{metric.label}</p><span className="text-[10px] font-medium text-[#aaa1af]">{metric.total} total</span></div></Link> })}</div>

      <div className="grid gap-6 xl:grid-cols-[1.28fr_0.72fr]">
        <section className="overflow-hidden rounded-2xl border border-[#ebe6ee] bg-white shadow-[0_5px_18px_rgba(34,20,40,0.025)]"><div className="flex items-center justify-between border-b border-[#f0edf1] px-6 py-5"><div><h2 className="text-[15px] font-semibold text-[#2b2032]">Recent content</h2><p className="mt-1 text-xs text-[#978e9e]">Your latest posts and publishing activity</p></div><Link href="/admin/posts" className="text-xs font-semibold text-[#b40d6d] hover:underline">View all</Link></div>{recentPosts.length ? <div className="divide-y divide-[#f3eff4]">{recentPosts.map((post) => <Link href={`/admin/posts/${post._id}/edit`} key={post._id} className="flex items-center gap-4 px-6 py-4 transition hover:bg-[#fcf9fc]"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fce8f2] text-[#d71789]"><FileText className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#382b40]">{post.title ?? 'Untitled post'}</p><p className="mt-1 text-xs text-[#a39aa7]">Updated {relativeDate(post.createdAt)}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${statusTone(post.status)}`}>{post.status ?? 'draft'}</span><ArrowUpRight className="hidden h-4 w-4 text-[#c4bac7] sm:block" /></Link>)}</div> : <div className="px-6 py-12 text-center"><Sparkles className="mx-auto h-6 w-6 text-[#d71789]" /><p className="mt-3 text-sm font-medium text-[#564a5d]">No posts yet</p><Link href="/admin/posts/new" className="mt-2 inline-block text-xs font-semibold text-[#b40d6d]">Create your first post</Link></div>}</section>

        <section className="overflow-hidden rounded-2xl border border-[#ebe6ee] bg-white shadow-[0_5px_18px_rgba(34,20,40,0.025)]"><div className="flex items-center justify-between border-b border-[#f0edf1] px-6 py-5"><div><h2 className="text-[15px] font-semibold text-[#2b2032]">Latest applications</h2><p className="mt-1 text-xs text-[#978e9e]">People interested in joining</p></div><Link href="/admin/applications" className="text-xs font-semibold text-[#b40d6d] hover:underline">View all</Link></div>{recentApplications.length ? <div className="divide-y divide-[#f3eff4]">{recentApplications.map((application) => <Link href={`/admin/applications/${application._id}`} key={application._id} className="flex items-center gap-3 px-6 py-4 transition hover:bg-[#fcf9fc]"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f0eaff] text-xs font-bold text-[#6b43bb]">{(application.name ?? 'A').slice(0, 1).toUpperCase()}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#382b40]">{application.name ?? 'Applicant'}</p><p className="mt-1 truncate text-[11px] text-[#a39aa7]">{application.job?.title ?? 'General application'}</p></div><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusTone(application.status)}`}>{application.status ?? 'Applied'}</span></Link>)}</div> : <div className="px-6 py-12 text-center"><Users className="mx-auto h-6 w-6 text-[#6b43bb]" /><p className="mt-3 text-sm font-medium text-[#564a5d]">No applications yet</p><p className="mt-1 text-xs text-[#a39aa7]">New candidates will appear here.</p></div>}</section>
      </div>

      <section className="rounded-2xl bg-[linear-gradient(110deg,#241235_0%,#391747_65%,#621747_100%)] p-6 text-white shadow-[0_14px_32px_rgba(36,18,53,0.14)] sm:p-8"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center"><div><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ff9ab2]">Keep creating</p><h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">Every great journey starts with a story.</h2><p className="mt-2 max-w-lg text-sm leading-6 text-white/60">Publish a new destination guide, update your opportunities, or keep your community in the loop.</p></div><Link href="/admin/posts/new" className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-[#241235] transition hover:bg-[#fff1f7]"><Plus className="h-4 w-4" />Start creating</Link></div></section>
    </div>
  )
}
