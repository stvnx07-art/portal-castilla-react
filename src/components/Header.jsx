import { useState, useEffect } from 'react'
import { useHeaderScroll } from '../hooks/useHeaderScroll'

export function Header() {
  const { state } = useHeaderScroll()
  const [menuOpen, setMenuOpen] = useState(false)
  // wordmark enter state — driven by preloader:done so the wordmark
  // handoff from the preloader logo is seamless. Initial 'hidden'
  // (opacity 0, translateY, blur) → 'visible' (final state 1, hero).
  // See .header__wordmark and .header__wordmark__chunk in index.css.
  const [wordmarkEnter, setWordmarkEnter] = useState('hidden')

  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [menuOpen])

  // Preloader handoff: keep the wordmark hidden until the preloader
  // dispatches its fade-out event (at 80% through the 1.2s slide-apart,
  // so the wordmark rise is already mid-flight when the preloader
  // finishes and the user sees the hero). Reduced-motion users skip
  // straight to visible (the preloader hook dispatches the same event
  // in that branch, but we still render hidden for one tick — which is
  // fine because the transition is 0ms for them via the media query
  // override in CSS).
  useEffect(() => {
    const onPreloaderDone = () => {
      // One rAF delay so the browser commits the initial 'hidden'
      // styles (opacity 0, translateY, blur) before the transition
      // kicks in. Without this, the state change would apply during
      // the same paint and the browser would skip the transition.
      requestAnimationFrame(() => setWordmarkEnter('visible'))
    }
    window.addEventListener('preloader:done', onPreloaderDone, { once: true })
    // Safety net: if preloader hook ever fails to dispatch, surface
    // the wordmark after 4s so the hero is never blank.
    const safety = setTimeout(onPreloaderDone, 4000)
    return () => {
      window.removeEventListener('preloader:done', onPreloaderDone)
      clearTimeout(safety)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      {/* Wordmark — single visible element during the hero scroll.
          Position/size/letter-spacing interpolated by .header__wordmark
          in index.css from a full-width centered hero wordmark (state 1,
          --hero-progress = 0) to a compact navbar-slot label sitting
          next to the burger (state 2, --hero-progress = 1). The JSX
          here only carries the static text + accessibility label.

          Enter transition: hidden (opacity 0, translateY 60px, blur
          12px) → visible (state 1). The 3 chunks (PORTAL | DE |
          CASTILLA) stagger by 120ms each, matching the AIRCENTER
          pattern from the v4 deep-dive (motion rise + blur stagger,
          GPU-accelerated, no clip-path, no split-char). Triggered by
          the preloader:done event so the wordmark surfaces as the
          preloader logo finishes its slide-apart. */}
      <h2
        className={`header__wordmark header__wordmark--${wordmarkEnter}`}
        aria-label="Portal de Castilla"
      >
        <span className="header__wordmark__chunk header__wordmark__chunk--1">PORTAL</span>
        <span className="header__wordmark__chunk header__wordmark__chunk--2">DE</span>
        <span className="header__wordmark__chunk header__wordmark__chunk--3">CASTILLA</span>
      </h2>

      {/* Barra de navegación principal */}
      <header className={`header header--${state} ${menuOpen ? 'header--menu-open' : ''}`}>
        <div className="header__content">

          {/* 1. EXTREMO IZQUIERDO: Hamburguesa minimalista de 2 líneas */}
          <button
            type="button"
            className={`header__burger-minimal ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span />
            <span />
          </button>

          {/* 2. EXTREMO DERECHO: Teléfono con estilo de botón corporativo (Bordes redondeados uniformes) */}
          <a href="tel:+34945144099" className="header__cta-phone" aria-label="Llamar a la clínica">
            <svg className="header__cta-phone-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
            <span>945 144 099</span>
          </a>

        </div>
      </header>

      {/* OVERLAY DEL MENÚ FULLSCREEN */}
      <div
        id="mobile-menu"
        className={`menu-overlay-fullscreen ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="menu-overlay__box">
          <div className="menu-overlay__grid">

            {/* Columna de navegación */}
            <div className="menu-overlay__left-col" onClick={closeMenu}>
              <nav className="menu-overlay__nav">
                <a href="#servicios" className="menu-overlay__nav-link">Servicios</a>
                <a href="#equipo" className="menu-overlay__nav-link">Equipo</a>
                <a href="#testimonios" className="menu-overlay__nav-link">Testimonios</a>
                <a href="#ubicacion" className="menu-overlay__nav-link">Ubicación</a>
                <a href="#contacto" className="menu-overlay__nav-link">Contacto</a>
              </nav>
            </div>

            {/* Columna de info */}
            <div className="menu-overlay__right-col" onClick={closeMenu}>
              <div className="menu-contact-card">
                <h3 className="menu-contact-card__title">Contacto</h3>
                <a href="mailto:info@portaldecastilla.com" className="menu-contact-card__link">info@portaldecastilla.com</a>
                <p className="menu-contact-card__text">Portal de Castilla, Vitoria-Gasteiz</p>
                <a href="tel:+34945144099" className="menu-contact-card__link">Tlf: 945 144 099</a>
              </div>
            </div>

          </div>

          <div className="menu-overlay__footer">
            <h4 className="menu-overlay__location">VITORIA-GASTEIZ</h4>
          </div>
        </div>
      </div>
    </>
  )
}