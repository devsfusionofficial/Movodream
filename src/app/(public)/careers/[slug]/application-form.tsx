'use client'

import { useState } from 'react'

export function ApplicationForm({ jobId }: { jobId: string }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [fileName, setFileName] = useState('')

  const validate = (formData: FormData) => {
    const errors: Record<string, string> = {}

    const name = String(formData.get('name') ?? '').trim()
    if (!name || name.length < 2) {
      errors.name = 'Full Name is required (at least 2 characters)'
    } else if (!/^[a-zA-Z\s'.-]+$/.test(name)) {
      errors.name = 'Full Name can only contain letters and spaces'
    }

    const email = String(formData.get('email') ?? '').trim()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address (e.g. john@example.com)'
    }

    const phone = String(formData.get('phone') ?? '').trim()
    const digitsOnly = phone.replace(/\D/g, '')
    if (digitsOnly.length !== 10 && !(digitsOnly.length === 12 && digitsOnly.startsWith('91'))) {
      errors.phone = 'Phone number must be a valid 10-digit mobile number'
    }

    const resume = formData.get('resume')
    if (!(resume instanceof File) || resume.size === 0) {
      errors.resume = 'A resume file (PDF, DOC, DOCX) is required'
    } else if (resume.size > 5 * 1024 * 1024) {
      errors.resume = 'Resume file size must not exceed 5MB'
    }

    return errors
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const formData = new FormData(e.currentTarget)
    const errors = validate(formData)

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setStatus('submitting')

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
      setFileName('')
      e.currentTarget.reset()
    } catch {
      setError('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="app-success-card">
        <div className="success-icon">🎉</div>
        <h3>Application Received!</h3>
        <p>Thank you for applying. Our talent team will review your CV and get back to you shortly.</p>
      </div>
    )
  }

  return (
    <form className="job-apply-form" onSubmit={handleSubmit} noValidate>
      <div className="app-form-grid">
        <div className="app-field">
          <label htmlFor="name">Full Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            required
            className={`app-input ${fieldErrors.name ? 'invalid' : ''}`}
          />
          {fieldErrors.name && <span className="field-error-text">{fieldErrors.name}</span>}
        </div>

        <div className="app-field">
          <label htmlFor="email">Email Address *</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            className={`app-input ${fieldErrors.email ? 'invalid' : ''}`}
          />
          {fieldErrors.email && <span className="field-error-text">{fieldErrors.email}</span>}
        </div>
      </div>

      <div className="app-form-grid">
        <div className="app-field">
          <label htmlFor="phone">Phone Number (10 digits) *</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            maxLength={14}
            placeholder="9876543210"
            required
            className={`app-input ${fieldErrors.phone ? 'invalid' : ''}`}
          />
          {fieldErrors.phone && <span className="field-error-text">{fieldErrors.phone}</span>}
        </div>

        <div className="app-field">
          <label htmlFor="location">Current Location</label>
          <input id="location" name="location" type="text" placeholder="e.g. Delhi, India" className="app-input" />
        </div>
      </div>

      <div className="app-form-grid">
        <div className="app-field">
          <label htmlFor="experience">Relevant Experience</label>
          <input id="experience" name="experience" type="text" placeholder="e.g. 3 Years" className="app-input" />
        </div>

        <div className="app-field">
          <label htmlFor="qualification">Highest Qualification</label>
          <input id="qualification" name="qualification" type="text" placeholder="e.g. Graduation" className="app-input" />
        </div>
      </div>

      <div className="app-field">
        <label htmlFor="coverLetter">Cover Letter / Note</label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          rows={3}
          placeholder="Share a short note about why you're a great fit..."
          className="app-textarea"
        />
      </div>

      <div className="app-field">
        <label htmlFor="resume">Resume / CV (PDF, DOC, DOCX — Max 5MB) *</label>
        <div className={`file-upload-box ${fieldErrors.resume ? 'invalid' : ''}`}>
          <input
            id="resume"
            name="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            required
            className="file-upload-input"
            onChange={(e) => {
              const file = e.target.files?.[0]
              setFileName(file ? file.name : '')
            }}
          />
          <div className="file-upload-content">
            <span className="upload-icon">📄</span>
            <span className="upload-text">
              {fileName ? `Selected: ${fileName}` : 'Click or Drag & Drop CV here'}
            </span>
            <span className="upload-hint">PDF, DOCX up to 5MB</span>
          </div>
        </div>
        {fieldErrors.resume && <span className="field-error-text">{fieldErrors.resume}</span>}
      </div>

      {error && <div className="app-error-box">{error}</div>}

      <button type="submit" className="app-submit-btn" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Submitting Application…' : '🚀 Submit Application'}
      </button>
    </form>
  )
}
