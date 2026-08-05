'use client'

import { useOpenContactModal } from '@/components/layout/ContactModal'
import { HeadsetIcon } from '@/components/legal/icons'

/**
 * "Still need help?" primary action. The reference shows a "Chat with
 * Support" button, but there is no live-chat integration on this site — so
 * this opens the site-wide contact modal (a real, monitored channel) and is
 * labelled for what it actually does rather than promising live chat.
 */
export function ContactSupportButton() {
  const openContactModal = useOpenContactModal()

  return (
    <button type="button" className="doc-btn doc-btn-primary" onClick={openContactModal}>
      Message Support
      <HeadsetIcon />
    </button>
  )
}
