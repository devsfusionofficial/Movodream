'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setError('')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const result = await response.json()

      if (!response.ok || !result.success) {
        setError(result.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')
      setEmail('')
    } catch {
      setError('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <p className="footer-newsletter-success">You&apos;re subscribed — thanks for joining!</p>
  }

  return (
    <form className="footer-newsletter" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="footer-newsletter-input"
      />
      <button type="submit" className="footer-newsletter-submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
      </button>
      {error && <div className="footer-newsletter-error">{error}</div>}
    </form>
  )
}
