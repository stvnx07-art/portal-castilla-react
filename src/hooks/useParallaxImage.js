import { useEffect, useRef } from 'react'

/**
 * useParallaxImage — subtle scroll-driven parallax for images.
 *
 * How it works:
 *   1. Attach a ref to the element (the wrapping <figure> or <div>,
 *      NOT the <img> itself, so we can compose with other transforms).
 *   2. Subscribe to window.__lenis 'scroll' events (falls back to
 *      native scroll) and compute a parallax offset for the
 *      element based on its position in the viewport.
 *   3. Write the offset as a CSS custom property `--parallax-y` on
 *      the element. The element's CSS uses `transform:
 *      translate3d(0, var(--parallax-y, 0), 0)` (or similar) to
 *      actually move.
 *
 * Why CSS custom property + rAF:
 *   - We don't write style.transform on every scroll tick — we
 *     coalesce all updates into a single rAF, so the browser
 *     composites once per frame.
 *   - We don't write style at all unless the element is on-screen
 *     (intersection-checked), so off-screen elements cost 0.
 *   - The parallax amount is `easeInOut`-shaped: full speed at
 *     the middle of the viewport, 0 at the edges, so the effect
 *     feels like the image "settles" as it crosses the screen.
 *
 * Config (all optional, with sensible defaults):
 *   @param {React.RefObject} ref — ref to the element to parallax
 *   @param {number}  strength   — max pixels of translateY at
 *                                  viewport center (default 24)
 *   @param {boolean} disabled   — turn off (e.g. reduced motion)
 *
 * Usage:
 *   const ref = useRef(null)
 *   useParallaxImage(ref, 30)
 *   return <figure ref={ref} className="parallax-wrap">
 *     <img src="..." style={{ transform:
 *       'translate3d(0, var(--parallax-y, 0), 0)' }} />
 *   </figure>
 */
export function useParallaxImage(ref, strength = 24, disabled = false) {
  const tickingRef = useRef(false)
  const visibleRef = useRef(false)

  useEffect(() => {
    if (disabled) return
    if (typeof window === 'undefined') return

    const el = ref.current
    if (!el) return

    // Respect a11y: skip parallax for users who request reduced motion
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReduced) return

    // 1) IntersectionObserver — only update the element when it's
    //    on-screen. This is the difference between "always animating
    //    30 images" and "animating only the 3 currently visible".
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
      },
      { rootMargin: '20% 0px' }   // start animating slightly before visible
    )
    io.observe(el)

    // 2) Read scroll position. Lenis exposes a smoothed `scroll` value
    //    that doesn't jitter on trackpads. Fallback to native if Lenis
    //    isn't loaded yet.
    const getScroll = () => {
      if (window.__lenis && typeof window.__lenis.scroll === 'number') {
        return window.__lenis.scroll
      }
      return window.scrollY || window.pageYOffset || 0
    }

    // 3) Compute the parallax offset. The image moves in the
    //    OPPOSITE direction of the scroll → classic parallax.
    //
    //    Math (linear):
    //      ratio = (elementCenter - vh/2) / (vh/2)
    //      ratio < 0 : element is ABOVE the viewport center
    //      ratio > 0 : element is BELOW the viewport center
    //      ratio = -1 : element center is at the very top of
    //                   the viewport (just entering from below)
    //      ratio = +1 : element center is at the very bottom
    //                   (just leaving through the top)
    //
    //      offset = -ratio * strength
    //      −ratio < 0 when above → image moves DOWN (lags the
    //      scroll up)
    //      −ratio > 0 when below → image moves UP (lags the
    //      scroll down)
    //
    //    So as the user scrolls DOWN, the image ALWAYS moves
    //    UP relative to its container — that lag is the parallax
    //    effect. The offset is proportional to the element's
    //    distance from the viewport center.
    //
    //    We DON'T use a sigmoid/depth factor — the user wants
    //    "subtle but present" parallax (per the original brief),
    //    not the "settles into place" apple.com effect. Linear
    //    feels more "designed" and "premium" in this case.
    const compute = () => {
      if (!visibleRef.current) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const elementCenter = rect.top + rect.height / 2
      const rawRatio = (elementCenter - vh / 2) / (vh / 2)
      // Clamp to [-1.5, 1.5] so the offset doesn't blow up
      // when the element is far off-screen. (At 1.5× the
      // strength, the offset is well past the visible area
      // for the image, so the user can't perceive a
      // difference beyond that.)
      const ratio = Math.max(-1.5, Math.min(1.5, rawRatio))
      const offset = -ratio * strength
      el.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`)
    }

    // 4) rAF-coalesced update. We don't write on every scroll event
    //    (which can be 60+/s on macOS trackpads) — we batch all
    //    updates into a single rAF tick.
    const onScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(() => {
        tickingRef.current = false
        compute()
      })
    }

    // Initial position
    compute()

    // 5) Subscribe. Prefer Lenis if available — it has its own
    //    throttled event we can hook into. Otherwise native scroll.
    let unsubscribe
    if (window.__lenis && typeof window.__lenis.on === 'function') {
      window.__lenis.on('scroll', onScroll)
      unsubscribe = () => window.__lenis.off('scroll', onScroll)
    } else {
      window.addEventListener('scroll', onScroll, { passive: true })
      unsubscribe = () => window.removeEventListener('scroll', onScroll)
    }

    // Recompute on resize (the element's position changes)
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      io.disconnect()
      unsubscribe?.()
      window.removeEventListener('resize', onScroll)
      el.style.removeProperty('--parallax-y')
    }
  }, [ref, strength, disabled])
}
