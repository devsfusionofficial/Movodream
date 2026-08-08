export default function CareersLoading() {
  return (
    <div className="page-shell">
      <section className="page-crumb">
        <div className="skeleton-bar" style={{ width: 150, height: 14 }} />
      </section>

      <section className="page-head">
        <div className="skeleton-bar skeleton-hero-title" />
        <div className="skeleton-bar skeleton-hero-sub" />
      </section>

      <main className="page-main">
        <div className="page-toolbar">
          <div className="page-filters">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton-bar" style={{ width: 148, height: 42, borderRadius: 999 }} />
            ))}
          </div>
        </div>

        <div className="job-list">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="job-tile">
              <div style={{ flex: 1 }}>
                <div className="skeleton-bar skeleton-card-line" style={{ width: '38%' }} />
                <div className="job-tile-meta" style={{ marginTop: 12 }}>
                  {Array.from({ length: 3 }).map((__, j) => (
                    <div key={j} className="skeleton-bar" style={{ width: 88, height: 24, borderRadius: 999 }} />
                  ))}
                </div>
              </div>
              <div className="skeleton-bar" style={{ width: 38, height: 38, borderRadius: '50%' }} />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
