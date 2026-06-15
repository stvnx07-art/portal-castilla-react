# Portal de Castilla — Landing React

Landing premium para **Clínica Dental Portal de Castilla** (Vitoria-Gasteiz) construida con Vite + React, aplicando el design system extraído de `aircenter.space` (Vide Infra).

**Estado:** ✅ Auditado y funcional — 13/06/2026

---

## Quick start

```bash
cd /Users/stvnx10/portal-castilla-react
npm install        # solo la primera vez
npm run dev        # arranca en http://localhost:3001
npm run build      # build producción → dist/
npm run preview    # preview del build
```

> **Puerto fijo 3001** — el 3000 lo tiene otro proyecto.

---

## Stack

| Capa | Tech |
|---|---|
| Build | Vite 5 |
| UI | React 19 (JSX, sin TypeScript) |
| Estilos | CSS plano (sin Tailwind ni CSS-in-JS) |
| Fuentes | Onest via Google Fonts (preload) |
| Imágenes | `mmx-cli` (MiniMax image generate) — todas en `public/img/` |
| Linter | ESLint flat config |

**Sin** GSAP, sin Framer Motion, sin Barba.js. Solo React + CSS transitions + IntersectionObserver. Ver `src/components/Hero.css` línea 1 para la nota sobre la decisión de performance.

---

## Arquitectura de 3 capas (patrón aircenter)

El hero de aircenter.space (descrito en `~/hermes-audit/aircenter/reports/HERO-DEEP-DIVE.md`) tiene 3 capas anidadas con sticky + parallax. Lo replicamos aquí:

```
1. PRELOADER (App.jsx)
   └─ 4 letras SVG "CDPC" con offsets 76.6% / 38.5% / 0% / -38.5%
      Fade-out 2s con cubic-bezier(0.7, 0, 0.3, 1)
      Body overflow:hidden mientras está activo

2. HEADER 3-ESTADOS (useHeaderScroll + Header.jsx)
   └─ top  →  sticky  →  sticky-collapsed
      Background blanco entra desde translateY(-102%) con 1.2s
      Counter pill "01/08" en top-left
      CTA "945 144 099" con icono que rota 90° al hover

3. HERO 200svh con inner sticky wrapper
   └─ .hero (200svh, position:relative) — crea el dwell time
      └─ .hero__sticky (position:sticky; top:0; height:100svh)
         ├─ .hero__bg (imagen, scale 1.08→1 ken-burns)
         ├─ .hero__overlay (negro 35%)
         ├─ .hero__tint (radial-gradient blanco al 92%)
         ├─ .hero__letters (4 SVG con parallax por --hero-progress)
         ├─ .hero__content (centrado, fade-out por --hero-progress)
         └─ .hero__scroll-hint (línea animada, pinned al bottom)
```

---

## Sistema de temas (zero-JS)

Definido en `src/index.css` con 13 tokens CSS bajo `.ui-light` y `.ui-dark`. Aplicado a cada `<section>` como clase:

| Sección | Tema | Por qué |
|---|---|---|
| `Hero` | (default dark via bg) | Imagen oscura de fondo |
| `WhyUs` | `ui-light` | Recepción blanca |
| `Services` | `ui-dark` | Cards negros |
| `Process` | `ui-light` | Fondo blanco |
| `Team` | `ui-dark` | Fotos con fondo negro |
| `Testimonials` | `ui-light` | Fondo blanco |
| `FAQ` | `ui-light` | Fondo blanco |
| `Location` | `ui-light` | Fachada + mapa |
| `ContactForm` | (light) | Formulario claro |
| `Footer` | (dark) | Footer negro |

**Cambiar tema** = cambiar la clase del section. Cero JS.

---

## Bugs conocidos y arreglados (lecciones aprendidas)

### ✅ BUG #1 — Hero `position:sticky` con `display:flex` rompía el centrado
- **Síntoma:** H1 pegado a la derecha, imagen de fondo cubría solo la mitad izquierda, tinte radial era una mancha gigante
- **Causa:** `position:sticky` con `display:flex; align-items:center` se dimensionaba al contenido, no al viewport
- **Fix:** wrap interno `.hero__sticky {position:sticky; top:0; width:100%; height:100svh}` + hijos con `{position:absolute; left:0; width:100%; height:100%}`
- **Lección:** NUNCA `position:sticky` + flex mixto con hero. Usar sticky wrapper + hijos absolute.

### ✅ BUG #2 — `useScrollReveal` no enganchaba `.aos` tardíos
- **Síntoma:** 0/42 elementos `.aos` visibles en algunos navegadores
- **Causa:** El observer se montaba en `App.jsx` con `useEffect`, pero los componentes con `.aos` (Hero, etc.) se montaban después
- **Fix:** añadir `MutationObserver` para re-enganchar nuevos `.aos` + `requestAnimationFrame` en mount + fallback de 4s
- **Lección:** NUNCA `IntersectionObserver` mount único. Usar MutationObserver para auto-curarse.

