'use client'

import { useState } from 'react'

export function ApplicationForm({ jobId }: { jobId: string }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setError('')

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch(`/api/careers/${jobId}/apply`, {
        method: 'POST',
        body: formData,
      })
      const result = await response.json()

      if (!response.ok || !result.success) {
        setError(result.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')
      e.currentTarget.reset()
    } catch {
      setError('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="blog-empty">Application received — thank you! Our team will be in touch.</div>
    )
  }

  return (
    <form className="job-apply-form" onSubmit={handleSubmit}>
      <div className="qzv-field">
        <label className="qzv-fieldlabel" htmlFor="name">
          Full Name
        </label>
        <input className="qzv-input" id="name" name="name" type="text" required />
      </div>

      <div className="qzv-field">
        <label className="qzv-fieldlabel" htmlFor="email">
          Email
        </label>
        <input className="qzv-input" id="email" name="email" type="email" required />
      </div>

      <div className="qzv-field">
        <label className="qzv-fieldlabel" htmlFor="phone">
          Phone
        </label>
        <input className="qzv-input" id="phone" name="phone" type="tel" required />
      </div>

      <div className="qzv-field">
        <label className="qzv-fieldlabel" htmlFor="location">
          Location
        </label>
        <input className="qzv-input" id="location" name="location" type="text" />
      </div>

      <div className="qzv-field">
        <label className="qzv-fieldlabel" htmlFor="experience">
          Experience
        </label>
        <input className="qzv-input" id="experience" name="experience" type="text" placeholder="e.g. 3 years" />
      </div>

      <div className="qzv-field">
        <label className="qzv-fieldlabel" htmlFor="qualification">
          Qualification
        </label>
        <input className="qzv-input" id="qualification" name="qualification" type="text" />
      </div>

      <div className="qzv-field">
        <label className="qzv-fieldlabel" htmlFor="coverLetter">
          Cover Letter
        </label>
        <textarea className="qzv-textarea" id="coverLetter" name="coverLetter" rows={4} />
      </div>

      <div className="qzv-field">
        <label className="qzv-fieldlabel" htmlFor="resume">
          Resume (PDF, DOC, or DOCX — max 5MB)
        </label>
        <input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx" required />
      </div>

      {error && <div className="qzv-error-msg">{error}</div>}

      <button type="submit" className="qzv-submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Submitting…' : 'Submit Application'}
      </button>
    </form>
  )
}
