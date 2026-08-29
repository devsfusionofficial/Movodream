import Link from 'next/link'
import { ArrowLeft, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type AdminFormPageProps = {
  backHref: string
  backLabel: string
  title: string
  description: string
  eyebrow: string
  icon: LucideIcon
  children: ReactNode
}

export function AdminFormPage({ backHref, backLabel, title, description, eyebrow, icon: Icon, children }: AdminFormPageProps) {
  return (
    <div className="admin-resource-page mx-auto max-w-[1280px] w-full space-y-4 pb-6 outline-none min-w-0">
      <Link href={backHref} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#887f8e] transition-colors hover:text-[#d71789]">
        <ArrowLeft className="h-3.5 w-3.5" />
        {backLabel}
      </Link>
      <header className="flex flex-col gap-4 border-b border-[#eee9f0] pb-4 sm:flex-row sm:items-end sm:justify-between min-w-0">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fce8f2] text-[#d71789]">
            <Icon className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d71789]">{eyebrow}</p>
            <h1 className="text-2xl font-semibold tracking-[-0.05em] text-[#21182a] sm:text-3xl break-words [overflow-wrap:anywhere]">{title}</h1>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-[#887f8e] break-words">{description}</p>
          </div>
        </div>
        <span className="w-fit rounded-full border border-[#eadfe8] bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#887f8e] shrink-0">
          Secure workspace
        </span>
      </header>
      <div className="rounded-2xl border border-[#ebe6ee] bg-white p-5 sm:p-6 shadow-[0_5px_18px_rgba(34,20,40,0.025)] min-w-0">
        {children}
      </div>
    </div>
  )
}
