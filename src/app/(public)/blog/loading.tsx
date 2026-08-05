export default function BlogLoading() {
  return (
    <>
      <section className="content-hero">
        <div className="skeleton-bar skeleton-hero-title" />
        <div className="skeleton-bar skeleton-hero-sub" />
      </section>

      <main className="content-body" style={{ maxWidth: 1100 }}>
        <div className="blog-toolbar">
          <div className="blog-categories">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-bar" style={{ width: 76, height: 30, borderRadius: 999 }} />
            ))}
          </div>
          <div className="skeleton-bar" style={{ width: 220, height: 38, borderRadius: 999 }} />
        </div>

        <div className="blog-grid featured">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="post-card">
              <div className="skeleton-bar skeleton-card-image" />
              <div className="post-card-body">
                <div className="skeleton-bar skeleton-card-line" style={{ width: '30%' }} />
                <div className="skeleton-bar skeleton-card-line" style={{ width: '85%', marginTop: 12 }} />
                <div className="skeleton-bar skeleton-card-line" style={{ width: '60%', marginTop: 10 }} />
              </div>
            </div>
          ))}
        </div>

        <div className="blog-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="post-card">
              <div className="skeleton-bar skeleton-card-image" />
              <div className="post-card-body">
                <div className="skeleton-bar skeleton-card-line" style={{ width: '30%' }} />
                <div className="skeleton-bar skeleton-card-line" style={{ width: '85%', marginTop: 12 }} />
                <div className="skeleton-bar skeleton-card-line" style={{ width: '60%', marginTop: 10 }} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
