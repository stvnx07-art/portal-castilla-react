import { useState } from 'react'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    email: '',
    servicio: '',
    mensaje: '',
  })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="contact-section section" id="contacto">
        <div className="contact-section__inner">
          <div className="form-success">
            <div className="form-success__icon">
              <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="28" cy="28" r="24"/>
                <polyline points="18 28 24 34 38 22"/>
              </svg>
            </div>
            <h3 className="form-success__heading">¡Mensaje recibido!</h3>
            <p className="form-success__body">
              Te contactamos en menos de 24 horas.<br />
              Mientras tanto, puedes llamarnos al <a href="tel:+349****4099" style={{ color: 'var(--c-black)', fontWeight: 500 }}>945 144 099</a>.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="contact-section section" id="contacto">
      <div className="contact-section__inner">
        <p className="caption aos">Contacto</p>
        <h2 className="heading-lg contact-section__heading aos aos-delay-1" style={{ marginTop: 12 }}>
          Pide tu cita
        </h2>
        <p className="contact-section__subheading aos aos-delay-2">
          Primera revisión gratuita. Sin compromiso. Te llamamos en menos de 24h.
        </p>

        <form className="contact-form aos aos-delay-3" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label" htmlFor="nombre">Nombre completo</label>
              <input
                className="form-input"
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="telefono">Teléfono</label>
              <input
                className="form-input"
                type="tel"
                id="telefono"
                name="telefono"
                placeholder="+34 600 000 000"
                value={form.telefono}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              className="form-input"
              type="email"
              id="email"
              name="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="servicio">Servicio de interés</label>
            <select
              className="form-select"
              id="servicio"
              name="servicio"
              value={form.servicio}
              onChange={handleChange}
            >
              <option value="">Selecciona un servicio</option>
              <option value="implantes">Implantes dentales</option>
              <option value="ortodoncia">Ortodoncia invisible</option>
              <option value="estetica">Estética dental</option>
              <option value="general">Odontología general</option>
              <option value="endodoncia">Endodoncia</option>
              <option value="cirugia">Cirugía oral</option>
              <option value="revision">Revisión / Primera consulta</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="mensaje">Mensaje (opcional)</label>
            <textarea
              className="form-textarea"
              id="mensaje"
              name="mensaje"
              placeholder="Cuéntanos brevemente en qué podemos ayudarte..."
              value={form.mensaje}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary form-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.3"/>
                  <path d="M21 12a9 9 0 01-9 9"/>
                </svg>
                Enviando...
              </>
            ) : (
              'Enviar mensaje'
            )}
          </button>
          <p className="small-text" style={{ textAlign: 'center', marginTop: 8 }}>
            Al enviar aceptas nuestra política de privacidad
          </p>
        </form>
      </div>
    </section>
  )
}
