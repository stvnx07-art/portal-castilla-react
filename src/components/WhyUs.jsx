import { TrustBadges } from './TrustBadges'

const cards = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="20"/>
        <polyline points="24 14 24 24 32 28"/>
      </svg>
    ),
    heading: '35+ años de experiencia',
    body: 'Desde 1990 ofreciendo a nuestros pacientes las alternativas más adecuadas y convenientes para la resolución de sus problemas bucodentales.',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 4 L44 14 L44 34 L24 44 L4 34 L4 14 Z"/>
        <polyline points="24 18 24 24 30 28"/>
      </svg>
    ),
    heading: 'Clínica independiente',
    body: 'No formamos parte de ninguna cadena ni grupo empresarial. Nuestras decisiones son médicas, no financieras. Tu salud es nuestra prioridad.',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 36 L14 28 Q14 20 24 20 Q34 20 34 28 L34 36"/>
        <path d="M20 36 L20 28 Q20 24 24 24"/>
        <circle cx="24" cy="14" r="6"/>
      </svg>
    ),
    heading: 'Equipo colegiado',
    body: 'Profesionales sanitarios colegiados en Álava con formación continua. Cada paciente recibe atención personalizada y un diagnóstico detallado.',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 34 Q8 16 24 16 Q40 16 40 34"/>
        <path d="M14 34 Q14 22 24 22 Q34 22 34 34"/>
        <path d="M20 34 L20 28"/>
        <path d="M28 34 L28 28"/>
      </svg>
    ),
    heading: 'Tecnología y trato',
    body: 'Invertimos en tecnología odontológica de última generación sin perder el trato cercano y la confianza que nos define desde 1990.',
  },
]

export function WhyUs() {
  return (
    <section className="whyus section ui-light" id="nosotros">
      <div className="container">
        {/* TrustBadges integrado como header visual (jun-2026 v5):
            antes vivía entre <Hero /> y <WhyUs /> en App.jsx, lo que
            introducía ~100px de gap entre el final del hero (200vh) y
            el inicio de WhyUs. Al integrarlo aquí, el componente sigue
            visible pero ahora forma parte del flujo continuo de WhyUs,
            que es la sección que cubre al hero durante la 3a etapa de
            la cortina (200vh→300vh del scrollover). El CSS de
            .trust-badges se anula parcialmente cuando está dentro de
            .whyus (sin border-bottom, padding reducido) para que se vea
            como un header de WhyUs, no como una sección independiente. */}
        <TrustBadges />
        <div className="whyus__header aos">
          <p className="caption">Por qué elegirnos</p>
          <h2 className="heading-lg" style={{ marginTop: 12, color: 'var(--c-black)' }}>
            Tu dentista<br />de confianza
          </h2>
        </div>
        <div className="whyus__grid">
          {cards.map((card, i) => (
            <div key={i} className={`whyus__card aos aos-delay-${i + 1}`}>
              <div className="whyus__card-icon">{card.icon}</div>
              <h3 className="whyus__card-heading">{card.heading}</h3>
              <p className="whyus__card-body">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
