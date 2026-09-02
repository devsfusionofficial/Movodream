import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { listSubscribers } from '@/actions/subscribers'
import { requirePagePermission } from '@/lib/auth-guard'
import { MarketingCompose } from '../marketing-compose'

export const maxDuration = 60

export default async function MarketingComposePage() {
  await requirePagePermission('subscribers', ['send'])
  const subscribers = await listSubscribers()
  const activeCount = subscribers.filter((subscriber) => subscriber.status === 'active').length
  return (
    <div className="admin-resource-page mx-auto max-w-[1440px] space-y-4 outline-none">
      <Link
        href="/admin/marketing-subscribers"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#887f8e] transition-colors hover:text-[#d71789]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to subscribers
      </Link>
      <MarketingCompose activeCount={activeCount} />
    </div>
  )
}
