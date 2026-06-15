import { usePreloader } from '../hooks/usePreloader'

/**
 * Preloader — Portal de Castilla.
 *
 * Composition (matches the brand logo plate: blue rounded outer
 * frame + two cream inner panels, "PORTAL" / "CASTILLA" with a
 * small "DE" in the middle of the blue band):
 *
 *   ┌──────────────────┬──────────────────┐
 *   │                  │                  │
 *   │      PORTAL      │     CASTILLA     │  ← inner cream panels
 *   │                  │                  │
 *   └────────┬── D  E ──┴─────────────────┘
 *            ↑          ↑
 *       left half   right half (separated
 *       (translate  by 1px in the middle
 *       to -100%)   to translate 100%)
 *
 * Sequence:
 *   1. Mount (loading)  — both halves meet at center, logo reads
 *                         as a single unit. Subtle entrance:
 *                         scale 0.94 → 1, opacity 0 → 1.
 *   2. After 1.5s       — phase='fade-out': the two halves slide
 *                         apart (left → -100%, right → 100%) with
 *                         a slight rotateY for depth. 1.2s ease.
 *   3. fade-out done    — phase='done', unmount. The hero content
 *                         was already fading in underneath
 *                         (dispatched at 800ms into fade-out).
 *
 * No raster image, no IA artifacts. All SVG/CSS, scales perfectly.
 */
export function Preloader() {
  // Debug query param: ?preload=10000 keeps the preloader visible
  // 10s for visual QA. No param = production 1.5s.
  const minDelay = (() => {
    if (typeof window === 'undefined') return 1500
    const m = new URLSearchParams(window.location.search).get('preload')
    return m ? Math.max(500, parseInt(m, 10) || 1500) : 1500
  })()
  const { phase } = usePreloader(minDelay)

  if (phase === 'done') return null

  const isExiting = phase === 'fade-out'

  return (
    <div
      className={`preloader${isExiting ? ' preloader--exiting' : ''}`}
      aria-hidden="true"
    >
      {/* Top progress bar (same 2px ink-2-on-grey as before) */}
      <div className="preloader__progress" />

      {/* Two halves of the brand plate. The seam is at the
          exact horizontal center, splitting the strip of blue
          between the two inner panels. The "DE" word is split
          across the seam too: the "D" lives inside the left
          half and the "E" lives inside the right half, each
          sitting INWARD from the seam so neither letter is
          clipped. */}
      {/* The brand plate as a single block. The whole plate is
          blue (rounded rectangle). Inside it, two cream inner
          panels (PORTAL | CASTILLA) sit side by side, with a
          thin blue strip between them where the "D"/"E" letters
          live. The split is exactly at the horizontal center
          (50%/50). The plate is split into two halves that slide
          apart on fade-out. */}
      <div className="preloader__plate">
        {/* Left half: outer blue rounded corner + cream panel +
            the "D" letter on the right edge (seam). */}
        <div className="preloader__half preloader__half--left">
          <div className="preloader__panel preloader__panel--portal">
            <span className="preloader__word">PORTAL</span>
          </div>
          <span className="preloader__de preloader__de--left">D</span>
        </div>

        {/* Right half: "E" letter on the left edge (seam) + cream
            panel + outer blue rounded corner. */}
        <div className="preloader__half preloader__half--right">
          <span className="preloader__de preloader__de--right">E</span>
          <div className="preloader__panel preloader__panel--castilla">
            <span className="preloader__word">CASTILLA</span>
          </div>
        </div>
      </div>
    </div>
  )
}
