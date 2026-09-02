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

  const selectedText = value || defaultLabel

  return (
    <div className={`career-custom-select-wrap ${isOpen ? 'is-open z-50' : 'z-10'}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={label}
        className={`career-custom-select-btn ${value ? 'has-value' : ''}`}
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
        <div className="career-custom-select-menu">
          <div className="career-custom-select-list">
            <button
              type="button"
              onClick={() => {
                onChange('')
                setIsOpen(false)
              }}
              className={`career-custom-select-item ${!value ? 'active' : ''}`}
            >
              <span>{defaultLabel}</span>
              {!value && <Check className="h-3.5 w-3.5 text-[#ec2a8b]" />}
            </button>
            <div className="career-select-divider" />
            {options.map((opt) => {
              const isSelected = value.toLowerCase() === opt.toLowerCase()
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt)
                    setIsOpen(false)
                  }}
                  className={`career-custom-select-item ${isSelected ? 'active' : ''}`}
                >
                  <span className="truncate">{opt}</span>
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
  const [selectedDept, setSelectedDept] = useState(initialDepartment)
  const [selectedLoc, setSelectedLoc] = useState(initialLocation)

  // Keep state synced with URL searchParams
  useEffect(() => {
    setSelectedDept(initialDepartment)
    setSelectedLoc(initialLocation)
  }, [initialDepartment, initialLocation])

  const isFiltered = Boolean(selectedDept || selectedLoc)

  const applyFilterImmediately = (newDept: string, newLoc: string) => {
    setSelectedDept(newDept)
    setSelectedLoc(newLoc)

    const params = new URLSearchParams()
    if (newDept.trim()) params.set('department', newDept.trim())
    if (newLoc.trim()) params.set('location', newLoc.trim())
    params.set('page', '1')

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

