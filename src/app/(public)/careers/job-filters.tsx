'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Briefcase, MapPin } from 'lucide-react'

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
  const [selectedDept, setSelectedDept] = useState(initialDepartment)
  const [selectedLoc, setSelectedLoc] = useState(initialLocation)

  // Keep state synced with URL searchParams
  useEffect(() => {
    setSelectedDept(initialDepartment)
    setSelectedLoc(initialLocation)
  }, [initialDepartment, initialLocation])

  const isFiltered = Boolean(initialDepartment || initialLocation || selectedDept || selectedLoc)

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const params = new URLSearchParams()
    if (selectedDept.trim()) params.set('department', selectedDept.trim())
    if (selectedLoc.trim()) params.set('location', selectedLoc.trim())
    params.set('page', '1')

    const queryStr = params.toString()
    const targetUrl = queryStr ? `/careers?${queryStr}` : '/careers'
    
    // Force direct browser navigation to update URL & Server Component re-render
    window.location.href = targetUrl
  }

  const handleClear = () => {
    setSelectedDept('')
    setSelectedLoc('')
    window.location.href = '/careers'
  }

  return (
    <form onSubmit={handleApply} className="page-filters">
      <CustomSelect
        label="Filter by department"
        value={selectedDept}
        options={departments}
        defaultLabel="All departments"
        icon={Briefcase}
        onChange={(val) => setSelectedDept(val)}
      />

      <CustomSelect
        label="Filter by location"
        value={selectedLoc}
        options={locations}
        defaultLabel="All locations"
        icon={MapPin}
        onChange={(val) => setSelectedLoc(val)}
      />

      <button type="submit" className="page-pill active">
        Apply filters
      </button>

      {isFiltered && (
        <button type="button" onClick={handleClear} className="page-pill">
          Clear
        </button>
      )}
    </form>
  )
}
