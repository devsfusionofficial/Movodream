'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { PanoramaViewer } from './hero/PanoramaViewer'

/**
 * Ported from index.html's section-2 + script.js lines 292–620, then
 * substantially cut down from the original — which is worth explaining,
 * since most of what the source did here is deliberately not reproduced:
 *
 *  - The source scrubbed .s2-card's width/height up to 100svw/100svh as you
 *    scrolled on mobile — a genuine fullscreen takeover. That's explicitly
 *    not wanted here: .s2-card stays a normal, fixed-size card (sized in
 *    homepage.css) like every other section on the page.
 *  - It also revealed a headline + vertical feature list as an overlay on
 *    top of the (now much shorter, ~144px-tall) mobile card. There isn't
 *    room for that text without clipping it — confirmed by rendering it and
 *    watching "experience" get cut off the bottom edge — and the live
 *    reference site doesn't show this overlay on mobile at all; it's just a
 *    plain photo card there. So .fullscreen-content (the headline) and
 *    .content .feature-bar (the horizontal feature row) are both hidden
 *    outright below 768px (homepage.css), and none of the JS that used to
 *    reveal/reparent them into a vertical overlay exists anymore.
 *
 * What's left: the headline still needs SplitText's line-wrapping DOM
 * structure for its desktop CSS (`.split-line { padding-bottom: 0.05em }`,
 * guarding descenders) to apply correctly, since desktop shows it
 * permanently via `@media (min-width: 768px) { .fullscreen-content {
 * opacity: 1 !important } }`. No stagger/reveal animation is needed either
 * — chars are set to opacity: 1 immediately, so it's just plain visible
 * text wrapped in the spans that CSS rule targets.
 */
export function ImmersiveBooking() {
  useGSAP(() => {
    gsap.registerPlugin(SplitText)

    const split = SplitText.create('.s2-headline-fs', { type: 'lines,chars', linesClass: 'split-line' })
    gsap.set('.split-line', { overflow: 'hidden', paddingBottom: '0.05em' })
    gsap.set(split.chars, { opacity: 1 })

    return () => split.revert()
  }, [])

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
      </div>
    </section>
  )
}
