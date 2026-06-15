import { useState, useEffect, useRef } from 'react'

/**
 * Header hook — AirCenter pattern (HERO-DEEP-DIVE §6).
 *
 * 3 states: top → sticky → sticky-collapsed.
 * Tracks the current section index for the counter pill.
 *
 * Performance: reads scroll position from Lenis (if available via
 * window.__lenis) or window.scrollY. Uses requestAnimationFrame to
 * coalesce scroll events into one update per frame, avoiding
 * 60+ React re-renders per second.
 */
export function useHeaderScroll(threshold = 20, collapseThreshold = 100) {
  const [state, setState] = useState('top')
  const [sectionIndex, setSectionIndex] = useState(0)
  const [sectionCount, setSectionCount] = useState(1)
  const sectionsRef = useRef([])
  const tickingRef = useRef(false)

  useEffect(() => {
    sectionsRef.current = Array.from(
      document.querySelectorAll('main section[id]')
    )
    setSectionCount(Math.max(sectionsRef.current.length, 1))

    const getY = () => {
      // Lenis exposes scroll via window.scrollY (it proxies native scroll)
      // but its own state has a more precise value
      if (window.__lenis?.scroll !== undefined) {
        return window.__lenis.scroll
      }
      return window.scrollY
    }

    const update = () => {
      tickingRef.current = false
      const y = getY()

      if (y <= threshold) {
        setState('top')
      } else if (y <= collapseThreshold) {
        setState('sticky')
      } else {
        setState('sticky-collapsed')
      }

      // Current section by viewport center
      const center = window.innerHeight / 2
      let idx = 0
      sectionsRef.current.forEach((sec, i) => {
        const r = sec.getBoundingClientRect()
        if (r.top <= center) idx = i
      })
      setSectionIndex(idx)
    }

    const onScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(update)
    }

    // Hook into Lenis scroll event if present, else native scroll
    if (window.__lenis) {
      window.__lenis.on('scroll', onScroll)
    } else {
      window.addEventListener('scroll', onScroll, { passive: true })
    }

    update() // initial paint

    return () => {
      if (window.__lenis) {
        window.__lenis.off('scroll', onScroll)
      } else {
        window.removeEventListener('scroll', onScroll)
      }
    }
  }, [threshold, collapseThreshold])

  return { state, sectionIndex, sectionCount }
}
