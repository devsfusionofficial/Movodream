export default function JobDetailLoading() {
  return (
    <div className="page-shell">
      <section className="page-crumb">
        <div className="skeleton-bar" style={{ width: 260, height: 14 }} />
      </section>

      <section className="page-head">
        <div className="skeleton-bar skeleton-hero-title" />
        <div className="job-tile-meta" style={{ marginTop: 18 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton-bar" style={{ width: 92, height: 26, borderRadius: 999 }} />
          ))}
        </div>
      </section>

      <main className="page-main page-article">
        <div className="page-prose">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="skeleton-bar skeleton-card-line"
              style={{ width: i % 3 === 2 ? '58%' : '100%', marginBottom: 14 }}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
