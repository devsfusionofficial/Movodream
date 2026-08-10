export default function BlogPostLoading() {
  return (
    <div className="page-shell article-page">
      <section className="page-crumb">
        <div className="skeleton-bar" style={{ width: 260, height: 14 }} />
      </section>

      <section className="article-layout">
        <aside className="article-rail">
          <div className="skeleton-bar" style={{ width: 34, height: 10 }} />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton-bar" style={{ width: 40, height: 40, borderRadius: '50%' }} />
          ))}
        </aside>

        <div className="article-body">
          <div className="skeleton-bar" style={{ width: 150, height: 28, borderRadius: 999 }} />
          <div className="skeleton-bar skeleton-hero-title" style={{ marginTop: 18 }} />
          <div className="skeleton-bar skeleton-hero-sub" />
          <div className="skeleton-bar" style={{ width: 300, height: 36, marginTop: 22, borderRadius: 999 }} />

          <div className="article-hero" />

          <div className="page-prose">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="skeleton-bar skeleton-card-line"
                style={{ width: i % 3 === 2 ? '64%' : '100%', marginBottom: 14 }}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
