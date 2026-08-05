export default function CareersLoading() {
  return (
    <>
      <section className="content-hero">
        <div className="skeleton-bar skeleton-hero-title" />
        <div className="skeleton-bar skeleton-hero-sub" />
      </section>

      <main className="content-body" style={{ maxWidth: 900 }}>
        <div className="careers-filters">
          <div className="skeleton-bar" style={{ width: 160, height: 38, borderRadius: 999 }} />
          <div className="skeleton-bar" style={{ width: 160, height: 38, borderRadius: 999 }} />
          <div className="skeleton-bar" style={{ width: 90, height: 38, borderRadius: 999 }} />
        </div>

        <div className="jobs-grid">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="job-card">
              <div>
                <div className="skeleton-bar skeleton-card-line" style={{ width: 220 }} />
                <div className="job-card-meta">
                  <div className="skeleton-bar" style={{ width: 80, height: 12 }} />
                  <div className="skeleton-bar" style={{ width: 90, height: 12 }} />
                  <div className="skeleton-bar" style={{ width: 70, height: 12 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
