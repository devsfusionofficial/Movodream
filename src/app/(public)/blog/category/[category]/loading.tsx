export default function BlogCategoryLoading() {
  return (
    <div className="page-shell">
      <section className="page-crumb">
        <div className="skeleton-bar" style={{ width: 200, height: 14 }} />
      </section>

      <section className="page-head">
        <div className="skeleton-bar skeleton-hero-title" />
        <div className="skeleton-bar skeleton-hero-sub" />
      </section>

      <main className="page-main">
        <div className="page-toolbar">
          <div className="page-pills">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-bar" style={{ width: 76, height: 34, borderRadius: 999 }} />
            ))}
          </div>
          <div className="skeleton-bar" style={{ width: 240, height: 42, borderRadius: 999 }} />
        </div>

        <div className="post-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="post-tile">
              <div className="post-tile-media" />
              <div className="post-tile-body">
                <div className="skeleton-bar" style={{ width: 78, height: 20, borderRadius: 999 }} />
                <div className="skeleton-bar skeleton-card-line" style={{ width: '88%', marginTop: 14 }} />
                <div className="skeleton-bar skeleton-card-line" style={{ width: '62%', marginTop: 10 }} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
