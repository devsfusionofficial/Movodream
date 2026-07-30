/**
 * Ported from index.html's #shutterCta (lines 1466–1511). Always
 * `opacity: 0` — the scroll-driven reveal that would show it is commented
 * out in footer.js on the live site, so this panel never becomes visible
 * there either. Kept as inert markup for 1:1 DOM parity, not "finished".
 */
export function ComingSoonShutter() {
  return (
    <>
      <div style={{ height: '100vh', width: '100%' }} />

      <div className="shutter-cta" id="shutterCta">
        <div className="shutter-inner">
          <h2 className="shutter-headline">
            Movodream <span>Travel Reimagined</span>
          </h2>

          <h3 className="shutter-cta-h3">Coming Soon!</h3>

          <div className="shutter-contact">
            Questions? <a href="mailto:Support@movodream.com">Support@movodream.com</a>
            <br />
            <span style={{ fontSize: '0.95rem', opacity: 0.6 }}>Global support active • 24/7</span>
          </div>
        </div>
      </div>
    </>
  )
}
