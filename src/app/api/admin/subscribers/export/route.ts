import { NextResponse } from 'next/server'
import { requirePermission } from '@/lib/auth-guard'
import { connectDB } from '@/lib/db'
import { Subscriber } from '@/models/Subscriber'

function csvEscape(value: string) {
  let safe = value
  // Mitigate CSV / formula injection (e.g. =, +, -, @)
  if (/^[=+\-@\t\r]/.test(safe)) {
    safe = `'${safe}`
  }
  return `"${safe.replace(/"/g, '""')}"`
}

export async function GET() {
  try {
    await requirePermission('subscribers', ['export'])
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: { 'Cache-Control': 'no-store' } })
  }

  await connectDB()
  const subscribers = await Subscriber.find()
    .select('email status subscribedAt createdAt')
    .sort({ createdAt: -1 })
    .lean()

  const rows = [
    ['Email', 'Status', 'Subscribed At'],
    ...subscribers.map((s) => [s.email, s.status, new Date(s.subscribedAt ?? s.createdAt).toISOString()]),
  ]
  const csv = rows.map((row) => row.map(csvEscape).join(',')).join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}
