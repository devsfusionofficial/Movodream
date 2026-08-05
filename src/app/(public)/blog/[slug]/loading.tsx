export default function BlogPostLoading() {
  return (
    <>
      <section className="post-detail-hero">
        <div className="post-detail-categories">
          <div className="skeleton-bar" style={{ width: 90, height: 26, borderRadius: 999 }} />
        </div>
        <div className="skeleton-bar skeleton-hero-title" style={{ width: 'min(560px, 80%)', height: 40 }} />
        <div className="post-detail-meta">
          <div className="skeleton-bar" style={{ width: 100, height: 14 }} />
          <div className="skeleton-bar" style={{ width: 90, height: 14 }} />
          <div className="skeleton-bar" style={{ width: 70, height: 14 }} />
        </div>
      </section>

      <div className="post-detail-image">
        <div className="skeleton-bar" style={{ position: 'absolute', inset: 0 }} />
      </div>

      <main className="post-detail-body">
        {Array.from({ length: 6 }).map((_, i) => (
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
