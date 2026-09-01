'use client'

import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { PanoramaViewer } from './hero/PanoramaViewer'

// Same 3 items as the desktop .feature-bar, verbatim — label + description,
// nothing invented for the mobile carousel. Icons are purely decorative.
const MOBILE_FEATURES = [
  { icon: '🔮', color: 'pink', label: '360° AR/VR Previews', desc: 'Walk through before you book. Expert-verified. No surprises.' },
  { icon: '🧭', color: 'purple', label: 'Live AR Navigation', desc: 'Directions on your real-world view. No squinting at maps.' },
  { icon: '🧠', color: 'teal', label: 'Context-Aware Guidance', desc: 'Your AI knows where you are and what you love. Surfaces immersive views automatically.' },
]

// 5 slides for infinite loop: [Clone 2, Card 0, Card 1, Card 2, Clone 0]
const CAROUSEL_SLIDES = [
  { ...MOBILE_FEATURES[2], realIndex: 2, key: 'clone-prev' },
  { ...MOBILE_FEATURES[0], realIndex: 0, key: 'slide-0' },
  { ...MOBILE_FEATURES[1], realIndex: 1, key: 'slide-1' },
  { ...MOBILE_FEATURES[2], realIndex: 2, key: 'slide-2' },
  { ...MOBILE_FEATURES[0], realIndex: 0, key: 'clone-next' },
]

const AUTOPLAY_INTERVAL_MS = 3500
const RESUME_AFTER_MS = 4500

