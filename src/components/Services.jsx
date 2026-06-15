import { useRef } from 'react'
import { useParallaxImage } from '../hooks/useParallaxImage'

const services = [
  {
    number: '01',
    heading: 'Implantes dentales',
    body: 'Recupera la funcionalidad y estética de tu sonrisa con implantes de titanio de última generación. Sustitución de una o varias piezas, o dentadura completa.',
    img: '/img/service-implantes.jpg',
  },
  {
    number: '02',
    heading: 'Ortodoncia invisible',
    body: 'Alinea tus dientes sin brackets metálicos. Tratamiento discreto y eficaz con alineadores transparentes, adaptado a tu ritmo de vida.',
    img: '/img/service-ortodoncia.jpg',
  },
  {
    number: '03',
    heading: 'Estética dental',
    body: 'Carillas, blanqueamiento y diseño de sonrisa para brillar con confianza. Mejoramos la armonía entre labios, encía y dientes.',
    img: '/img/service-estetica.jpg',
  },
  {
    number: '04',
    heading: 'Odontología general',
    body: 'Revisiones, limpiezas, empastes y prevención para mantener tu salud bucal. Diagnóstico personalizado para cada paciente.',
    img: '/img/service-general.jpg',
  },
  {
    number: '05',
    heading: 'Endodoncia',
    body: 'Salva tu diente con tratamiento de conductos de última generación y sin dolor. Técnicas modernas para una recuperación rápida.',
    img: '/img/service-endodoncia.jpg',
  },
  {
    number: '06',
    heading: 'Cirugía oral',
    body: 'Extracciones complejas, muelas del juicio y cirugía de mucosas. Actos quirúrgicos con la máxima garantía y cuidado.',
    img: '/img/service-cirugia.jpg',
  },
]

/* Subtle, premium-feeling parallax. 22px max offset — enough to
   notice when scrolling slowly, not enough to feel dizzy. */
function ServiceCard({ service, index }) {
  const imgWrapRef = useRef(null)
  useParallaxImage(imgWrapRef, 22)

  return (
    <div className={`service-card aos aos-delay-${(index % 3) + 1}`}>
      {service.img && (
        /* The ref is on the wrapping div, NOT the <img>. The
           hook sets --parallax-y on this element. The <img>
           inside reads --parallax-y in its CSS transform — so
           the parallax works without us touching the img's
           inline style (which would conflict with the hover
           scale defined in CSS). */
        <div className="service-card__media" ref={imgWrapRef}>
          <img src={service.img} alt={service.heading} loading="lazy" decoding="async" />
        </div>
      )}
      <span className="service-card__number">{service.number}</span>
      <h3 className="service-card__heading">{service.heading}</h3>
      <p className="service-card__body">{service.body}</p>
      <span className="service-card__link">
        Más información
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </span>
    </div>
  )
}

export function Services() {
  return (
    <section className="services section ui-dark" id="servicios">
      <div className="container">
        <div className="services__header">
          <p className="caption aos">Tratamientos</p>
          <h2 className="heading-lg aos aos-delay-1" style={{ color: 'var(--c-white)', marginTop: 12 }}>
            Todo lo que<br />necesitas
          </h2>
        </div>
        <div className="services__grid">
          {services.map((s, i) => (
            <ServiceCard key={i} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
