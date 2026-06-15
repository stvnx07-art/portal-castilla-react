export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <p className="footer__brand-name">Clínica Dental Portal de Castilla</p>
            <p className="footer__brand-desc">
              Cuidando sonrisas en Vitoria-Gasteiz desde 1990. Sin cadenas, sin grupos inversores — solo tú y un equipo que te conoce.
            </p>
          </div>

          <div>
            <p className="footer__col-heading">Servicios</p>
            <ul className="footer__col-links">
              <li><a href="#servicios" className="footer__col-link">Implantes dentales</a></li>
              <li><a href="#servicios" className="footer__col-link">Ortodoncia invisible</a></li>
              <li><a href="#servicios" className="footer__col-link">Estética dental</a></li>
              <li><a href="#servicios" className="footer__col-link">Odontología general</a></li>
            </ul>
          </div>

          <div>
            <p className="footer__col-heading">Clínica</p>
            <ul className="footer__col-links">
              <li><a href="#equipo" className="footer__col-link">Equipo</a></li>
              <li><a href="#nosotros" className="footer__col-link">Nosotros</a></li>
              <li><a href="#testimonios" className="footer__col-link">Testimonios</a></li>
              <li><a href="#faq" className="footer__col-link">FAQ</a></li>
            </ul>
          </div>

          <div>
            <p className="footer__col-heading">Contacto</p>
            <ul className="footer__col-links">
              <li>
                <a href="tel:+349****4099" className="footer__col-link">
                  945 144 099
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/34945144099"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__col-link"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="#contacto" className="footer__col-link">
                  Pedir cita online
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__legal">
            © 2026 Clínica Dental Portal de Castilla · Calle Portal de Castilla, 82 bajo · 01007 Vitoria-Gasteiz
          </p>
          <div className="footer__social">
            <a
              href="https://www.facebook.com/clinicaportaldecastilla"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label="Facebook"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>
            <a
              href="https://twitter.com/portaldcastilla"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label="X (Twitter)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
