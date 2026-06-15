import { useRef } from 'react'
import { useParallaxImage } from '../hooks/useParallaxImage'

export function Location() {
  /* Slightly stronger parallax for the fachada image (28px) —
     it's the biggest image on the page and the parallax really
     sells the "premium travel-brochure" feeling. */
  const fachadaRef = useRef(null)
  useParallaxImage(fachadaRef, 28)

  return (
    <section className="location section ui-light" id="ubicacion">
      <div className="container">
        <div className="location__grid">
          <div className="location__media aos" ref={fachadaRef}>
            <img
              src="/img/clinica-fachada.jpg"
              alt="Fachada de la Clínica Dental Portal de Castilla en Calle Portal de Castilla 82, Vitoria-Gasteiz"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="location__map aos aos-delay-1">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2901.1!2d-2.6912052!3d42.8398504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd5a74f0b4a4f5a5%3A0x0!2sCalle%20Portal%20de%20Castilla%2C%2082%20bajo%2C%2001007%20Vitoria-Gasteiz!5e0!3m2!1ses!2ses!4v1718300000000!5m2!1ses!2ses"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Clínica Dental Portal de Castilla"
            />
          </div>
          <div className="location__info">
            <div className="aos">
              <p className="caption" style={{ marginBottom: 16 }}>Dónde estamos</p>
              <h2 className="heading-md" style={{ marginBottom: 24 }}>
                En el corazón<br />del Ensanche
              </h2>
              <p className="body-text">
                Estamos en el barrio más céntrico de Vitoria-Gasteiz,
                bien comunicado y con parking cercano.
              </p>
            </div>

            <div className="aos aos-delay-1">
              <div className="location__detail">
                <span className="location__detail-label">Dirección</span>
                <span className="location__detail-value">
                  Calle Portal de Castilla, 82 bajo<br />
                  01007 Vitoria-Gasteiz, Álava
                </span>
              </div>
            </div>

            <div className="aos aos-delay-2">
              <div className="location__detail">
                <span className="location__detail-label">Teléfono</span>
                <span className="location__detail-value">
                  <a href="tel:+34945144099">945 144 099</a>
                </span>
              </div>
            </div>

            <div className="aos aos-delay-3">
              <div className="location__detail">
                <span className="location__detail-label">Horario</span>
                <div className="location__hours">
                  <span className="location__hours-day">Lunes – Jueves</span>
                  <span className="location__hours-time">09:00 – 20:00</span>
                  <span className="location__hours-day">Viernes</span>
                  <span className="location__hours-time">09:00 – 18:00</span>
                  <span className="location__hours-day">Sábado – Domingo</span>
                  <span className="location__hours-time">Cerrado</span>
                </div>
              </div>
            </div>

            <div className="aos aos-delay-4">
              <a
                href="https://maps.google.com/?q=Calle+Portal+de+Castilla+82+Vitoria-Gasteiz"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                </svg>
                Cómo llegar
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
