import { useState, useEffect } from 'react'

/**
 * Cinematic preloader hook — AirCenter pattern (HERO-DEEP-DIVE §12).
 *
 * Lifecycle:
 *   1. Mounts → phase='loading', progress animates 0→1 over minDelay
 *   2. minDelay reached → phase='fade-out', CSS transitions for 2s
 *   3. 2s later → phase='done', unmount
 *
 * Respects prefers-reduced-motion: skips directly to 'done'.
 */
export function usePreloader(minDelay = 1500) {
  const [phase, setPhase] = useState('loading') // loading → fade-out → done

  useEffect(() => {
    // Respect a11y: skip preloader for users who request reduced motion
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReduced) {
      setPhase('done')
      // Notify listeners immediately (no preloader visible at all)
      window.dispatchEvent(new Event('preloader:done'))
      return
    }

    // Lock body scroll while preloader is visible
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const fadeOutTimer = setTimeout(() => {
      setPhase('fade-out')
      // Broadcast 'preloader:fading' early (at 80% through the fade-out)
      // so the hero content can start fading IN *underneath* the
      // preloader. Without this, you see the preloader fade out and then
      // the hero content pop in — a visible jank at the seam.
      setTimeout(
        () => window.dispatchEvent(new Event('preloader:done')),
        800
      )
    }, minDelay)
    const doneTimer = setTimeout(() => {
      setPhase('done')
      // Force scroll position to top with Lenis if available, else native.
      // Avoids the "page jumped" feeling some users see when the body
      // scroll-lock releases — especially if the user clicked before load.
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true })
      } else {
        window.scrollTo(0, 0)
      }
      document.body.style.overflow = prevOverflow
    }, minDelay + 1200) // fade-out takes 1.2s (matches CSS)

    return () => {
      clearTimeout(fadeOutTimer)
      clearTimeout(doneTimer)
      document.body.style.overflow = prevOverflow
    }
  }, [minDelay])

  return { phase }
}
