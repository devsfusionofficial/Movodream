'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Mail,
  Send,
  Check,
  CircleAlert,
  Gift,
  Star,
  Heart,
  Sparkles,
  Layout,
  Info,
  Eye,
  Globe,
  Loader2,
  Image as ImageIcon,
  MessageSquare,
  User,
  Phone,
  Calendar,
} from 'lucide-react'
import { toast } from 'sonner'
import { replyToContactSubmission } from '@/actions/contacts'
import { FileUpload } from '@/components/admin/file-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatAdminDate } from '@/lib/date-format'

const templates = {
  custom: {
    label: 'Custom Reply',
    heading: '',
    message: '',
  },
  consultation: {
    label: 'Travel Consultation',
    heading: 'Your Personal Travel Consultation with Movodream',
    message:
      'Thank you for reaching out to Movodream! Our travel concierge team has reviewed your enquiry and we would love to help you plan an unforgettable journey.\n\nWhether you are looking for hidden gems, custom itineraries, or seamless reservations, we are here to tailor every detail to your preferences.',
  },
  information: {
    label: 'Information & Details',
    heading: 'Information Regarding Your Movodream Enquiry',
    message:
      'Thank you for contacting us. We are pleased to provide you with the information you requested regarding our AI travel companion and services.\n\nPlease find the details outlined below, and feel free to let us know if you need any additional assistance.',
  },
  follow_up: {
    label: 'Quick Follow-Up',
    heading: 'Following Up on Your Movodream Request',
    message:
      'We wanted to quickly follow up with you regarding your recent enquiry with Movodream. Please let us know if you have any questions or if you would like to schedule a quick call with our concierge team.',
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

export function ContactCompose({
  id,
  name,
  email,
  phone,
  originalMessage,
  createdAt,
}: {
  id: string
  name?: string
  email: string
  phone?: string
  originalMessage?: string
  createdAt?: string
}) {
  const router = useRouter()
  const [template, setTemplate] = useState('custom')
  const [subject, setSubject] = useState(`Re: Your Movodream Enquiry${name ? ` - ${name}` : ''}`)
  const [preheader, setPreheader] = useState('Our concierge team has reviewed your enquiry...')
  const [icon, setIcon] = useState('mail')
  const [theme, setTheme] = useState<keyof typeof themes>('magenta')
  const [heading, setHeading] = useState('Thank you for contacting Movodream')
  const [message, setMessage] = useState(
    `Hi ${name || 'there'},\n\nThank you for reaching out to Movodream. We have reviewed your request and are happy to assist you!`
  )
  const [imageUrl, setImageUrl] = useState('')
  const [ctaText, setCtaText] = useState('Explore Movodream')
  const [ctaUrl, setCtaUrl] = useState('https://movodream.com')
  const [infoBoxTitle, setInfoBoxTitle] = useState('')
  const [infoBoxContent, setInfoBoxContent] = useState('')
  const [isPending, startTransition] = useTransition()

  function applyTemplate(key: string) {
    setTemplate(key)
    const t = templates[key as keyof typeof templates]
    if (t) {
      if (t.heading) setHeading(t.heading)
      if (t.message) {
        setMessage(`Hi ${name || 'there'},\n\n${t.message}`)
      }
    }
  }

  function handleSendReply(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!email) {
      toast.error('No recipient email available.')
      return
    }
    if (!subject.trim()) {
      toast.error('Please enter an email subject line.')
      return
    }
    if (!message.trim()) {
      toast.error('Please enter the message body.')
      return
    }

    startTransition(async () => {
      const res = await replyToContactSubmission({
        to: email,
        recipientName: name,
        subject: subject.trim(),
        message: message.trim(),
        heading: heading.trim(),
        preheader: preheader.trim(),
        icon,
        theme,
        imageUrl: imageUrl.trim(),
        ctaText: ctaText.trim(),
        ctaUrl: ctaUrl.trim(),
        infoBoxTitle: infoBoxTitle.trim(),
        infoBoxContent: infoBoxContent.trim(),
      })

      if (!res.success) {
        toast.error(res.error || 'Failed to send reply email')
      } else {
        toast.success(`Reply successfully dispatched from support@movodream.com to ${email}!`)
        router.push('/admin/contacts')
      }
    })
  }

  const PreviewIcon = iconMap[icon] ?? Mail
  const selectedThemeHex = themes[theme]

  return (
    <div className="space-y-4">
      {/* Top Header Bar */}
      <div className="flex flex-col gap-3 border-b border-[#eee9f0] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#21182a] sm:text-3xl">
            Reply to Enquiry — {name || email}
          </h1>
          <p className="mt-0.5 text-xs text-[#857c8b]">
            Sending official response to <strong className="text-[#21182a]">{email}</strong> directly from{' '}
            <strong className="text-[#d71789]">support@movodream.com</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            render={<Link href="/admin/contacts" />}
            className="border-[#e6e1e9] text-xs font-semibold text-[#21182a] hover:bg-[#f8f3f8]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => handleSendReply()}
            disabled={isPending || !message.trim()}
            className="gap-2 bg-gradient-to-r from-[#d71789] to-[#ff7294] px-5 text-xs font-semibold text-white shadow-[0_6px_20px_rgba(215,23,137,0.25)] hover:opacity-95 border-0 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Sending Reply...
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                Send Reply via support@movodream.com
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 2-Column Studio Layout */}
      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* LEFT COLUMN: Composition Form (7 cols) */}
        <div className="space-y-4 lg:col-span-7">
          
          {/* Recipient & Original Inquiry Card */}
          <section className="rounded-2xl border border-[#ebe6ee] bg-white p-4 sm:p-5 shadow-[0_5px_18px_rgba(34,20,40,0.025)] space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#f0edf1] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#fce8f2] text-[#d71789]">
                  <User className="h-3.5 w-3.5" />
                </span>
                <h2 className="text-sm font-bold text-[#21182a]">Recipient & Inquiry Details</h2>
              </div>
              <span className="rounded-full bg-[#fdf2f8] px-2.5 py-0.5 text-[11px] font-mono text-[#d71789] border border-[#fbcfe8]">
                From: support@movodream.com
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#887f8e] block mb-1">Customer Name</label>
                <Input
                  value={name || '—'}
                  disabled
                  className="h-9 rounded-xl border-[#ebe6ee] bg-[#faf8fb] text-xs font-medium text-[#21182a]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#887f8e] block mb-1">Customer Email</label>
                <Input
                  value={email || '—'}
                  disabled
                  className="h-9 rounded-xl border-[#ebe6ee] bg-[#faf8fb] text-xs font-medium text-[#21182a]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#887f8e] block mb-1">Customer Phone</label>
                <Input
                  value={phone || '—'}
                  disabled
                  className="h-9 rounded-xl border-[#ebe6ee] bg-[#faf8fb] text-xs font-medium text-[#21182a]"
                />
              </div>
            </div>

            {originalMessage && (
              <div className="rounded-xl border border-[#f3ebf5] bg-[#faf8fb] p-3.5 text-xs">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#857c8b]">
                    <MessageSquare className="h-3.5 w-3.5 text-[#d71789]" />
                    Customer’s Original Message:
                  </span>
                  {createdAt && (
                    <span className="text-[10px] text-[#a098a7]">
                      Received {formatAdminDate(createdAt)}
                    </span>
                  )}
                </div>
                <div className="rounded-lg bg-white p-3 border border-[#ebe6ee] text-[#2b2032] leading-relaxed whitespace-pre-wrap select-text shadow-xs">
                  {originalMessage}
                </div>
              </div>
            )}
          </section>

          {/* Quick Templates & Subject Card */}
          <section className="rounded-2xl border border-[#ebe6ee] bg-white p-4 sm:p-5 space-y-3.5 shadow-[0_5px_18px_rgba(34,20,40,0.025)]">
            <div className="flex items-center gap-2 border-b border-[#f0edf1] pb-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#fce8f2] text-[#d71789]">
                <Layout className="h-3.5 w-3.5" />
              </span>
              <h2 className="text-sm font-bold text-[#21182a]">Quick Response Templates</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {Object.entries(templates).map(([key, t]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => applyTemplate(key)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    template === key
                      ? 'border border-[#d71789] bg-[#fce8f2] text-[#d71789] shadow-xs'
                      : 'border border-[#dedede] bg-white text-[#687075] hover:bg-[#faf8fb]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#21182a]">
                  Subject Line <span className="text-red-500">*</span>
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Re: Your Movodream Enquiry"
                  className="h-10 rounded-xl text-xs focus:border-[#d71789]"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#21182a]">
                  Preheader Snippet (Inbox preview snippet)
                </label>
                <Input
                  value={preheader}
                  onChange={(e) => setPreheader(e.target.value)}
                  placeholder="e.g. Our travel concierge team has reviewed your request..."
                  className="h-9 rounded-xl text-xs"
                />
              </div>
            </div>
          </section>

          {/* Body & Styling Card */}
          <section className="rounded-2xl border border-[#ebe6ee] bg-white p-4 sm:p-5 space-y-3.5 shadow-[0_5px_18px_rgba(34,20,40,0.025)]">
            <div className="flex items-center gap-2 border-b border-[#f0edf1] pb-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#fce8f2] text-[#d71789]">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <h2 className="text-sm font-bold text-[#21182a]">Email Body & Visual Styling</h2>
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
                        className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all cursor-pointer ${
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
                <label className="mb-1.5 block text-xs font-semibold text-[#21182a]">Color Palette</label>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(themes).map(([key, hex]) => (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setTheme(key as keyof typeof themes)}
                      className={`flex h-8 items-center gap-1.5 rounded-xl border px-2.5 text-xs font-semibold capitalize transition-all cursor-pointer ${
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
                placeholder="e.g. Here is what we prepared for you"
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#21182a]">
                Reply Message Body <span className="text-red-500">*</span>
              </label>
              <Textarea
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your email reply here..."
                className="rounded-xl text-xs leading-relaxed focus:border-[#d71789]"
                required
              />
            </div>

            {/* Optional Promotional / Itinerary Banner Image */}
            <div className="rounded-xl border border-dashed border-[#e6e1e9] bg-[#faf8fb] p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#21182a] flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-[#d71789]" />
                  Featured Banner Image (Optional)
                </span>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="text-[11px] font-semibold text-[#b42318] hover:underline cursor-pointer"
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
                  onUploaded={({ url }) => setImageUrl(url)}
                />
              </div>
            </div>

            {/* Optional Call-to-Action (CTA) Button */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#21182a]">
                  CTA Button Text (Optional)
                </label>
                <Input
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. View Custom Itinerary"
                  className="h-9 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#21182a]">CTA Button Link URL</label>
                <Input
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  placeholder="https://movodream.com"
                  className="h-9 rounded-xl text-xs"
                />
              </div>
            </div>
          </section>

          {/* Optional Callout Box Card */}
          <section className="rounded-2xl border border-[#ebe6ee] bg-white p-4 sm:p-5 space-y-3 shadow-[0_5px_18px_rgba(34,20,40,0.025)]">
            <div className="flex items-center justify-between border-b border-[#f0edf1] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#fce8f2] text-[#d71789]">
                  <Info className="h-3.5 w-3.5" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-[#21182a]">Custom Callout Box (Optional)</h2>
                  <p className="text-[11px] text-[#887f8e]">Only shows in the email if you enter a title. Leave blank if not needed.</p>
                </div>
              </div>
              {infoBoxTitle && (
                <button
                  type="button"
                  onClick={() => {
                    setInfoBoxTitle('')
                    setInfoBoxContent('')
                  }}
                  className="text-[11px] font-semibold text-[#b42318] hover:underline cursor-pointer"
                >
                  Clear Box
                </button>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#21182a]">Callout Title</label>
                <Input
                  value={infoBoxTitle}
                  onChange={(e) => setInfoBoxTitle(e.target.value)}
                  placeholder="e.g. Special Note or Discount"
                  className="h-9 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#21182a]">Callout Content</label>
                <Input
                  value={infoBoxContent}
                  onChange={(e) => setInfoBoxContent(e.target.value)}
                  placeholder="Content to highlight..."
                  className="h-9 rounded-xl text-xs"
                />
              </div>
            </div>
          </section>

          {/* Bottom Send Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              render={<Link href="/admin/contacts" />}
              disabled={isPending}
              className="border-[#e6e1e9] text-xs font-semibold text-[#21182a] hover:bg-[#f8f3f8]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => handleSendReply()}
              disabled={isPending || !message.trim()}
              className="gap-2 bg-gradient-to-r from-[#d71789] to-[#ff7294] px-6 text-xs font-semibold text-white shadow-[0_6px_20px_rgba(215,23,137,0.25)] hover:opacity-95 border-0 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Reply...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Reply via support@movodream.com
                </>
              )}
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Inbox Preview (5 cols - Sticky) */}
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
            {/* Top Inbox Bar */}
            <div className="border-b border-[#ebe6ee] bg-[#faf8fb] p-3 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#21182a] truncate max-w-[220px]" title={subject}>
                  Subject: {subject || 'Re: Movodream Enquiry'}
                </span>
                <span className="text-[10px] text-[#887f8e] font-mono shrink-0">To: {email}</span>
              </div>
              {preheader && (
                <p className="text-[11px] text-[#857c8b] truncate italic">
                  Snippet: {preheader}
                </p>
              )}
            </div>

            {/* Email Body Card */}
            <div className="p-4 sm:p-5">
              <div className="overflow-hidden rounded-xl border border-[#ebe6ee] bg-white shadow-xs">
                
                {/* Header Logo */}
                <div className="border-b border-[#f1f5f9] bg-white p-4 text-center">
                  <img
                    src="/assets/images/logo2.png"
                    alt="Movodream"
                    className="mx-auto h-7 w-auto object-contain"
                  />
                </div>

                {/* Theme Header Banner */}
                <div className="p-6 text-center" style={{ backgroundColor: `${selectedThemeHex}14` }}>
                  <div
                    className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-xs transition-all"
                    style={{ backgroundColor: selectedThemeHex }}
                  >
                    <PreviewIcon className="h-5 w-5" />
                  </div>

                  <h3 className="text-xl font-bold text-[#21182a] leading-tight">
                    {heading || 'Response to your Movodream Enquiry'}
                  </h3>

                  {name && (
                    <p className="mt-2 text-xs font-semibold text-[#374151]">
                      Hi {name},
                    </p>
                  )}
                </div>

                {/* Email Body Content */}
                <div className="p-5">
                  <p className="whitespace-pre-line text-xs leading-relaxed text-[#374151]">
                    {message || 'Your email reply message will appear here in real-time as you write content.'}
                  </p>

                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Banner"
                      className="mt-4 max-h-48 w-full rounded-xl object-cover shadow-xs border border-white"
                    />
                  )}

                  {ctaText && (
                    <div className="mt-5 text-center">
                      <span
                        className="inline-block rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-xs"
                        style={{ backgroundColor: selectedThemeHex }}
                      >
                        {ctaText}
                      </span>
                    </div>
                  )}

                  {infoBoxTitle && (
                    <div
                      className="mt-4 rounded-xl border-l-4 p-3 text-xs"
                      style={{ borderColor: selectedThemeHex, backgroundColor: `${selectedThemeHex}08` }}
                    >
                      <p className="font-bold text-[#21182a]">{infoBoxTitle}</p>
                      <p className="mt-0.5 whitespace-pre-line text-[11px] text-[#687075]">{infoBoxContent}</p>
                    </div>
                  )}

                  <div className="mt-6 border-t border-[#f0edf1] pt-4 text-xs text-[#6b7280]">
                    <p>Warm regards,</p>
                    <p className="font-bold text-[#111827]">Team Movodream</p>
                  </div>
                </div>

                {/* Company Footer Lockup */}
                <div className="bg-[#0b1320] p-5 text-center text-white">
                  <h4 className="text-sm font-extrabold tracking-wider text-white">MOVODREAM</h4>
                  <p className="mt-0.5 text-[10px] text-[#b8afc2]">AI Travel Companion for Modern Explorers</p>

                  <div className="my-3 flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#ff7294] font-semibold">
                    <a href="https://movodream.com/about" target="_blank" rel="noreferrer" className="hover:underline">About</a>
                    <span>•</span>
                    <a href="https://movodream.com/support" target="_blank" rel="noreferrer" className="hover:underline">Support</a>
                    <span>•</span>
                    <a href="https://movodream.com/privacy-policy" target="_blank" rel="noreferrer" className="hover:underline">Privacy</a>
                    <span>•</span>
                    <a href="https://movodream.com/terms" target="_blank" rel="noreferrer" className="hover:underline">Terms</a>
                  </div>

                  <div className="mb-3 flex items-center justify-center gap-2.5">
                    {['x', 'instagram', 'linkedin', 'facebook', 'youtube'].map((s) => (
                      <span
                        key={s}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10"
                      >
                        <img
                          src={`/assets/icons/social/${s}.png`}
                          alt={s}
                          className="h-3.5 w-3.5 object-contain"
                        />
                      </span>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-3 text-[10px] text-[#9c91a5] leading-relaxed">
                    <p>Support: support@movodream.com • Official Customer Response</p>
                    <p className="mt-0.5">© {new Date().getFullYear()} Movodream. All rights reserved.</p>
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
