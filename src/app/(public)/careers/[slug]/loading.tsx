export default function JobDetailLoading() {
  return (
    <>
      <section className="content-hero">
        <div className="skeleton-bar skeleton-hero-title" style={{ width: 'min(420px, 70%)' }} />
        <div className="job-detail-meta">
          <div className="skeleton-bar" style={{ width: 90, height: 14 }} />
          <div className="skeleton-bar" style={{ width: 80, height: 14 }} />
          <div className="skeleton-bar" style={{ width: 100, height: 14 }} />
        </div>
      </section>

      <main className="content-body">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="skeleton-bar skeleton-card-line"
            style={{ width: i % 3 === 2 ? '65%' : '95%', marginTop: 16 }}
          />
        ))}
      </main>
    </>
  )
}
