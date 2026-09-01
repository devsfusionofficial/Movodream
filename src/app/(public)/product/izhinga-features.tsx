const FEATURES = [
  {
    slug: 'ai-travel-brain',
    num: '01',
    title: 'AI Travel Brain',
    desc: 'The context-aware AI that understands you better than any travel expert.',
    benefits: [
      {
        icon: 'fa-brain',
        title: 'Behavioural Learning',
        text: 'Learns your unique preferences, persona and interests.',
      },
      {
        icon: 'fa-wand-magic-sparkles',
        title: 'Real-Time Adaptive Logic',
        text: 'Instantly adjusts itineraries when plans, weather, or transit change.',
      },
      {
        icon: 'fa-chart-pie',
        title: 'Personalized AI Scoring',
        text: 'Every choice is scored against your unique travel preferences.',
      },
    ],
    videoSrc: '/assets/product/v2.mp4',
    imageSrc: '/assets/product/ai-travel-brain.webp',
    tags: [
      'Context AI',
      'Behavioral AI',
      'User Preferences',
      'Real-Time Adapt',
      'Dynamic Logic',
      'Predictive AI',
    ],
  },
  {
    slug: 'live-travel-mode',
    num: '02',
    title: 'Live Travel Mode',
    desc: 'Real-time guidance that stays with you for the whole trip, not just the booking.',
    benefits: [
      {
        icon: 'fa-location-arrow',
        title: 'Context-Aware Guidance',
        text: 'Understands where you are, what you’re doing, and what you need next to suggest relevant actions in the moment.',
      },
      {
        icon: 'fa-shield-halved',
        title: 'Emergency & Safety Alerts',
        text: 'Proactive local safety tips and 24/7 assistance on the go.',
      },
      {
        icon: 'fa-route',
        title: 'Dynamic Journey Adaptation',
        text: 'Continuously adjusts your journey as plans change - delays, closures, missed plans, unexpected discoveries, or changing preferences.',
      },
    ],
    videoSrc: '/assets/product/v1.mp4',
    imageSrc: '/assets/product/live-travel-mode.webp',
    tags: [
      'Live Navigation',
      'Real-Time Alerts',
      'Dynamic Itinerary',
      'Smart Alerts',
      'Traffic Updates',
      'Nearby Spots',
      'Emergency Help',
      'Trip Progress',
      'Context Guide',
      'Cultural Tips',
      'Voice Guides',
      'Live Translate',
    ],
  },
  {
    slug: 'booking-engine',
    num: '03',
    title: 'Integrated Booking Engine',
    desc: 'From AI recommendation to confirmed booking — in just one click.',
    benefits: [
      {
        icon: 'fa-ticket',
        title: 'Multi-Modal Unified Booking',
        text: 'Flights, stays, trains, and cabs booked together without tab switching in just one click.',
      },
      {
        icon: 'fa-arrows-rotate',
        title: 'Automatic Itinerary Sync',
        text: 'Every booking immediately links to your live daily schedule.',
      },
      {
        icon: 'fa-lock',
        title: 'Instant Fast Checkout',
        text: 'Bank-grade encrypted payments with transparent real-time pricing.',
      },
    ],
    videoSrc: '/assets/product/v3.mp4',
    imageSrc: '/assets/product/booking-engine.webp',
    tags: ['Flights & Hotels', 'Trains & Cabs', 'Buses & Rides', 'Experiences', 'Auto Sync', 'Fast Payments'],
  },
  {
    slug: 'local-guru',
    num: '04',
    title: 'Local Guru',
    desc: 'Discover authentic experiences, hidden gems and trusted local experts.',
    benefits: [
      {
        icon: 'fa-user-check',
        title: 'Human-Verified Recommendations',
        text: 'Local insights curated and validated by people who know the destination, not just algorithms.',
      },
      {
        icon: 'fa-gem',
        title: 'Hidden Gems & Local Secrets',
        text: 'Go beyond tourist hotspots with authentic places, experiences, and recommendations worth discovering.',
      },
      {
        icon: 'fa-award',
        title: 'Trust-Based Scoring',
        text: 'Recommendations are evaluated for relevance, quality, authenticity, and traveler fit, so you know what’s genuinely worth your time.',
      },
    ],
    videoSrc: '/assets/product/v6.mp4',
    imageSrc: '/assets/product/local-guru.webp',
    tags: [
      'Hidden Gems',
      'Local Experts',
      'Authentic Food',
      'Cultural Tips',
      'Nearby Spots',
      'Local Events',
      'Safety Alerts',
      'Insider Guides',
    ],
  },
  {
    slug: 'immersive-experience',
    num: '05',
    title: 'Immersive Travel Experience',
    desc: 'Experience destinations like never before with immersive & interactive technology.',
    benefits: [
      {
        icon: 'fa-vr-cardboard',
        title: '360° Virtual Previews',
        text: 'Explore landmarks, hotels, and viewpoints in interactive 3D.',
      },
      {
        icon: 'fa-headphones',
        title: 'Spatial Audio Narratives',
        text: 'Rich historical storytelling that plays automatically at landmarks.',
      },
      {
        icon: 'fa-expand',
        title: 'AR Landmark Scanner',
        text: 'Scan monument facades to unlock instant historical insights.',
      },
    ],
    videoSrc: '/assets/product/v4.mp4',
    imageSrc: '/assets/product/fifth-feature.webp',
    tags: [
      '360° Previews',
      'Travel Reels',
      'Virtual Try-On',
      'Real-Time Audio',
      'History Overlays',
      'Landmark Scan',
    ],
  },
  {
    slug: 'memory-curation',
    num: '06',
    title: 'Memory Curation',
    desc: 'Every journey ends. Every memory lives on.',
    benefits: [
      {
        icon: 'fa-book-bookmark',
        title: 'Story-Driven Memories',
        text: 'Transforms photos, videos, places, and experiences into cohesive travel stories.',
      },
      {
        icon: 'fa-clapperboard',
        title: 'Cinematic Storytelling',
        text: 'Turns your journey into beautifully edited reels and stories, bringing the experience to life beyond individual photos and videos.',
      },
      {
        icon: 'fa-share-nodes',
        title: 'Instantly Shareable',
        text: 'Ready-to-share travel memories optimized for social media and digital platforms.',
      },
    ],
    videoSrc: '/assets/product/v5.mp4',
    imageSrc: '/assets/product/memory-curation.webp',
    tags: [
      'AI Journal',
      'Smart Media',
      'Auto Highlights',
      'Trip Insights',
      'Timeline',
      'Places Archive',
      'Milestones',
      'Shared Albums',
    ],
  },
]

