'use client'

import { useState, useEffect } from 'react'

type JobFiltersProps = {
  departments: string[]
  locations: string[]
  initialDepartment?: string
  initialLocation?: string
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
      <select
        value={selectedDept}
        onChange={(e) => setSelectedDept(e.target.value)}
        aria-label="Filter by department"
        className="page-select"
      >
        <option value="">All departments</option>
        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      <select
        value={selectedLoc}
        onChange={(e) => setSelectedLoc(e.target.value)}
        aria-label="Filter by location"
        className="page-select"
      >
        <option value="">All locations</option>
        {locations.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>

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
