import { useRef } from 'react'
import { useParallaxImage } from '../hooks/useParallaxImage'

const team = [
  {
    name: 'Dr. Juan Martín Esparza',
    role: 'Director y Odontólogo',
    img: '/img/team-director.jpg',
  },
  {
    name: 'Dra. Ana Martínez',
    role: 'Odontología General',
    img: '/img/team-odontologa-1.jpg',
  },
  {
    name: 'Dra. Cristina Ruiz',
    role: 'Estética y Blanqueamiento',
    img: '/img/team-odontologa-2.jpg',
  },
]

/* Subtle parallax on team portraits. 18px max — slightly less
   than services because portrait crops have less "room to move"
   without revealing the edge of the image. */
function TeamCard({ member, index }) {
  const imgRef = useRef(null)
  useParallaxImage(imgRef, 18)

  return (
    <div className={`team-card aos aos-delay-${index + 1}`}>
      <img
        ref={imgRef}
        className="team-card__image"
        src={member.img}
        alt={member.name}
        loading="lazy"
        decoding="async"
      />
      <div className="team-card__info">
        <p className="team-card__name">{member.name}</p>
        <p className="team-card__role">{member.role}</p>
      </div>
    </div>
  )
}

export function Team() {
  return (
    <section className="team section ui-dark" id="equipo">
      <div className="container">
        <div className="team__header">
          <p className="caption aos">Nuestro equipo</p>
          <h2 className="heading-lg aos aos-delay-1" style={{ color: 'var(--c-white)', marginTop: 12 }}>
            Profesionales<br />de la salud
          </h2>
        </div>
        <div className="team__grid">
          {team.map((member, i) => (
            <TeamCard key={i} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
