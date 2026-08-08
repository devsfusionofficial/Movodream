import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { listSubscribers } from '@/actions/subscribers'
import { MarketingCompose } from '../marketing-compose'

export default async function MarketingComposePage() {
  const subscribers = await listSubscribers()
  const activeCount = subscribers.filter((subscriber) => subscriber.status === 'active').length
  return <div className="admin-resource-page space-y-5"><Link href="/admin/marketing-subscribers" className="inline-flex items-center gap-2 text-sm text-[#697176] hover:text-[#111]"><ArrowLeft className="h-4 w-4" />Back to subscribers</Link><MarketingCompose activeCount={activeCount} /></div>
}
