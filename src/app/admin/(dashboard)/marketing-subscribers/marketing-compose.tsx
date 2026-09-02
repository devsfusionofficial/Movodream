'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  Image as ImageIcon,
  Mail,
  Send,
  Upload,
  Check,
  CircleAlert,
  Gift,
  Star,
  Heart,
  Sparkles,
  Palette,
  Layout,
  Info,
  ExternalLink,
  Eye,
  Globe,
  Share2,
  Link2,
} from 'lucide-react'
import { toast } from 'sonner'
import { syncSubscriberEmail } from '@/actions/subscribers'
import { FileUpload } from '@/components/admin/file-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const templates = {
  custom: { label: 'Custom email', heading: '', description: '' },
  announcement: {
    label: 'Announcement',
    heading: 'Something worth sharing',
    description: 'Keep your audience in the loop with a clear, thoughtful update.',
  },
  offer: {
    label: 'Special offer',
    heading: 'A special offer for you',
    description: 'Give your subscribers a reason to come back and explore.',
  },
}

const icons = ['mail', 'check', 'alert', 'gift', 'star', 'heart', 'sparkles']

const iconMap: Record<string, React.ElementType> = {
  mail: Mail,
  check: Check,
  alert: CircleAlert,
  gift: Gift,
  star: Star,
  heart: Heart,
  sparkles: Sparkles,
}

const themes = {
  magenta: '#d71789',
  pink: '#ff7294',
  purple: '#6c4bd8',
  dark: '#2b123d',
}

