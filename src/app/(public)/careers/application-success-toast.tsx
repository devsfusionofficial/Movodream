'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2, X } from 'lucide-react'

export function ApplicationSuccessToast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (searchParams.get('applied') === 'true') {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        // Clean query parameter from URL without page reload
        const newUrl = window.location.pathname
        window.history.replaceState({}, '', newUrl)
      }, 7000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  if (!visible) return null

  const handleClose = () => {
    setVisible(false)
    const newUrl = window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }

  return (
    <div className="fixed top-24 right-6 z-50 max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-white/95 p-4 shadow-[0_12px_32px_rgba(16,185,129,0.18)] backdrop-blur-md">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-gray-900">Application Submitted!</h4>
          <p className="mt-0.5 text-xs text-gray-600 leading-relaxed">
            Thank you for applying. Our talent acquisition team has received your application and will review your CV shortly.
          </p>
        </div>
        <button
          onClick={handleClose}
          className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
          aria-label="Close message"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