export function ImmersiveBooking() {
  const [currentIndex, setCurrentIndex] = useState(1) // Starts on Card 0 (index 1)
  const [enableTransition, setEnableTransition] = useState(true)
  const currentIndexRef = useRef(1)
  currentIndexRef.current = currentIndex

  const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isPointerOverRef = useRef(false)
  const touchStartXRef = useRef<number | null>(null)

  useGSAP(() => {
    gsap.registerPlugin(SplitText)

    let cancelled = false
    let split: SplitText | null = null

    document.fonts.ready.then(() => {
      if (cancelled) return
      split = SplitText.create('.s2-headline-fs', { type: 'lines,chars', linesClass: 'split-line' })
      gsap.set('.split-line', { overflow: 'hidden', paddingBottom: '0.05em' })
      gsap.set(split.chars, { opacity: 1 })
    })

    return () => {
      cancelled = true
      split?.revert()
    }
  }, [])

  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function stopAutoplay() {
    if (autoplayTimer.current) clearInterval(autoplayTimer.current)
    autoplayTimer.current = null
  }

  function scheduleResume() {
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    if (isPointerOverRef.current) return
    resumeTimer.current = setTimeout(() => {
      if (!isPointerOverRef.current) {
        startAutoplay()
      }
    }, RESUME_AFTER_MS)
  }

  function goToSlide(targetIndex: number) {
    if (resetTimer.current) clearTimeout(resetTimer.current)

    let nextIdx = targetIndex
    if (currentIndexRef.current >= 4 && targetIndex > 4) {
      nextIdx = 2
    } else if (currentIndexRef.current <= 0 && targetIndex < 0) {
      nextIdx = 2
    } else {
      nextIdx = Math.max(0, Math.min(CAROUSEL_SLIDES.length - 1, targetIndex))
    }

    setEnableTransition(true)
    setCurrentIndex(nextIdx)

    // Fallback timer in case transitionend is interrupted or tab is in background
    if (nextIdx === 4) {
      resetTimer.current = setTimeout(() => {
        setEnableTransition(false)
        setCurrentIndex(1)
      }, 650)
    } else if (nextIdx === 0) {
      resetTimer.current = setTimeout(() => {
        setEnableTransition(false)
        setCurrentIndex(3)
      }, 650)
    }
  }

  function startAutoplay() {
    stopAutoplay()
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    if (isPointerOverRef.current) return
    autoplayTimer.current = setInterval(() => {
      if (isPointerOverRef.current) return
      goToSlide(currentIndexRef.current + 1)
    }, AUTOPLAY_INTERVAL_MS)
  }

  function handleTransitionEnd() {
    if (currentIndexRef.current === 4) {
      if (resetTimer.current) clearTimeout(resetTimer.current)
      setEnableTransition(false)
      setCurrentIndex(1)
    } else if (currentIndexRef.current === 0) {
      if (resetTimer.current) clearTimeout(resetTimer.current)
      setEnableTransition(false)
      setCurrentIndex(3)
    }
  }

  function handleCardClick(slideIndex: number) {
    if (slideIndex === currentIndex) return // already centered
    goToSlide(slideIndex)
    stopAutoplay()
    if (!isPointerOverRef.current) {
      scheduleResume()
    }
  }

  function handleDotClick(realIndex: number) {
    const safeIdx = Math.max(0, Math.min(CAROUSEL_SLIDES.length - 1, currentIndex))
    const curReal = CAROUSEL_SLIDES[safeIdx]?.realIndex ?? 0
    if (curReal === realIndex) return
    stopAutoplay()
    if (currentIndex === 1 && realIndex === 2) {
      goToSlide(0)
    } else if (currentIndex === 3 && realIndex === 0) {
      goToSlide(4)
    } else {
      goToSlide(realIndex + 1)
    }
    if (!isPointerOverRef.current) {
      scheduleResume()
    }
  }

  function handlePointerEnter() {
    isPointerOverRef.current = true
    stopAutoplay()
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
  }

  function handlePointerLeave() {
    isPointerOverRef.current = false
    scheduleResume()
  }

  function handleTouchStart(e: React.TouchEvent) {
    isPointerOverRef.current = true
    stopAutoplay()
    touchStartXRef.current = e.touches[0].clientX
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
  }

  function handleTouchEnd(e: React.TouchEvent) {
    isPointerOverRef.current = false
    if (touchStartXRef.current !== null) {
      const touchEndX = e.changedTouches[0].clientX
      const diffX = touchEndX - touchStartXRef.current
      if (diffX < -35) {
        goToSlide(currentIndexRef.current + 1)
      } else if (diffX > 35) {
        goToSlide(currentIndexRef.current - 1)
      }
      touchStartXRef.current = null
    }
    setTimeout(() => {
      if (!isPointerOverRef.current) {
        scheduleResume()
      }
    }, 50)
  }

  useEffect(() => {
    startAutoplay()
    return () => {
      stopAutoplay()
      if (resumeTimer.current) clearTimeout(resumeTimer.current)
      if (resetTimer.current) clearTimeout(resetTimer.current)
    }
  }, [])

  const safeIndex = Math.max(0, Math.min(CAROUSEL_SLIDES.length - 1, currentIndex))
  const activeRealIndex = CAROUSEL_SLIDES[safeIndex]?.realIndex ?? 0

  const trackStyle: React.CSSProperties = {
    transform: `translateX(calc((100vw - var(--mb-card-w, 76vw)) / 2 - ${safeIndex} * (var(--mb-card-w, 76vw) + 14px)))`,
    transition: enableTransition ? 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
  }

  return (
    <section className="section-2">
      <h1 className="s2-headline">
        A Future Where <br />
        Journeys Come Alive
      </h1>
      <p className="subs2-headline">
        Where exploration is immersive, intuitive, and enhance experience. Where people focus on wonder, not
        logistics
      </p>

      <div className="s2-card-wrapper">
        <div className="s2-card">
          <PanoramaViewer
            desktopSrc="/assets/images/panos/hi/03/tajpano.webp"
            mobileSrc="/assets/images/panos/hi/03/tajpano-mb.webp"
            blurSrc="/assets/images/panos/hi/03/tajpano-blur.webp"
            placeholderSrc="/assets/images/panos/hi/03/placeholder.png"
          />
          <div className="fullscreen-content">
            <h2 className="s2-headline-fs">
              An immersive Travel
              <br />
              booking experience
            </h2>
          </div>
          <div className="content">
            <div className="feature-bar">
              <div className="feature-item">
                <div className="feature-label pink">360° AR/VR Previews</div>
                <div className="feature-desc">Walk through before you book. Expert-verified. No surprises.</div>
              </div>
              <div className="feature-item">
                <div className="feature-label purple">Live AR Navigation</div>
                <div className="feature-desc">Directions on your real-world view. No squinting at maps.</div>
              </div>
              <div className="feature-item">
                <div className="feature-label teal">Context-Aware Guidance</div>
                <div className="feature-desc">
                  Your AI knows where you are and what you love. Surfaces immersive views automatically.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Premium Swipeable Glass Carousel (Visible on <= 768px) */}
        <div
          className="mobile-immersive-features"
          onMouseEnter={handlePointerEnter}
          onMouseLeave={handlePointerLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <div
            className="mobile-carousel-track"
            style={trackStyle}
            onTransitionEnd={handleTransitionEnd}
          >
            {CAROUSEL_SLIDES.map((f, i) => (
              <div
                className={`mobile-feature-card${f.realIndex === activeRealIndex ? ' active' : ''}`}
                key={`${f.key}-${i}`}
                role="button"
                tabIndex={0}
                onClick={() => handleCardClick(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleCardClick(i)
                  }
                }}
              >
                <span className={`mobile-feature-badge ${f.color}`}>
                  <span className="mobile-feature-badge-icon">{f.icon}</span>
                  {f.label}
                </span>
                <p className="mobile-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mobile-carousel-dots">
            {MOBILE_FEATURES.map((f, i) => (
              <button
                key={f.label}
                type="button"
                className={`mobile-carousel-dot${i === activeRealIndex ? ' active' : ''}`}
                aria-label={`Go to feature ${i + 1}`}
                onClick={() => handleDotClick(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
