import { useEffect } from 'react'

/**
 * Scroll-reveal hook with self-healing observer — performance-tuned.
 *
 * Why this version (vs the previous naive one):
 *   1. Throttled MutationObserver: scan only the mutated subtree, not the
 *      whole document. The previous version re-ran `querySelectorAll('.aos')`
 *      on EVERY mutation anywhere in the body, which thrashed on React re-renders
 *      (Header re-render alone could trigger dozens of scans/sec during scroll).
 *   2. Increased rootMargin (200px below) so elements reveal slightly before
 *      they enter the viewport — smoother perceived motion, no "pop in" at the
 *      edge. This also reduces the number of entries the observer fires for
 *      because the threshold can be higher.
 *   3. Threshold 0.12 (vs 0.01): skip the observer firing for elements that
 *      are barely visible (e.g. only their 1px edge is in view).
 *   4. 3s hard fallback (vs 4s): if the observer never fires (rare browser
 *      quirks), reveal everything sooner so the user never sees a stuck
 *      invisible section.
 */
export function useScrollReveal() {
  useEffect(() => {
    const seen = new WeakSet()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            // Eager-load any lazy images that just entered view
            entry.target.querySelectorAll('img[loading="lazy"]').forEach((img) => {
              if (img.dataset.src) img.src = img.dataset.src
            })
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px 200px 0px' }
    )

    const attach = (root = document) => {
      // If root is a Node, only scan its subtree. We can pass the mutated
      // node directly to avoid full-document scans.
      const scope = root instanceof Document ? root : root
      const els = scope.querySelectorAll
        ? scope.querySelectorAll('.aos')
        : []
      for (const el of els) {
        if (seen.has(el)) continue
        seen.add(el)
        observer.observe(el)
      }
    }

    // First pass (after first paint)
    const id1 = requestAnimationFrame(() => attach())

    // Watch for new .aos nodes — debounced via rAF so a burst of React
    // re-renders collapses to a single attach call per frame.
    let rafPending = false
    const mo = new MutationObserver((mutations) => {
      if (rafPending) return
      rafPending = true
      requestAnimationFrame(() => {
        rafPending = false
        for (const m of mutations) {
          // Only attach to the *added* nodes, not the whole document
          m.addedNodes.forEach((node) => {
            if (node.nodeType === 1) attach(node)
          })
        }
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    // Hard fallback: if nothing triggered after 3s, reveal everything
    const fallback = setTimeout(() => {
      document
        .querySelectorAll('.aos:not(.is-visible)')
        .forEach((el) => el.classList.add('is-visible'))
    }, 3000)

    return () => {
      cancelAnimationFrame(id1)
      mo.disconnect()
      observer.disconnect()
      clearTimeout(fallback)
    }
  }, [])
}
