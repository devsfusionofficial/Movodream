'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import gsap from 'gsap'
import { useLenis } from '@/components/animation/SmoothScrollProvider'

const ContactModalContext = createContext<(() => void) | null>(null)

/** Hero's "Start Your Journey" and ClosingCta's "GET A DEMO" both open this. */
export function useOpenContactModal() {
  const ctx = useContext(ContactModalContext)
  if (!ctx) throw new Error('useOpenContactModal must be used within ContactModalProvider')
  return ctx
}

const GREETINGS = [
  'Hello!',
  'Hej!',
  'Bonjour!',
  'Hola!',
  '你好!',
  'Ciao!',
  'Olá!',
  'Привет!',
  'Merhaba!',
  'Sawadee!',
  'Aloha!',
  'Salve!',
  'Hei!',
  'Goddag!',
]

type FieldId = 'qzvName' | 'qzvEmail' | 'qzvconEmail' | 'qzvPhone' | 'qzvMessage'
type FieldErrors = Partial<Record<FieldId, string>>

function validate(values: Record<FieldId, string>): FieldErrors {
  const errors: FieldErrors = {}

  if (!values.qzvName) {
    errors.qzvName = 'Please enter your full name.'
  } else if (values.qzvName.length < 2) {
    errors.qzvName = 'Name is too short.'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!values.qzvEmail) {
    errors.qzvEmail = 'Please enter your email address.'
  } else if (!emailRegex.test(values.qzvEmail)) {
    errors.qzvEmail = 'Please enter a valid email address.'
  }

  if (!values.qzvconEmail) {
    errors.qzvconEmail = 'Please confirm your email address.'
  } else if (values.qzvEmail !== values.qzvconEmail) {
    errors.qzvconEmail = 'Email addresses do not match.'
  }

  const phoneVal = values.qzvPhone
  const phoneDigits = phoneVal.replace(/\D/g, '')
  const hasCountryCode = phoneVal.startsWith('+91') && phoneVal.length === 13

  if (!phoneVal) {
    errors.qzvPhone = 'Please enter your phone number.'
  } else if (hasCountryCode) {
    const localDigits = phoneVal.slice(3).replace(/\D/g, '')
    if (localDigits.length !== 10) {
      errors.qzvPhone = 'Phone number must be +91 followed by 10 digits.'
    } else if (!/[6-9]/.test(localDigits[0])) {
      errors.qzvPhone = 'Indian mobile numbers must start with 6, 7, 8, or 9.'
    } else if (/^(\d)\1+$/.test(localDigits)) {
      errors.qzvPhone = 'Phone number cannot have all repetitive digits.'
    }
  } else if (phoneDigits.length !== 10) {
    errors.qzvPhone = 'Phone number must be 10 digits'
  } else if (!/[6-9]/.test(phoneDigits[0])) {
    errors.qzvPhone = 'Indian mobile numbers must start with 6, 7, 8, or 9.'
  } else if (/^(\d)\1+$/.test(phoneDigits)) {
    errors.qzvPhone = 'Phone number cannot have all repetitive digits.'
  }

  return errors
}

/**
 * Ported from index.html's #qzvOverlay + footer.js. Visibility/pointer-events
 * are toggled imperatively via refs (not React state) so the closing fade
 * tween can finish before the panel actually leaves the accessibility tree —
 * same sequencing as the original's qzvOpenOverlay/qzvCloseOverlay.
 */
