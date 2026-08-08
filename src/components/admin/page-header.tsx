type PageHeaderProps = {
  title: string
  description?: string
  count?: number
}

export function PageHeader({ title, description, count }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-[#eee9f0] pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.045em] text-[#21182a]">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-[#887f8e]">{description}</p>}
      </div>
      {typeof count === 'number' && <span className="w-fit rounded-full bg-[#fce8f2] px-3 py-1 text-xs font-semibold text-[#b40d6d]">{count} total</span>}
    </div>
  )
}
