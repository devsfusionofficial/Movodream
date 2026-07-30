const TECHNOLOGIES = [
  'AI Travel Operating System',
  'AI Itinerary Engine',
  'Intelligent Recommendation System',
  'Live Travel Mode',
  'Local Guru',
  'Memory Curation',
  'Integrated Booking Engine',
  'AI-powered Personalization',
]

const STATS = [
  { label: '80%+', desc: 'Travelers use digital platforms during trip planning' },
  { label: 'Growing Demand', desc: 'Experience-led travel continues to rise among modern travelers' },
  { label: '24/7 Expectations', desc: 'Travelers increasingly expect instant, intelligent assistance' },
  { label: 'Emerging Tech', desc: 'AR, VR, and AI are redefining how destinations are discovered and experienced' },
]

// Content verbatim from the client's content doc.
export function TechnologyShowcase() {
  return (
    <section className="tech-showcase">
      <div className="tech-showcase-inner">
        <h2>Reimagining Travel Through Technology</h2>
        <p>
          At Movodream, we develop technologies that address real traveler needs before, during, and after a
          journey. By leveraging artificial intelligence, automation, data intelligence, and contextual guidance, we
          create travel experiences that are more adaptive, informed, and personalized.
        </p>

        <div className="tech-grid">
          {TECHNOLOGIES.map((tech) => (
            <div key={tech} className="tech-tile">
              {tech}
            </div>
          ))}
        </div>

        <div className="tech-future">
          <h3>The Future of Travel</h3>
          <p>
            We believe the future of travel lies in intelligent ecosystems that understand travelers, adapt to their
            preferences, and provide meaningful support throughout their journey.
          </p>

          <div className="tech-stats">
            {STATS.map((stat) => (
              <div key={stat.label} className="tech-stat">
                <div className="tech-stat-label">{stat.label}</div>
                <p>{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
