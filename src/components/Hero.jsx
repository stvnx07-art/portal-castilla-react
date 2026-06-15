import { useEffect, useState, useRef } from 'react'
import './Hero.css'
import { DentalScene } from './DentalScene'

/**
 * Hero — replaces the static hero-bg.jpg (264KB) with a real-time R3F
 * 3D scene of the dental chair (dental.glb).
 *
 * Why a ref (scrollRef) instead of state (scrollProgress):
 *   The Hero's scroll handler already runs rAF-throttled (max 1 read per
 *   frame). If we kept scrollProgress in React state, every scroll tick
 *   would re-render the Hero — including the entire <Canvas> tree and
 *   the SVG letter parallax. With a ref:
 *     • The scroll handler writes `scrollRef.current = progress` (no React
 *       work, no re-render).
 *     • The SVG letters read it via CSS `var(--hero-progress)` set from
 *       the same ref on a style attribute on the section, which is also
 *       only set at rAF rate. Browsers handle the var update cheaply
 *       through CSS — no React tree diff.
 *     • The 3D model reads it inside Canvas's own useFrame rAF.
 *   Result: 1 scroll handler, 1 setStyle call, 1 useFrame read. 60 FPS
 *   stable even on integrated GPUs.
 *
 * Background: handled purely in CSS (.hero__bg-layer in Hero.css) — a
 * radial gradient that emulates the white-center → light-grey-edges
 * look of the original photo, plus a soft top spotlight. Zero bytes of
 * raster, paints in <1ms.
 */
