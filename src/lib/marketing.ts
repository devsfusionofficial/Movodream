export type CampaignBlock =
  | { id: string; type: 'text'; value: string }
  | { id: string; type: 'image'; url: string; alt: string }
  | { id: string; type: 'video'; url: string; title: string }
  | { id: string; type: 'button'; label: string; url: string }
  | { id: string; type: 'divider' }

export function escapeMarketingHtml(value: string) {
  return value.replace(/[&<>\"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character)
}

export function renderCampaignEmail(blocks: CampaignBlock[]) {
  return blocks.map((block) => {
    if (block.type === 'text') return `<p style="font:16px/1.7 Arial,sans-serif;color:#33283a;white-space:pre-line">${escapeMarketingHtml(block.value).replace(/\r?\n/g, '<br>')}</p>`
    if (block.type === 'image') return `<p><img src="${escapeMarketingHtml(block.url)}" alt="${escapeMarketingHtml(block.alt)}" style="display:block;width:100%;max-width:640px;height:auto;border-radius:12px" /></p>`
    if (block.type === 'video') return `<p style="padding:22px;border-radius:12px;background:#2b123d;text-align:center"><a href="${escapeMarketingHtml(block.url)}" style="color:#fff;font:bold 16px Arial,sans-serif;text-decoration:none">▶ ${escapeMarketingHtml(block.title || 'Watch the video')}</a></p>`
    if (block.type === 'button') return `<p style="text-align:center"><a href="${escapeMarketingHtml(block.url)}" style="display:inline-block;padding:13px 22px;border-radius:8px;background:#2b123d;color:#fff;font:bold 14px Arial,sans-serif;text-decoration:none">${escapeMarketingHtml(block.label)}</a></p>`
    return '<hr style="border:0;border-top:1px solid #eadfe8;margin:26px 0" />'
  }).join('')
}

export function campaignToPlainText(blocks: CampaignBlock[]) {
  return blocks.map((block) => {
    if (block.type === 'text') return block.value
    if (block.type === 'image') return `[Image: ${block.alt || 'campaign image'}] ${block.url}`
    if (block.type === 'video') return `[Video: ${block.title || 'Watch the video'}] ${block.url}`
    if (block.type === 'button') return `${block.label}: ${block.url}`
    return '--------------------'
  }).join('\n\n')
}
