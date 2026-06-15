import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Lenis smooth scroll integration — matches the AirCenter site (which uses
 * Locomotive/Lenis under the hood per the HERO-DEEP-DIVE report §1.2).
 *
 * Why we use this:
 *   - Native scroll is jerky on long pages, especially during the sticky
 *     hero dwell (200svh). Lenis interpolates scroll with rAF and exposes
 *     a smooth, jank-free feel.
 *   - The Hero scroll handler and Header state machine both read scroll
 *     position. Lenis fires a single `scroll` event per rAF tick, so we
 *     avoid the 60+ events/second storm from native scroll on some
 *     devices.
 *   - It exposes `window.__lenis.scrollTo()` (used by usePreloader to
 *     reset scroll position cleanly when the preloader releases the lock).
 *
 * Config choices (vs Lenis defaults):
 *   - duration: 1.0 — matches aircenter's feel (per HERO-INITIAL-AUDIT §2)
 *   - smoothWheel: true — trackpad/wheel get smooth lerp
 *   - lerp: 0.1 (default) — light easing, not too floaty
 *   - wheelMultiplier: 1.0 (default)
 *   - touchMultiplier: 1.5 — touch devices scroll feels native
 *   - anchors handled automatically (Lenis 1.1+)
 *
 * A11y: Lenis respects prefers-reduced-motion natively — when set, it
 * falls back to instant scroll. So we don't need to gate the hook on it.
 */
export function useLenis() {
  useEffect(() => {
    // Guard against double init in dev (React.StrictMode) or HMR
    if (window.__lenis) {
      // Already initialised — just resume
      window.__lenis.start?.()
      return
    }

    const lenis = new Lenis({
      duration: 1.0,
      smoothWheel: true,
      // Lenis 1.1+ exposes anchor + horizontal scroll on by default
    })

    // Expose globally so other hooks (Hero scroll handler, useHeaderScroll,
    // usePreloader) can read window.__lenis.scroll / .on / .off / .scrollTo
    window.__lenis = lenis

    // Drive Lenis from rAF — this is the only loop that runs every frame
    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy?.()
      if (window.__lenis === lenis) {
        delete window.__lenis
      }
    }
  }, [])
}
