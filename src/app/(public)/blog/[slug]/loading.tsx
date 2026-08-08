export default function BlogPostLoading() {
  return (
    <div className="page-shell">
      <section className="page-crumb">
        <div className="skeleton-bar" style={{ width: 240, height: 14 }} />
      </section>

      <section className="page-head">
        <div className="page-pills" style={{ marginBottom: 14 }}>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="skeleton-bar" style={{ width: 84, height: 32, borderRadius: 999 }} />
          ))}
        </div>
        <div className="skeleton-bar skeleton-hero-title" />
        <div className="skeleton-bar skeleton-hero-sub" />
      </section>

      <main className="page-main page-article">
        <div className="page-article-hero" />
        <div className="page-prose">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="skeleton-bar skeleton-card-line"
              style={{ width: i % 3 === 2 ? '64%' : '100%', marginBottom: 14 }}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