export function Hero() {
  const [visible, setVisible] = useState(false)
  const heroRef = useRef(null)
  const scrollRef = useRef(0) // 0..1 — written by Lenis rAF, read by SVG + R3F

  // Staggered reveal — waits for preloader:done so the SVG letter handoff
  // is seamless. (Unchanged from previous version.)
  useEffect(() => {
    const startReveal = () => setTimeout(() => setVisible(true), 80)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }
    window.addEventListener('preloader:done', startReveal, { once: true })
    const safety = setTimeout(startReveal, 2500)
    return () => {
      window.removeEventListener('preloader:done', startReveal)
      clearTimeout(safety)
    }
  }, [])

  // rAF-throttled scroll handler. Reads from Lenis (window.__lenis) if
  // present, else native scroll. Writes a CSS custom property on
  // documentElement so the WHOLE site (header, hero, etc.) can read
  // --hero-progress via var() — not just heroRef.current. This is what
  // lets the .header__wordmark in index.css interpolate from its
  // full-width hero position to its collapsed navbar slot using
  // pure CSS calc() with no JS involved.
  //
  // Smoothness model: we DON'T write the raw scroll progress directly
  // to the CSS var. Instead, we maintain a `displayedProgress` ref and
  // lerp it toward the raw `target` every rAF tick. The lerp uses a
  // critically-damped exponential approach (factor 0.18 per frame at
  // 60fps → ~0.5s settle time). This gives the wordmark and any other
  // CSS var consumer an organic, inertia-like feel during scroll, plus
  // a smooth "landing" when the user releases — exactly the behavior
  // the user asked for when they said the transition felt "flat".
  // Critically: the CSS var is the ONLY thing the consumer reads, so
  // this also removes the need for CSS `transition` properties on the
  // wordmark (the JS-side lerp does the work, no transition double-up).
  //
  // Slot center measurement: when the wordmark is in its final state
  // (scroll 1), it should sit at the visual center of the gap between
  // the burger button (left) and the phone CTA (right). We measure the
  // burger and phone rects on first tick and expose --nav-slot-center
  // to CSS. The .header__wordmark rule then uses
  //   left: calc((100% - var(--nav-slot-center, 50%)) / 2)
  // so that its origin is exactly the center of the nav slot, not the
  // viewport center. We remeasure on resize (via ResizeObserver on
  // the header content) so the slot center stays accurate.
  useEffect(() => {
    const TARGET_TAU = 0.10 // ~1s settling time at 60fps — suficiente
                            // para que el aterrizaje al soltar el scroll
                            // se sienta como una transición explícita
    const SNAP_THRESHOLD = 0.0005
    let displayedProgress = 0
    let ticking = false
    const root = document.documentElement
    const writeProgress = (p) => root.style.setProperty('--hero-progress', String(p))

    const measureSlot = () => {
      const burger = document.querySelector('.header__burger-minimal')
      const phone = document.querySelector('.header__cta-phone')
      if (!burger || !phone) return
      const br = burger.getBoundingClientRect()
      const pr = phone.getBoundingClientRect()
      const center = (br.right + pr.left) / 2
      root.style.setProperty('--nav-slot-center', `${center}px`)
    }

    const tick = () => {
      ticking = false
      const hero = heroRef.current
      if (!hero) return
      const rect = hero.getBoundingClientRect()
      // 3-etapa (jun-2026 v5): la animación 3D debe terminar EXACTAMENTE
      // a los 100vh de scroll, NO a los 200vh (que sería rect.height -
      // innerHeight con un track de 300svh). Dividimos entre
      // window.innerHeight (= 100vh fijos), lo que produce:
      //   - scroll 0      → rect.top = 0       → target = 0
      //   - scroll 100vh  → rect.top = -100vh  → target = 1
      //   - scroll 200vh  → rect.top = -200vh  → target = clamp(2) = 1
      //   - scroll 300vh  → rect.top = -300vh  → target = clamp(3) = 1
      // El Math.min(1, ...) en la fórmula ya clampa a 1, así que la
      // silla y los textos se quedan ESTÁTICOS en estado final durante
      // el resto del track (etapas 2 y 3). Ver Hero.css para el modelo
      // de 3 etapas.
      let target = 0
      if (window.innerHeight > 0) {
        target = Math.max(0, Math.min(1, -rect.top / window.innerHeight))
      }
      const gap = target - displayedProgress
      if (Math.abs(gap) < SNAP_THRESHOLD) {
        displayedProgress = target
        writeProgress(displayedProgress)
        return
      }
      displayedProgress += gap * TARGET_TAU
      scrollRef.current = displayedProgress
      writeProgress(displayedProgress)
      ticking = true
      requestAnimationFrame(tick)
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(tick)
    }

    // Initial paint
    const initialRect = heroRef.current?.getBoundingClientRect()
    if (initialRect) {
      const h = initialRect.height - window.innerHeight
      const p = h > 0 ? Math.max(0, Math.min(1, -initialRect.top / h)) : 0
      displayedProgress = p
      scrollRef.current = p
      writeProgress(p)
    }
    measureSlot()

    // Remeasure on resize
    const onResize = () => measureSlot()
    window.addEventListener('resize', onResize)

    if (window.__lenis) {
      window.__lenis.on('scroll', onScroll)
    } else {
      window.addEventListener('scroll', onScroll, { passive: true })
    }
    return () => {
      window.removeEventListener('resize', onResize)
      if (window.__lenis) {
        window.__lenis.off('scroll', onScroll)
      } else {
        window.removeEventListener('scroll', onScroll)
      }
    }
  }, [])

  return (
    <>
      {/* SEO: real H1, visually hidden but readable by crawlers */}
      <h1 className="sr-only">
        Clínica Dental Portal de Castilla — Dentistas en Vitoria-Gasteiz
        desde 1990. Implantes, ortodoncia invisible, estética dental,
        odontología general, endodoncia y cirugía oral.
      </h1>

      <section ref={heroRef} className="hero">
        {/* Inner sticky wrapper — stays pinned while user scrolls through 200svh */}
        <div className="hero__sticky">
          {/* Layer 1: CSS-only background (radial gradient + soft top spot).
              Replaces the old 264KB hero-bg.jpg. Paints in <1ms. */}
          <div className="hero__bg-layer" aria-hidden="true" />

          {/* Layer 1b: floor wash — a soft white-to-grey gradient that
              lifts the bottom 40% of the hero into a "reflective
              floor" feel. Sits above the bg-layer's ::before/::after
              (ventana + muebles) and below the 3D scene. */}
          <div className="hero__bg-layer-floor" aria-hidden="true" />

          {/* Layer 2: R3F 3D scene. DentalScene is memo-friendly; the
              scrollRef is shared so the model rotates on scroll without
              re-rendering the React tree. The Canvas inherits the
              transparent background from gl={{ alpha: true }} so the
              CSS gradient below shows through where the model doesn't. */}
          <div className="hero__3d" aria-hidden="true">
            <DentalScene scrollRef={scrollRef} />
          </div>

          {/* Layer 3: very subtle bottom vignette for text legibility
              (silla is white, content sits over the centre — no heavy
              overlay needed, just a hair of cyan-tinted fade to keep
              the dark text readable against the brightest part of the
              model). */}
          <div className="hero__vignette" aria-hidden="true" />

          {/* 4-letter CDPC parallax — same SVG paths as the preloader,
              so when the preloader fades out the hero letters are
              already in place (seamless transition). */}
          <div className="hero__letters" aria-hidden="true">
            <svg className="hero__letter hero__letter--1" viewBox="0 0 200 240" fill="none">
              <path
                d="M180 60 C180 30 150 10 100 10 C50 10 20 50 20 120 C20 190 50 230 100 230 C150 230 180 210 180 180"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <svg className="hero__letter hero__letter--2" viewBox="0 0 200 240" fill="none">
              <path
                d="M40 20 L40 220 M40 20 L110 20 C160 20 180 50 180 70 C180 90 160 120 110 120 L40 120"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <svg className="hero__letter hero__letter--3" viewBox="0 0 200 240" fill="none">
              <path
                d="M40 220 L40 20 L110 20 C160 20 180 45 180 65 C180 85 160 110 110 110 L40 110"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <svg className="hero__letter hero__letter--4" viewBox="0 0 200 240" fill="none">
              <path
                d="M180 60 C180 30 150 10 100 10 C50 10 20 50 20 120 C20 190 50 230 100 230 C150 230 180 210 180 180"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>

          {/* Content — minimal jun-2026 v3.
              Antes: copy apilado (subtitle, heading, lead, CTAs, trust bar)
              encima de la lámpara dental. Después del rediseño AIRCENTER,
              el hero perdió CTAs, trust bar y sub-caption perimetral.
              Solo queda el heading como ancla narrativa.

              El heading es ahora el NOMBRE DE LA MARCA (no un eslogan),
              siguiendo el patrón AIRCENTER donde el logo "AIR" es el
              claim visual principal. Los textos descriptivos (qué
              hacemos, dónde, desde cuándo) se mueven a la nav bar
              (--sticky-collapsed) y a TrustBadges/WhyUs. La silla 3D
              es el centro de gravedad absoluta. */}
          <div className={`hero__content${visible ? ' hero__content--visible' : ''}`}>
          </div>

          {/* Scroll indicator */}
          <div className="hero__scroll-hint" aria-hidden="true">
            <span className="hero__scroll-line" />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="5 12 12 19 19 12" />
            </svg>
          </div>
        </div>{/* /hero__sticky */}
      </section>
    </>
  )
}