export function MarketingCompose({ activeCount }: { activeCount: number }) {
  const [template, setTemplate] = useState('custom')
  const [subject, setSubject] = useState('')
  const [preheader, setPreheader] = useState('')
  const [icon, setIcon] = useState('mail')
  const [theme, setTheme] = useState<keyof typeof themes>('magenta')
  const [heading, setHeading] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageKey, setImageKey] = useState('')
  const [ctaText, setCtaText] = useState('')
  const [ctaUrl, setCtaUrl] = useState('')
  const [infoBoxTitle, setInfoBoxTitle] = useState('')
  const [infoBoxContent, setInfoBoxContent] = useState('')
  const [isPending, startTransition] = useTransition()

  function applyTemplate(value: string) {
    setTemplate(value)
    const selected = templates[value as keyof typeof templates]
    if (selected) {
      setHeading(selected.heading)
      setDescription(selected.description)
    }
  }

  function handleSave() {
    startTransition(async () => {
      const result = await syncSubscriberEmail({
        subject,
        preheader,
        template,
        icon,
        theme,
        heading,
        description,
        imageUrl,
        imageKey,
        ctaText,
        ctaUrl,
        infoBoxTitle,
        infoBoxContent,
      })

      if (!result.success) {
        toast.error('error' in result && result.error ? (result as any).error : 'Failed to sync marketing email')
        return
      }

      if ('warning' in result && (result as any).warning) {
        toast.warning(String((result as any).warning), { duration: 6000 })
      } else {
        const countText = 'sentCount' in result && result.sentCount ? ` to ${result.sentCount} subscribers` : ''
        toast.success(`Marketing email saved and broadcast dispatched${countText}!`)
      }
    })
  }

  const PreviewIcon = iconMap[icon] ?? Mail

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col gap-3 border-b border-[#eee9f0] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#21182a] sm:text-3xl">Compose Marketing Email</h1>
          <p className="mt-0.5 text-xs text-[#857c8b]">
            Deliver campaign updates to <strong className="text-[#d71789]">{activeCount}</strong> active opted-in subscribers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            render={<Link href="/admin/marketing-subscribers" />}
            className="border-[#e6e1e9] text-xs font-semibold text-[#21182a] hover:bg-[#f8f3f8]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="gap-2 bg-gradient-to-r from-[#d71789] to-[#ff7294] px-5 text-xs font-semibold text-white shadow-[0_6px_20px_rgba(215,23,137,0.25)] hover:opacity-95 border-0"
          >
            <Send className="h-3.5 w-3.5" />
            {isPending ? 'Syncing...' : 'Sync & Send Email'}
          </Button>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* Form Inputs (Left Column - 7 cols) */}
        <div className="space-y-4 lg:col-span-7">
          {/* Metadata Card */}
          <section className="rounded-2xl border border-[#ebe6ee] bg-white p-4 sm:p-5 space-y-3.5 shadow-[0_5px_18px_rgba(34,20,40,0.025)]">
            <div className="flex items-center gap-2 border-b border-[#f0edf1] pb-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#fce8f2] text-[#d71789]">
                <Mail className="h-3.5 w-3.5" />
              </span>
              <h2 className="text-sm font-bold text-[#21182a]">Email Envelope & Metadata</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#21182a]">Select Template</label>
                <Select value={template} onValueChange={(val) => val && applyTemplate(val)}>
                  <SelectTrigger className="h-10 w-full rounded-xl border-[#dedede] bg-white text-xs text-[#21182a]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(templates).map(([key, val]) => (
                      <SelectItem key={key} value={key}>
                        {val.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#21182a]">Preheader Preview Text</label>
                <Input
                  value={preheader}
                  onChange={(e) => setPreheader(e.target.value)}
                  placeholder="e.g. Special perk inside..."
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#21182a]">Subject Line</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Exclusive Movodream update"
                className="h-10 rounded-xl text-xs"
              />
            </div>
          </section>

          {/* Content Card */}
          <section className="rounded-2xl border border-[#ebe6ee] bg-white p-4 sm:p-5 space-y-3.5 shadow-[0_5px_18px_rgba(34,20,40,0.025)]">
            <div className="flex items-center gap-2 border-b border-[#f0edf1] pb-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#fce8f2] text-[#d71789]">
                <Layout className="h-3.5 w-3.5" />
              </span>
              <h2 className="text-sm font-bold text-[#21182a]">Body & Styling</h2>
            </div>

            {/* Icon & Theme Selector */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#21182a]">Header Icon</label>
                <div className="flex flex-wrap gap-1.5">
                  {icons.map((item) => {
                    const IconComp = iconMap[item] ?? Mail
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => setIcon(item)}
                        title={item}
                        className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all ${
                          icon === item
                            ? 'border-[#d71789] bg-[#fce8f2] shadow-xs ring-2 ring-[#f7d4e5]'
                            : 'border-[#dedede] bg-white hover:bg-[#faf8fb]'
                        }`}
                      >
                        <IconComp className="h-4 w-4 text-[#d71789]" />
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#21182a]">Color Swatch</label>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(themes).map(([key, hex]) => (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setTheme(key as keyof typeof themes)}
                      className={`flex h-8 items-center gap-1.5 rounded-xl border px-2.5 text-xs font-semibold capitalize transition-all ${
                        theme === key
                          ? 'border-[#d71789] bg-[#fce8f2] text-[#d71789] shadow-xs'
                          : 'border-[#dedede] bg-white text-[#687075] hover:bg-[#faf8fb]'
                      }`}
                    >
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: hex }} />
                      {key}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#21182a]">Main Heading</label>
              <Input
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="e.g. Limited-time travel offer"
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#21182a]">Main Body Description</label>
              <Textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write your email body content here..."
                className="rounded-xl text-xs leading-relaxed"
              />
            </div>

            {/* Promotional Banner Upload */}
            <div className="rounded-xl border border-dashed border-[#e6e1e9] bg-[#faf8fb] p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#21182a] flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-[#d71789]" />
                  Promotional Banner Image (Optional)
                </span>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('')
                      setImageKey('')
                    }}
                    className="text-[11px] font-semibold text-[#b42318] hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                  className="h-9 rounded-xl text-xs bg-white flex-1"
                />
                <FileUpload
                  label="Upload"
                  onUploaded={({ url, key }) => {
                    setImageUrl(url)
                    setImageKey(key)
                  }}
                />
              </div>
            </div>

            {/* CTA Button Settings */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#21182a]">CTA Button Text</label>
                <Input
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. Claim Your Offer"
                  className="h-10 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#21182a]">CTA Button URL</label>
                <Input
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  placeholder="https://movodream.com/offer"
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            </div>
          </section>

          {/* Info Box Card */}
          <section className="rounded-2xl border border-[#ebe6ee] bg-white p-4 sm:p-5 space-y-3 shadow-[0_5px_18px_rgba(34,20,40,0.025)]">
            <div className="flex items-center gap-2 border-b border-[#f0edf1] pb-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#fce8f2] text-[#d71789]">
                <Info className="h-3.5 w-3.5" />
              </span>
              <h2 className="text-sm font-bold text-[#21182a]">Bottom Callout Info Box</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#21182a]">Info Title</label>
                <Input
                  value={infoBoxTitle}
                  onChange={(e) => setInfoBoxTitle(e.target.value)}
                  placeholder="e.g. Terms & Conditions"
                  className="h-10 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#21182a]">Info Content</label>
                <Input
                  value={infoBoxContent}
                  onChange={(e) => setInfoBoxContent(e.target.value)}
                  placeholder="e.g. Offer valid until end of month."
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Live Email Client Preview (Right Column - 5 cols) */}
        <aside className="sticky top-6 space-y-3 lg:col-span-5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#887f8e] flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-[#d71789]" />
              Live Inbox Preview
            </span>
            <span className="rounded-full bg-[#fce8f2] px-2.5 py-0.5 text-[10px] font-bold text-[#d71789] border border-[#f7d4e5]">
              Real-Time Rendering
            </span>
          </div>

          {/* Email Client Mockup Frame */}
          <div className="overflow-hidden rounded-2xl border border-[#ebe6ee] bg-white shadow-[0_8px_30px_rgba(34,20,40,0.06)]">
            {/* Inbox Bar */}
            <div className="border-b border-[#ebe6ee] bg-[#faf8fb] p-3 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#21182a] truncate max-w-[220px]">
                  Subject: {subject || 'Exclusive offer for you'}
                </span>
                <span className="text-[10px] text-[#887f8e]">To: {activeCount} Users</span>
              </div>
              {preheader && (
                <p className="text-[11px] text-[#857c8b] truncate italic">
                  Snippet: {preheader}
                </p>
              )}
            </div>

            {/* Email Body Card Container */}
            <div className="p-4 sm:p-5">
              <div className="overflow-hidden rounded-xl border border-[#ebe6ee] bg-white shadow-xs">
                <div className="p-6 text-center" style={{ backgroundColor: `${themes[theme]}12` }}>
                  <div
                    className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-xs transition-all"
                    style={{ backgroundColor: themes[theme] }}
                  >
                    <PreviewIcon className="h-5 w-5" />
                  </div>

                  <h3 className="text-xl font-bold text-[#21182a]">
                    {heading || 'Choose a template or start typing'}
                  </h3>

                  <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-[#687075]">
                    {description || 'Your live email preview will appear here in real-time as you write content.'}
                  </p>

                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Promotional Banner"
                      className="mt-4 max-h-48 w-full rounded-xl object-cover shadow-xs border border-white"
                    />
                  )}

                  {ctaText && (
                    <span
                      className="mt-5 inline-block rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-xs cursor-pointer"
                      style={{ backgroundColor: themes[theme] }}
                    >
                      {ctaText}
                    </span>
                  )}
                </div>

                {infoBoxTitle && (
                  <div
                    className="m-4 rounded-xl border-l-4 p-3 text-xs"
                    style={{ borderColor: themes[theme], backgroundColor: `${themes[theme]}08` }}
                  >
                    <p className="font-bold text-[#21182a]">{infoBoxTitle}</p>
                    <p className="mt-0.5 whitespace-pre-line text-[11px] text-[#687075]">{infoBoxContent}</p>
                  </div>
                )}

                {/* Professional Company Footer Lockup */}
                <div className="bg-[#21182a] p-5 text-center text-white">
                  <h4 className="text-sm font-extrabold tracking-wider text-white">MOVODREAM</h4>
                  <p className="mt-0.5 text-[10px] text-[#b8afc2]">AI Travel Companion for Modern Explorers</p>

                  <div className="my-3 flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#ff7294] font-semibold">
                    <a href={`${(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')}/about`} target="_blank" rel="noreferrer" className="hover:underline">About Us</a>
                    <span>•</span>
                    <a href={`${(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')}/support`} target="_blank" rel="noreferrer" className="hover:underline">Support</a>
                    <span>•</span>
                    <a href={`${(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')}/privacy-policy`} target="_blank" rel="noreferrer" className="hover:underline">Privacy Policy</a>
                    <span>•</span>
                    <a href={`${(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')}/terms`} target="_blank" rel="noreferrer" className="hover:underline">Terms</a>
                  </div>

                  <div className="mb-3 flex items-center justify-center gap-2.5">
                    {/* Twitter / X */}
                    <a href="https://x.com/movodream" target="_blank" rel="noreferrer" title="Twitter / X" className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#ff7294] hover:text-white">
                      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    {/* Instagram */}
                    <a href="https://www.instagram.com/movodreamofficial/" target="_blank" rel="noreferrer" title="Instagram" className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#ff7294] hover:text-white">
                      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                    {/* LinkedIn */}
                    <a href="https://www.linkedin.com/company/movodream" target="_blank" rel="noreferrer" title="LinkedIn" className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#ff7294] hover:text-white">
                      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                    {/* Facebook */}
                    <a href="https://www.facebook.com/movodreamofficial/" target="_blank" rel="noreferrer" title="Facebook" className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#ff7294] hover:text-white">
                      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                    {/* YouTube */}
                    <a href="https://youtube.com/@movodream" target="_blank" rel="noreferrer" title="YouTube" className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#ff7294] hover:text-white">
                      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    </a>
                    {/* Website */}
                    <a href={(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')} target="_blank" rel="noreferrer" title="Website" className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#ff7294] hover:text-white">
                      <Globe className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  <div className="border-t border-white/10 pt-3 text-[10px] text-[#9c91a5] leading-relaxed">
                    <p>Support: support@movodream.com • New Delhi, India</p>
                    <p className="mt-0.5">© {new Date().getFullYear()} Movodream Technologies. All rights reserved.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