### ✅ BUG #3 — Imágenes `loading="lazy"` no cargaban al top
- **Síntoma:** Recuadros negros vacíos en Services y Team al cargar la página
- **Causa:** El navegador solo carga imágenes lazy si están en viewport; el usuario al cargar estaba en y=0 y las imágenes estaban a y=2500+
- **Fix:** (1) quitar `loading="lazy"` de 7 imágenes críticas, (2) añadir `<link rel="preload" as="image">` para 8 imágenes en `index.html`
- **Lección:** Lazy solo en imágenes debajo de 2x viewport. Las críticas van con preload.

### ✅ BUG #4 — Hero con copy genérico sobre escena 3D
- **Síntoma:** Subtítulo, heading y lead apilados en el centro, **encima** de la lámpara dental. El ojo no sabía dónde mirar; el copy no se sentía coherente con la escena
- **Causa:** Layout centrado heredado (vino del patrón "imagen estática + texto encima") aplicado a un hero 3D donde la lámpara dental es el objeto más brillante de la escena
- **Fix (jun-2026, 3 iteraciones):**
  1. **v1 → v2:** paredes del consultorio pasaron de slate oscuro (`#475569`) a casi-blanco (`#F2F4F6`); la silla pasó a paleta unificada oscura (`--c-ink`/`--c-ink-2`). Reubicación perimetral del copy (patrón AIRCENTER).
  2. **v2 → v3:** simplificación máxima — solo el nombre de marca como heading (`PORTAL / DE CASTILLA`). Sin CTAs, sin trust bar, sin caption en el hero. El caption temático "Cuidando sonrisas en VG desde 1990" migra a la nav bar en estado `--sticky-collapsed`.
  3. **v3 → v3 final:** la silla pasa de azul acero medio (`#557C99`) a **gris-azul claro** (`#B8C4D0`) — "blanco obvio sin serlo". El heading `#3D5266` (azul oscuro) se convierte en el peso visual principal; la silla es el cuerpo, no la voz. Las luces del ChairCanvas se reducen (key 3.0→2.2, env 0.15→0.04) para no lavar la pieza clara.
- **Lección:** ❌ NO resolver problemas de jerarquía visual con más contraste tipográfico (oscurecer/bold). El usuario lo lee como "el texto grita más fuerte, pero sigue gritando sobre el objeto". ✅ SÍ recomponer la escena para que el objeto central destaque, y reubicar los textos perimetralmente. La paleta del proyecto (cyan + ink) debe permear las decisiones 3D, no ser "solo de la UI".
- **Archivos modificados:** `Hero.jsx`, `Hero.css`, `DentalScene.jsx`, `index.css` (header logo), `src/components/README.md` (sección "Rediseño del hero"), `src/components/Hero.README.md` (nuevo), `src/components/DentalScene.README.md` (nuevo).

### ✅ BUG #5 — Fade-on-scroll del hero no se aplicaba a los hijos
- **Síntoma:** Al hacer scroll al 80% del hero, el wrapper del contenido tenía `opacity: 0.42` (correcto) pero los hijos (subtitle, heading, lead, CTAs) seguían a `opacity: 1`. El usuario veía el contenedor desvanecerse y los textos "saltando +31.6px hacia abajo" sin desaparecer.
- **Causa:** CSS conflict — la opacity del wrapper se computaba vía `calc()` con `var(--hero-progress)`, pero los hijos tenían su propio `transition: opacity 0.8s` con `opacity: 1` cuando `.hero__content--visible` se aplicaba. La especificidad del selector `.hero__content--visible > *` ganaba sobre la del wrapper, dejando a los hijos con opacity 1 permanente.
- **Fix:** mover `opacity: calc(1 - var(--hero-progress, 0) * 1.5) !important` del wrapper a los hijos directos, con `!important` para que gane sobre el fill-mode de la entry animation. La entry animation ahora se hace con `@keyframes hero-content-in` (one-shot 0.8s) en vez de `transition`, para no chocar con la actualización frame-by-frame de `--hero-progress`.
- **Lección:** cuando un fade-on-scroll se aplica a N hijos, NO se hace en el wrapper (los hijos pueden tener su propia opacity que gana por especificidad). Aplicar el fade directamente a cada hijo.