export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useLenis()

  const overlayRef = useRef<HTMLElement>(null)
  const dismissRef = useRef<HTMLButtonElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const greetingRef = useRef<HTMLHeadingElement>(null)
  const isOpenRef = useRef(false)
  const greetingIndexRef = useRef(0)
  const greetingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitLabel, setSubmitLabel] = useState('Send!')
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      lenisRef.current?.stop()
    } else {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      lenisRef.current?.start()
    }
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      lenisRef.current?.start()
    }
  }, [isOpen, lenisRef])

  const startGreetingLoop = useCallback(() => {
    if (greetingTimerRef.current) clearInterval(greetingTimerRef.current)
    greetingTimerRef.current = setInterval(() => {
      const el = greetingRef.current
      if (!el) return
      const nextIndex = (greetingIndexRef.current + 1) % GREETINGS.length
      gsap.to(el, {
        opacity: 0,
        y: -10,
        duration: 0.22,
        ease: 'power2.out',
        onComplete: () => {
          greetingIndexRef.current = nextIndex
          el.textContent = GREETINGS[nextIndex]
          gsap.to(el, { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' })
        },
      })
    }, 2000)
  }, [])

  const stopGreetingLoop = useCallback(() => {
    if (greetingTimerRef.current) {
      clearInterval(greetingTimerRef.current)
      greetingTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    const overlay = overlayRef.current
    const dismiss = dismissRef.current
    if (overlay) {
      overlay.style.visibility = 'hidden'
      overlay.style.pointerEvents = 'none'
      gsap.set(overlay, { x: '100vw', opacity: 0 })
    }
    if (dismiss) {
      dismiss.style.visibility = 'hidden'
      dismiss.style.pointerEvents = 'none'
    }
    return () => {
      if (greetingTimerRef.current) clearInterval(greetingTimerRef.current)
    }
  }, [])

  const close = useCallback(() => {
    isOpenRef.current = false
    setIsOpen(false)
    overlayRef.current?.setAttribute('aria-hidden', 'true')
    lenisRef.current?.start()
    stopGreetingLoop()

    const overlay = overlayRef.current
    const dismiss = dismissRef.current
    if (!overlay) return

    gsap.to(overlay, {
      x: '100vw',
      opacity: 0,
      duration: 0.45,
      ease: 'power3.in',
      onComplete: () => {
        overlay.style.visibility = 'hidden'
        overlay.style.pointerEvents = 'none'
        if (dismiss) {
          dismiss.style.visibility = 'hidden'
          dismiss.style.pointerEvents = 'none'
        }
        setErrors({})
        setSubmitLabel('Send!')
        setSubmitting(false)
      },
    })
  }, [lenisRef, stopGreetingLoop])

  const open = useCallback(() => {
    isOpenRef.current = true
    setIsOpen(true)
    setErrors({})

    lenisRef.current?.stop()

    const overlay = overlayRef.current
    const dismiss = dismissRef.current
    const card = cardRef.current
    const greeting = greetingRef.current
    if (!overlay || !card || !greeting) return

    overlay.style.visibility = 'visible'
    overlay.style.pointerEvents = 'auto'
    overlay.setAttribute('aria-hidden', 'false')
    if (dismiss) {
      dismiss.style.visibility = 'visible'
      dismiss.style.pointerEvents = 'auto'
    }

    gsap.killTweensOf(overlay)
    gsap.killTweensOf(card)
    gsap.killTweensOf(greeting)

    gsap.set(overlay, { x: '100vw', opacity: 0 })
    gsap.set(card, { y: 20, opacity: 0, scale: 0.985 })

    greetingIndexRef.current = 0
    greeting.textContent = GREETINGS[0]
    gsap.set(greeting, { opacity: 1, y: 0 })
    startGreetingLoop()

    gsap.to(overlay, { x: 0, opacity: 1, duration: 0.5, ease: 'power4.out' })
    gsap.to(card, { y: 0, opacity: 1, scale: 1, duration: 0.5, delay: 0.08, ease: 'power3.out' })
    gsap.fromTo(
      card.querySelectorAll('.qzv-field, .qzv-submit, .qzv-contactline'),
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, delay: 0.1, ease: 'power2.out' }
    )
  }, [lenisRef, startGreetingLoop])

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpenRef.current) close()
    }
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [close])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const form = e.currentTarget
      const values = {
        qzvName: (form.elements.namedItem('qzvName') as HTMLInputElement).value.trim(),
        qzvEmail: (form.elements.namedItem('qzvEmail') as HTMLInputElement).value.trim(),
        qzvconEmail: (form.elements.namedItem('qzvconEmail') as HTMLInputElement).value.trim(),
        qzvPhone: (form.elements.namedItem('qzvPhone') as HTMLInputElement).value.trim(),
        qzvMessage: (form.elements.namedItem('qzvMessage') as HTMLTextAreaElement).value.trim(),
      }

      const nextErrors = validate(values)
      setErrors(nextErrors)
      if (Object.keys(nextErrors).length > 0) return

      setSubmitting(true)
      setSubmitLabel('Sending...')

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: values.qzvName,
            email: values.qzvEmail,
            phone: values.qzvPhone,
            message: values.qzvMessage,
          }),
        })

        if (!response.ok) throw new Error('Unable to submit form. Please try again later.')

        const result = await response.json()
        if (result.success) {
          setSubmitLabel('Sent!')
          form.reset()
          close()
          setShowSuccess(true)
        } else {
          setErrors({ qzvMessage: 'Unable to send message. Please try again later.' })
          setSubmitting(false)
          setSubmitLabel('Send!')
        }
      } catch {
        setErrors({ qzvMessage: 'An unexpected error occurred. Please try again.' })
        setSubmitting(false)
        setSubmitLabel('Send!')
      }
    },
    [close]
  )

  const errStyle = { boxShadow: '0 0 0 2px #d81b60' }

  return (
    <ContactModalContext.Provider value={open}>
      {children}

      {mounted &&
        createPortal(
          <section
            className="qzv-overlay"
            id="qzvOverlay"
            aria-hidden="true"
            ref={overlayRef}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onClick={(e) => {
              if (e.target === e.currentTarget) close()
            }}
          >
            <button
              className="qzv-dismiss"
              type="button"
              id="qzvClose"
              aria-label="Close form"
              ref={dismissRef}
              onClick={close}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="qzv-frame">
              <div className="qzv-leftrail">
                <div>
                  <div className="qzv-logo-wrap">
                    <Image src="/assets/images/logo2.webp" alt="Movodream Logo" width={180} height={48} className="h-11 w-auto" style={{ width: 'auto', height: 'auto' }} priority />
                  </div>

                  <div className="qzv-story">
                    <h2 className="qzv-greeting" id="qzvGreeting" ref={greetingRef}>
                      HOLA!
                    </h2>
                    <p className="qzv-copy">
                      Ready to turn your wanderlust into a reality? Tell us where you want to go, and our AI concierge
                      will craft a journey unique to your soul.
                    </p>
                  </div>

                  <div className="qzv-contactstack">
                    <div className="qzv-contactline">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b0004a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <span>Support@movodream.com</span>
                    </div>
                    <div className="qzv-contactline">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b0004a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>Global Support • 24/7 Intelligence</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="qzv-rightrail">
                <div className="qzv-glass" ref={cardRef} id="qzvCard">
                  <form className="qzv-formgrid" onSubmit={handleSubmit} noValidate>
                    <div className="qzv-field">
                      <label className="qzv-fieldlabel" htmlFor="qzvName">
                        Full Name
                      </label>
                      <input
                        className="qzv-input"
                        id="qzvName"
                        name="qzvName"
                        type="text"
                        placeholder="What's your name?"
                        style={errors.qzvName ? errStyle : undefined}
                      />
                      {errors.qzvName && <div className="qzv-error-msg">{errors.qzvName}</div>}
                    </div>

                    <div className="qzv-field">
                      <label className="qzv-fieldlabel" htmlFor="qzvEmail">
                        Email Address
                      </label>
                      <input
                        className="qzv-input"
                        id="qzvEmail"
                        name="qzvEmail"
                        type="email"
                        placeholder="your@email.com"
                        style={errors.qzvEmail ? errStyle : undefined}
                      />
                      {errors.qzvEmail && <div className="qzv-error-msg">{errors.qzvEmail}</div>}
                    </div>

                    <div className="qzv-field">
                      <label className="qzv-fieldlabel" htmlFor="qzvconEmail">
                        Confirm Email
                      </label>
                      <input
                        className="qzv-input"
                        id="qzvconEmail"
                        name="qzvconEmail"
                        type="email"
                        placeholder="your@email.com"
                        style={errors.qzvconEmail ? errStyle : undefined}
                      />
                      {errors.qzvconEmail && <div className="qzv-error-msg">{errors.qzvconEmail}</div>}
                    </div>

                    <div className="qzv-field">
                      <label className="qzv-fieldlabel" htmlFor="qzvPhone">
                        Phone
                      </label>
                      <input
                        className="qzv-input"
                        id="qzvPhone"
                        name="qzvPhone"
                        type="tel"
                        maxLength={13}
                        placeholder="Phone Number"
                        style={errors.qzvPhone ? errStyle : undefined}
                      />
                      {errors.qzvPhone && <div className="qzv-error-msg">{errors.qzvPhone}</div>}
                    </div>

                    <div className="qzv-field">
                      <label className="qzv-fieldlabel" htmlFor="qzvMessage">
                        Message
                      </label>
                      <textarea
                        className="qzv-textarea"
                        id="qzvMessage"
                        name="qzvMessage"
                        placeholder="How can we help?"
                        rows={3}
                        style={errors.qzvMessage ? errStyle : undefined}
                      />
                      {errors.qzvMessage && <div className="qzv-error-msg">{errors.qzvMessage}</div>}
                    </div>

                    <button className="qzv-submit" type="submit" disabled={submitting}>
                      {submitLabel}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>,
          document.body
        )}

      {showSuccess && <ContactSuccessPopup onClose={() => setShowSuccess(false)} />}
    </ContactModalContext.Provider>
  )
}

