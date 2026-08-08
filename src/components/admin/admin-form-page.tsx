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
    <div className="admin-resource-page w-full space-y-7 pb-10 outline-none">
      <Link href={backHref} className="inline-flex items-center gap-2 text-sm font-medium text-[#887f8e] transition-colors hover:text-[#b40d6d]">
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>
      <header className="flex flex-col gap-5 border-b border-[#eee9f0] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fce8f2] text-[#e20b87]">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#c20c73]">{eyebrow}</p>
            <h1 className="text-3xl font-semibold tracking-[-0.05em] text-[#21182a]">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#887f8e]">{description}</p>
          </div>
        </div>
        <span className="w-fit rounded-full border border-[#eadfe8] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#887f8e]">Secure workspace</span>
      </header>
      {children}
    </div>
  )
}