import { ProductVideoPlayer } from './product-video-player'

export function IzhingaFeatures() {
  return (
    <div className="izhinga-rows">
      {FEATURES.map((feature, i) => (
        <div key={feature.slug} className={`izhinga-row${i % 2 === 1 ? ' is-reversed' : ''}`}>
          <div
            className="izhinga-row-media"
            style={
              feature.slug === 'immersive-experience' || feature.slug === 'ai-travel-brain'
                ? { background: '#f8eefb' }
                : undefined
            }
          >
            <ProductVideoPlayer
              src={feature.videoSrc}
              poster={feature.imageSrc}
              title={feature.title}
              priority={i === 0}
            />
          </div>
          <div className="izhinga-row-body">
            <span className="izhinga-row-num">{feature.num}</span>
            <h3>{feature.title}</h3>
            <p className="izhinga-row-lead">{feature.desc}</p>

            <div className="izhinga-benefit-cards">
              {feature.benefits.map((b) => (
                <div key={b.title} className="izhinga-benefit-card">
                  <div className="izhinga-benefit-icon">
                    <i className={`fa-solid ${b.icon}`} aria-hidden="true" />
                  </div>
                  <div className="izhinga-benefit-info">
                    <strong>{b.title}</strong>
                    <span>{b.text}</span>
                  </div>
                </div>
              ))}
            </div>

            <ul className="izhinga-row-tags">
              {feature.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}
