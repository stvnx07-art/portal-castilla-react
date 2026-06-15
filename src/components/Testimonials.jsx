const testimonials = [
  {
    text: '"Llevo más de 10 años siendo paciente y el trato siempre ha sido excepcional. Profesionales de verdad, sin prisas y explicando cada tratamiento con detalle."',
    name: 'Cristina J.R.',
    source: 'Google Maps',
  },
  {
    text: '"Fui por una urgencia un sábado y me atendieron enseguida. La confianza que transmite el equipo es impagable. Totalmente recomendable."',
    name: 'Miguel A.L.',
    source: 'Google Maps',
  },
  {
    text: '"Mi hija tiene miedo al dentista desde pequeña. Aquí la trataron con una paciencia increíble. Ahora hasta viene contenta. Eso no tiene precio."',
    name: 'Laura G.P.',
    source: 'TopDentistas',
  },
]

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

export function Testimonials() {
  return (
    <section className="testimonials section ui-light" id="testimonios">
      <div className="container">
        <div className="testimonials__header">
          <p className="caption aos">Testimonios</p>
          <h2 className="heading-lg aos aos-delay-1" style={{ marginTop: 12 }}>
            Lo que dicen<br />los pacientes
          </h2>
        </div>
        <div className="testimonials__grid">
          {testimonials.map((t, i) => (
            <div key={i} className={`testimonial-card aos aos-delay-${i + 1}`}>
              <div className="testimonial-card__stars">
                {[...Array(5)].map((_, si) => <StarIcon key={si} />)}
              </div>
              <p className="testimonial-card__text">{t.text}</p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="testimonial-card__name">{t.name}</p>
                  <p className="small-text" style={{ marginTop: 2, fontSize: 10 }}>{t.source}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
