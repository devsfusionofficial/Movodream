/**
 * Tells a pinned/scroll-jacked section (e.g. PlatformSlides) to stand down
 * from its own scroll-driven auto-stepping while a header nav link is
 * mid-flight to that section — otherwise the nav's scrollTo and the
 * section's pin fight each other. Mirrors the original site's global
 * `isNavClick` flag (script.js), just scoped to a module instead of `window`.
 */
export const navClickGuard = { current: false }

export function markNavClick() {
  navClickGuard.current = true
  setTimeout(() => {
    navClickGuard.current = false
  }, 1500)
}