function ContactSuccessPopup({ onClose }: { onClose: () => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const close = useCallback(() => {
    setVisible(false)
    setTimeout(onClose, 300)
  }, [onClose])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(249, 249, 251, 0.72)',
        zIndex: 9999999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(14px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(40px)',
          padding: 40,
          borderRadius: 28,
          textAlign: 'center',
          maxWidth: 400,
          width: '90%',
          boxShadow: '0 24px 48px rgba(104, 24, 138, 0.08)',
          border: '1px solid rgba(227, 189, 195, 0.32)',
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'transform 0.4s ease',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, #b0004a 0%, #d81b60 100%)',
            color: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            margin: '0 auto 20px',
            boxShadow: '0 10px 20px rgba(176, 0, 74, 0.2)',
          }}
        >
          ✓
        </div>
        <h3
          style={{
            margin: '0 0 12px',
            fontFamily: "'Manrope', sans-serif",
            fontSize: 24,
            color: '#1a1c1d',
            fontWeight: 800,
            letterSpacing: '-0.03em',
          }}
        >
          Query Submitted!
        </h3>
        <p
          style={{
            margin: '0 0 28px',
            color: '#5a4044',
            fontFamily: "'Manrope', sans-serif",
            lineHeight: 1.6,
            fontSize: 16,
          }}
        >
          Thank you for contacting us. Our support team will get back to you shortly through the email address
          mentioned above
        </p>
        <button
          type="button"
          onClick={close}
          style={{
            background: '#1a1c1d',
            color: '#fff',
            border: 'none',
            padding: '14px 36px',
            borderRadius: 99,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: "'Manrope', sans-serif",
            fontSize: 15,
            transition: 'transform 0.2s ease',
          }}
        >
          Got it
        </button>
      </div>
    </div>
  )
}