### ✅ BUG #6 — Trust bar del hero duplicaba "35+ años" 3x
- **Síntoma:** "35+ años" aparecía 3 veces en la página: (1) hero trust bar centrada, (2) TrustBadges stat-tile, (3) WhyUs card "35+ años de experiencia".
- **Causa:** copy de prueba social escrito en cada sección sin coordinar. La trust bar del hero venía del patrón "hero template" genérico.
- **Fix:** eliminar el `<div className="hero__trust">` del JSX. La prueba social del hero se mueve al sub-caption perimetral (abajo-derecha) como "VG · 4.7★ · Clínica independiente". Las menciones en TrustBadges y WhyUs se mantienen porque son formatos visuales distintos (stat-tile y card con descripción).
- **Lección:** la prueba social es **un activo compartido**, no algo que se duplica por sección. Definirla UNA vez y referenciarla. Si dos secciones la necesitan, variar el formato (perimetral vs stat-tile vs card), no repetirla.

### ✅ BUGS MÓVILES (jun-2026) — auditoría responsive completa
Auditoría mobile exhaustiva (375px viewport + 320px iPhone SE + 768px tablet portrait + 1024px breakpoint). 9 bugs mobile corregidos en `Hero.css` + `index.css`. Resumen:

| ID | Bug | Severidad | Fix |
|---|---|---|---|
| #M1 | Hero wordmark "PORTAL DE CASTILLA" se cortaba a "L DE CASTILLA" en 375px | 🔴 Crítico | Reducir `font-size` 5vw→4.2vw y `letter-spacing` 2.4vw→1.6vw en `@media (max-width: 567px)`. Permitir wrap a 2 líneas en `<380px` (iPhone SE 1ª gen, Galaxy A). |
| #M2 | Header sin background en estado `--sticky` y `--sticky-collapsed` → el wordmark se montaba visiblemente sobre el contenido scrolleado (servicios, equipo, testimonios) | 🔴 Crítico | Añadir `background: rgba(255,255,255,0.78)` + `backdrop-filter: blur(12px) saturate(180%)` a `.header--sticky` y `.header--sticky-collapsed`. Estado `--top` queda transparente (AIRCENTER pattern: el header es invisible sobre el hero, se materializa al scrollear). |
| #M3 | Header wordmark estado 2 desbordaba `x: -115, right: 257` (375px) por la interpolación desktop `transform: translate(50vw - 71 - 50%)` que producía translate negativo | 🔴 Crítico | En `@media (max-width: 767px)`: `left: 56px, transform: none, font-size: 12px, color: --c-ink, font-weight: 500, opacity: 1`. Mismo tratamiento a `@media (min-width: 768px) and (max-width: 1023px)` con `left: 84px, font-size: 14px`. Decisión de producto: en mobile el wordmark SIEMPRE se queda en la navbar, no interpola al estado hero grande centrado. |
| #M4 | Service cards 397×627px (77vh) — imagen ocupaba 80% del card, layout estirado verticalmente | 🟠 Importante | `@media (max-width: 767px)`: padding `48px 40px`→`32px 24px`, image aspect `4/3`→`16/9` (más compacto), margin negativo ajustado a la nueva padding. Resultado: card 327×~440px (54vh), 1.3 cards por viewport en vez de 0.6. |
| #M5 | `@media (max-width: 567px) .service-card__media` sobrescribía los valores con el `-48px -40px` desktop (¡bug heredado del refactor anterior!) | 🟠 Importante | Reemplazar la regla heredada con la versión mobile-tuned: `margin: -24px -16px 20px, width: calc(100% + 32px)`. El bug existía pero estaba tapado por la regla desktop 1024 que aplicaba `repeat(2, 1fr)` — al pasar a 1fr mobile, se hacía visible. |
| #M6 | Process step `padding: 56px 48px` → step 327×400px (mucho dead air) | 🟠 Importante | `@media (max-width: 767px)`: `36px 28px`, número font 72→56px. `@media (max-width: 480px)`: `28px 20px`. |
| #M7 | FAQ items ya responsive — verificado, no requería cambio. Wordmark se montaba sobre items (cubierto por #M2) | ✅ Resuelto por #M2 | — |
| #M8 | Location grid gap 80px y `__map` aspect 3/2 (218px alto en 327px ancho) | 🟡 Menor | `@media (max-width: 767px)`: gap 24px, `__map` + `__media` aspect 4/3. |
| #M9 | ContactForm altura 640px parecía incompleta — falso positivo (auditoría midía `__form`, no la section completa) | ✅ Falso positivo | La section es 926px y contiene 5 inputs + textarea + botón correctamente. |

**Resultado final del audit mobile (375px):**
- `vw: 375, scrollW: 375, offenders: 0` — cero overflow horizontal
- Mismo resultado en 320px (iPhone SE), 375px (iPhone), 768px (tablet portrait)
- Todas las secciones 100% ancho, layout 1-col en `<768px`
- Header glass + wordmark pequeño desde la primera carga del hero (no interpolación)
- Service cards 1.3/veces viewport (antes 0.6)
- Section paddings reducidos de 120px a 64px en mobile (ritmo más denso)
- Hero wordmark se ve COMPLETO a 375px (antes cortado)
- Wordmark del header NUNCA se monta sobre contenido (siempre sobre fondo glass)

