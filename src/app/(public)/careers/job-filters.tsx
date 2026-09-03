'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Check, Briefcase, MapPin, RotateCcw } from 'lucide-react'

type JobFiltersProps = {
  departments: string[]
  locations: string[]
  initialDepartment?: string
  initialLocation?: string
}

function CustomSelect({
  label,
  value,
  options,
  defaultLabel,
  icon: Icon,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  defaultLabel: string
  icon?: React.ComponentType<{ className?: string }>
  onChange: (val: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const cleanVal = (value || '').trim()
  const selectedText = cleanVal || defaultLabel

  return (
    <div className={`career-custom-select-wrap ${isOpen ? 'is-open z-50' : 'z-10'}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={label}
        className={`career-custom-select-btn ${cleanVal ? 'has-value' : ''}`}
      >
        <span className="flex items-center gap-2 truncate">
          {Icon && <Icon className="h-3.5 w-3.5 text-[#ec2a8b] shrink-0" />}
          <span className="truncate">{selectedText}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-[#ec2a8b] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="career-custom-select-menu"
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
        >
          <div
            className="career-custom-select-list"
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                onChange('')
                setIsOpen(false)
              }}
              className={`career-custom-select-item ${!cleanVal ? 'active' : ''}`}
            >
              <span>{defaultLabel}</span>
              {!cleanVal && <Check className="h-3.5 w-3.5 text-[#ec2a8b]" />}
            </button>
            <div className="career-select-divider" />
            {options.map((opt) => {
              const optClean = (opt || '').trim()
              if (!optClean) return null
              const isSelected = cleanVal.toLowerCase() === optClean.toLowerCase()
              return (
                <button
                  key={optClean}
                  type="button"
                  onClick={() => {
                    onChange(optClean)
                    setIsOpen(false)
                  }}
                  className={`career-custom-select-item ${isSelected ? 'active' : ''}`}
                >
                  <span className="truncate">{optClean}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-[#ec2a8b] shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export function JobFilters({
  departments,
  locations,
  initialDepartment = '',
  initialLocation = '',
}: JobFiltersProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedDept, setSelectedDept] = useState(initialDepartment.trim())
  const [selectedLoc, setSelectedLoc] = useState(initialLocation.trim())

  // Keep state synced with URL searchParams
  useEffect(() => {
    setSelectedDept(initialDepartment.trim())
    setSelectedLoc(initialLocation.trim())
  }, [initialDepartment, initialLocation])

  const isFiltered = Boolean(selectedDept || selectedLoc)

  const applyFilterImmediately = (newDept: string, newLoc: string) => {
    const trimmedDept = newDept.trim()
    const trimmedLoc = newLoc.trim()
    setSelectedDept(trimmedDept)
    setSelectedLoc(trimmedLoc)

    const params = new URLSearchParams()
    if (trimmedDept) params.set('department', trimmedDept)
    if (trimmedLoc) params.set('location', trimmedLoc)
    if (trimmedDept || trimmedLoc) {
      params.set('page', '1')
    }

    const queryStr = params.toString()
    const targetUrl = queryStr ? `/careers?${queryStr}` : '/careers'

    startTransition(() => {
      router.push(targetUrl, { scroll: false })
    })
  }

  const handleClear = () => {
    setSelectedDept('')
    setSelectedLoc('')
    startTransition(() => {
      router.push('/careers', { scroll: false })
    })
  }

  return (
    <div className={`page-filters ${isPending ? 'opacity-70 transition-opacity' : ''}`}>
      <CustomSelect
        label="Filter by department"
        value={selectedDept}
        options={departments}
        defaultLabel="All departments"
        icon={Briefcase}
        onChange={(val) => applyFilterImmediately(val, selectedLoc)}
      />

      <CustomSelect
        label="Filter by location"
        value={selectedLoc}
        options={locations}
        defaultLabel="All locations"
        icon={MapPin}
        onChange={(val) => applyFilterImmediately(selectedDept, val)}
      />

      {isFiltered && (
        <button
          type="button"
          onClick={handleClear}
          className="career-clear-btn"
          title="Reset all filters"
        >
          <RotateCcw className="h-3.5 w-3.5 text-[#ec2a8b] shrink-0" />
          <span>Clear filters</span>
        </button>
      )}
    </div>
  )
}

