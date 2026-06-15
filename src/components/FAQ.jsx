import { useState } from 'react'

const faqs = [
  {
    q: '¿Cuánto cuesta un implante dental en Vitoria-Gasteiz?',
    a: 'El precio de un implante dental varía según el caso. En tu primera consulta gratuita te damos un presupuesto cerrado sin sorpresas. Los precios oscilan entre 800€ y 1.500€ por implante, dependiendo de la complejidad.',
  },
  {
    q: '¿La ortodoncia invisible es adecuada para mi caso?',
    a: 'La ortodoncia invisible es eficaz para la mayoría de casos de apiñamiento leve a moderado. En tu primera visita evaluamos tu situación y te recomendamos el tratamiento más adecuado, seas o no candidato a alineadores.',
  },
  {
    q: '¿Atendéis urgencias dentales?',
    a: 'Sí. Intentamos resolver urgencias el mismo día. Llámanos al 945 144 099 lo antes posible y valoraremos si podemos atenderte de forma inmediata o programarte en las próximas horas.',
  },
  {
    q: '¿Trabajáis con seguros dentales?',
    a: 'Trabajamos con la mayoría de seguros dentales. Te recomendamos llamar antes para confirmar que trabajamos con tu mutua. En cualquier caso, podemos emitirte factura para que la reembolses con tu seguro.',
  },
  {
    q: '¿Ofrecéis financiación para los tratamientos?',
    a: 'Sí. Ofrecemos financiación a medida para tratamientos de mayor envergadura. Hablamos contigo sin compromiso para encontrar un plan de pago que se ajuste a tu situación.',
  },
  {
    q: '¿Cuál es la diferencia entre carillas de composite y de porcelana?',
    a: 'Las carillas de composite se aplican directamente en una sesión, son más económicas y reversibles. Las de porcelana son más resistentes, duraderas y estética superior, pero requieren dos visitas. Te asesramos sin compromiso sobre la mejor opción para tu sonrisa.',
  },
  {
    q: '¿Cómo funciona el blanqueamiento dental?',
    a: 'Usamos gel de peróxido bajo supervisión profesional. Puedes hacerlo en clínica en una sesión de 60-90 minutos o con férulas personalizadas en casa durante 2-3 semanas. El resultado dura 1-3 años según tus hábitos.',
  },
  {
    q: '¿Hacéis revisión gratuita?',
    a: 'Sí. Tu primera consulta de revisión es gratuita. Incluye exploración, diagnóstico y te informamos de tu situación sin ningún compromiso.',
  },
]

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className="faq-item">
      <button
        className={`faq-item__trigger ${isOpen ? 'open' : ''}`}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        {faq.q}
        <span className="faq-item__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </span>
      </button>
      <div className={`faq-item__body ${isOpen ? 'open' : ''}`}>
        <div className="faq-item__body-inner">{faq.a}</div>
      </div>
    </div>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="faq section ui-light" id="faq">
      <div className="container">
        <div className="faq__header">
          <p className="caption aos">Preguntas frecuentes</p>
          <h2 className="heading-lg aos aos-delay-1" style={{ color: 'var(--c-white)', marginTop: 12 }}>
            Respondemos<br />tus dudas
          </h2>
        </div>
        <div className="faq__list">
          {faqs.map((faq, i) => (
            <FaqItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => handleToggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