**Archivos modificados:** `Hero.css` (responsive hero + wordmark 2-line wrap), `index.css` (header background + wordmark mobile override + service card 567px bug + process step + whyus card + section paddings + location gap/aspect).

**Lección:** la interpolación CSS de múltiples propiedades (transform, font-size, color, font-weight) sobre un mismo elemento entre dos estados es elegante en desktop (>=1024px) pero se rompe en mobile cuando el viewport no tiene espacio para el "viaje" entre estados. **Para mobile, fijar un solo estado** (en este caso: navbar siempre) y dejar el otro estado solo para desktop es la solución más robusta. El AIRCENTER pattern se preserva en desktop.

---

## Auditoría visual — protocolo obligatorio

**SIEMPRE** antes de declarar una tarea como terminada:

1. `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/` → debe ser 200
2. `browser_navigate` a `http://localhost:3001/`
3. `terminal` con `sleep 6` (para que termine el preloader + carguen imágenes)
4. `browser_console` con expresión: `Array.from(document.images).filter(i => i.complete && i.naturalWidth > 0).length + '/' + document.images.length` → debe ser 9/9
5. `browser_vision` para captura visual
6. Scroll programático al bottom para verificar secciones finales
7. Verificar consola sin errores

---

## Estructura

```
portal-castilla-react/
├── README.md                   ← este archivo
├── index.html                  ← preload de imágenes críticas
├── package.json                ← vite + react 19
├── vite.config.js
├── eslint.config.js
├── public/                     ← assets estáticos servidos en /
│   ├── favicon.svg
│   ├── icons.svg               ← sprite SVG (no usado actualmente)
│   ├── schema.json             ← schema.org Dentist para SEO
│   └── img/                    ← 9 imágenes generadas con mmx
│       ├── README.md           ← descripción de cada imagen
│       ├── hero-bg.jpg
│       ├── clinica-fachada.jpg
│       ├── clinica-recepcion.jpg
│       ├── service-implantes.jpg
│       ├── service-ortodoncia.jpg
│       ├── service-estetica.jpg
│       ├── team-director.jpg
│       ├── team-odontologa-1.jpg
│       ├── team-odontologa-2.jpg
│       └── og-image.jpg
└── src/
    ├── README.md               ← estructura de src/
    ├── main.jsx                ← entry point
    ├── App.jsx                 ← composición: Preloader + Header + secciones
    ├── App.css                 ← (vacío, reservado)
    ├── index.css               ← estilos globales, design tokens, theme
    ├── assets/                 ← (vacío)
    ├── hooks/
    │   ├── README.md           ← descripción de cada hook
    │   ├── usePreloader.js
    │   ├── useHeaderScroll.js
    │   └── useScrollReveal.js
    └── components/
        ├── README.md           ← descripción de cada componente
        ├── Preloader.jsx
        ├── Header.jsx
        ├── Hero.jsx
        ├── Hero.css
        ├── TrustBadges.jsx
        ├── WhyUs.jsx
        ├── Services.jsx
        ├── Process.jsx
        ├── Team.jsx
        ├── Testimonials.jsx
        ├── FAQ.jsx
        ├── Location.jsx
        ├── ContactForm.jsx
        └── Footer.jsx
```

---

## Memoria persistente (engram)

Contexto del proyecto guardado en engram (IDs 95-102, proyecto: `portal-castilla`):
- `#95` arquitectura general
- `#96` stack y comandos
- `#97` arquitectura 3 capas (preloader/header/hero)
- `#98` bug #1 hero sticky
- `#99` bug #2 useScrollReveal
- `#100` bug #3 imágenes lazy
- `#101` sistema de temas
- `#102` convenciones del proyecto

Para buscar: `engram search portal-castilla --project portal-castilla`
Para guardar nuevo contexto: `engram save "titulo" --project portal-castilla --type <bug|architecture|convention|reference>`

---

## Próximos pasos (pendiente)

- [ ] Implementar formulario de contacto funcional (POST a GAS backend)
- [ ] Añadir 4 landings de servicio (implantes, ortodoncia, estética, urgencias)
- [ ] Blog con calendario editorial mensual
- [ ] Integración con Google Reviews (widget)
- [ ] Schema.org LocalBusiness/Dentist completo (ya hay borrador en `public/schema.json`)
- [ ] Migración a WordPress si el cliente lo aprueba (vs quedarse en React SPA)
- [ ] Lighthouse audit (perf > 90, a11y > 95, SEO > 95, best practices > 95)
