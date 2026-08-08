'use client'

import { useState, useTransition } from 'react'
import { ImagePlus, Link2, Mail, Minus, Play, Plus, Send, Type, Users } from 'lucide-react'
import { toast } from 'sonner'
import { sendSubscriberCampaign } from '@/actions/subscribers'
import type { CampaignBlock } from '@/lib/marketing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FileUpload } from '@/components/admin/file-upload'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const blockButtons = [
  { type: 'text', label: 'Text', icon: Type },
  { type: 'image', label: 'Photo', icon: ImagePlus },
  { type: 'video', label: 'Video', icon: Play },
  { type: 'button', label: 'CTA button', icon: Link2 },
  { type: 'divider', label: 'Divider', icon: Minus },
] as const

function newBlock(type: CampaignBlock['type']): CampaignBlock {
  const id = crypto.randomUUID()
  if (type === 'text') return { id, type, value: '' }
  if (type === 'image') return { id, type, url: '', alt: '' }
  if (type === 'video') return { id, type, url: '', title: 'Watch the video' }
  if (type === 'button') return { id, type, label: 'Learn more', url: '' }
  return { id, type }
}

export function CampaignComposer({ activeCount }: { activeCount: number }) {
  const [open, setOpen] = useState(false)
  const [subject, setSubject] = useState('')
  const [blocks, setBlocks] = useState<CampaignBlock[]>([{ id: 'first-text', type: 'text', value: '' }])
  const [isPending, startTransition] = useTransition()

  function updateBlock(id: string, patch: Partial<CampaignBlock>) {
    setBlocks((current) => current.map((block) => block.id === id ? { ...block, ...patch } as CampaignBlock : block))
  }

  function submit() {
    if (!subject.trim()) { toast.error('Add a subject before sending.'); return }
    if (!blocks.some((block) => block.type === 'text' && block.value.trim() || block.type !== 'text')) { toast.error('Add content before sending.'); return }
    if (!window.confirm(`Send this campaign to ${activeCount} active subscriber${activeCount === 1 ? '' : 's'}?`)) return
    startTransition(async () => {
      const result = await sendSubscriberCampaign({ subject, blocks })
      if (!result.success) { toast.error(result.error); return }
      toast.success(`Campaign sent to ${result.count} subscriber${result.count === 1 ? '' : 's'}.`)
      setSubject(''); setBlocks([{ id: crypto.randomUUID(), type: 'text', value: '' }]); setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2 bg-[#2b123d] text-white shadow-[0_10px_24px_rgba(43,18,61,0.16)] hover:bg-[#3c1d51]" />}><Mail className="h-4 w-4" />Create campaign</DialogTrigger>
      <DialogContent className="h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-h-none max-w-none overflow-x-hidden overflow-y-auto rounded-2xl border-0 p-0 shadow-2xl sm:max-w-none lg:left-[288px] lg:top-4 lg:w-[calc(100vw-304px)] lg:translate-x-0 lg:translate-y-0">
        <DialogHeader className="border-b border-[#eee8f0] bg-[#fcfafc] p-6 pr-12"><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fce8f2] text-[#d71789]"><Send className="h-5 w-5" /></div><DialogTitle className="text-xl font-semibold tracking-[-0.03em] text-[#21182a]">Build a subscriber campaign</DialogTitle><DialogDescription className="mt-1">Compose a flexible email with content blocks, images, video links, and calls to action.</DialogDescription></DialogHeader>
        <div className="grid min-w-0 grid-cols-1 gap-6 p-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
          <div className="min-w-0 space-y-5"><label className="block space-y-2 text-sm font-semibold text-[#33283a]" htmlFor="campaign-subject">Subject<Input id="campaign-subject" value={subject} onChange={(event) => setSubject(event.target.value)} maxLength={120} placeholder="A thoughtful update for your audience" /></label><div className="min-w-0 rounded-xl border border-[#eadfe8] bg-[#fcfafc] p-3"><div className="mb-3 flex flex-wrap items-center gap-2"><span className="mr-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#887f8e]">Add block</span>{blockButtons.map(({ type, label, icon: Icon }) => <Button key={type} type="button" variant="outline" size="sm" className="gap-1.5 bg-white" onClick={() => setBlocks((current) => [...current, newBlock(type)])}><Icon className="h-3.5 w-3.5 text-[#d71789]" />{label}</Button>)}</div><div className="min-w-0 space-y-3">{blocks.map((block, index) => <BlockEditor key={block.id} block={block} index={index} update={updateBlock} remove={() => setBlocks((current) => current.filter((item) => item.id !== block.id))} />)}</div></div></div>
          <div className="min-w-0 rounded-2xl border border-[#eadfe8] bg-[#fcfafc] p-4"><div className="mb-4 flex items-center justify-between"><div><p className="text-sm font-semibold text-[#33283a]">Email preview</p><p className="text-xs text-[#998d9c]">Approximate inbox appearance</p></div><div className="flex items-center gap-1 text-xs text-[#887f8e]"><Users className="h-3.5 w-3.5" />{activeCount}</div></div><div className="min-w-0 overflow-hidden rounded-xl bg-white p-4 shadow-sm"><p className="break-words border-b border-[#f0e9f0] pb-3 text-sm font-bold text-[#21182a]">{subject || 'Your campaign subject'}</p><div className="min-w-0 space-y-3 pt-3">{blocks.map((block) => <PreviewBlock key={block.id} block={block} />)}</div></div><p className="mt-3 text-xs leading-5 text-[#998d9c]">Videos are sent as clickable blocks because inboxes generally do not support embedded playback.</p></div>
        </div>
        <DialogFooter className="border-[#eee8f0] bg-white p-4"><Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>Cancel</Button><Button onClick={submit} disabled={isPending || activeCount === 0} className="gap-2 bg-[#2b123d] text-white hover:bg-[#3c1d51]">{isPending ? 'Sending...' : 'Send campaign'}<Send className="h-4 w-4" /></Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function BlockEditor({ block, index, update, remove }: { block: CampaignBlock; index: number; update: (id: string, patch: Partial<CampaignBlock>) => void; remove: () => void }) {
  return <div className="rounded-lg border border-[#e8dfe8] bg-white p-3"><div className="mb-2 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.12em] text-[#a18f9f]">{index + 1}. {block.type}</span>{block.type !== 'text' || index > 0 ? <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-[#b42318]" onClick={remove}>Remove</Button> : null}</div>{block.type === 'text' && <Textarea rows={4} value={block.value} onChange={(event) => update(block.id, { value: event.target.value })} placeholder="Write your update..." />}{block.type === 'image' && <div className="space-y-2"><FileUpload accept="image/*" label={block.url ? 'Replace photo' : 'Upload photo'} onUploaded={({ url }) => update(block.id, { url })} />{block.url && <img src={block.url} alt="Uploaded campaign" className="max-h-36 rounded-lg object-cover" />}<Input value={block.alt} onChange={(event) => update(block.id, { alt: event.target.value })} placeholder="Accessible image description" /></div>}{block.type === 'video' && <div className="space-y-2"><div className="flex flex-wrap items-center gap-2"><FileUpload accept="video/*" label={block.url ? 'Replace video' : 'Upload video'} onUploaded={({ url }) => update(block.id, { url })} /><span className="text-xs text-[#998d9c]">or paste a hosted video URL below</span></div><Input value={block.url} onChange={(event) => update(block.id, { url: event.target.value })} placeholder="https://youtube.com/watch?v=..." /><Input value={block.title} onChange={(event) => update(block.id, { title: event.target.value })} placeholder="Video title" /></div>}{block.type === 'button' && <div className="grid gap-2 sm:grid-cols-2"><Input value={block.label} onChange={(event) => update(block.id, { label: event.target.value })} placeholder="Button label" /><Input value={block.url} onChange={(event) => update(block.id, { url: event.target.value })} placeholder="https://movodream.com/..." /></div>}{block.type === 'divider' && <div className="h-px bg-[#eadfe8]" />}</div>
}

function PreviewBlock({ block }: { block: CampaignBlock }) {
  if (block.type === 'text') return <p className="whitespace-pre-line text-sm leading-6 text-[#665b6a]">{block.value || 'Your text content will appear here.'}</p>
  if (block.type === 'image') return block.url ? <img src={block.url} alt={block.alt} className="w-full rounded-lg" /> : <div className="flex h-20 items-center justify-center rounded-lg bg-[#fce8f2] text-xs text-[#a18f9f]">Photo block</div>
  if (block.type === 'video') return <div className="rounded-lg bg-[#2b123d] p-5 text-center text-sm font-semibold text-white">▶ {block.title || 'Watch the video'}</div>
  if (block.type === 'button') return <div className="text-center"><span className="inline-block rounded-lg bg-[#2b123d] px-4 py-2 text-xs font-semibold text-white">{block.label || 'Learn more'}</span></div>
  return <hr className="border-[#eadfe8]" />
}
