const steps = [
  {
    number: '01',
    heading: 'Diagnóstico',
    body: 'Estudiamos tu caso con una exploración completa y un plan personalizado. Te explicamos todas las alternativas sin prisas.',
  },
  {
    number: '02',
    heading: 'Soluciones',
    body: 'Te presentamos las diferentes opciones con presupuesto cerrado y sin sorpresas. Tú decides con toda la información.',
  },
  {
    number: '03',
    heading: 'Satisfacción',
    body: 'Tratamos con la máxima garantía de éxito. Nuestra premisa es tu felicidad — tu sonrisa es nuestro trabajo bien hecho.',
  },
]

export function Process() {
  return (
    <section className="process section ui-light" id="proceso">
      <div className="container">
        <div className="process__header">
          <p className="caption aos">Cómo trabajamos</p>
          <h2 className="heading-lg aos aos-delay-1" style={{ marginTop: 12 }}>
            Tres pasos<br />hacia tu sonrisa
          </h2>
        </div>
        <div className="process__steps">
          {steps.map((step, i) => (
            <div key={i} className={`process-step aos aos-delay-${i + 1}`}>
              <div className="process-step__number">{step.number}</div>
              <h3 className="process-step__heading">{step.heading}</h3>
              <p className="process-step__body">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
