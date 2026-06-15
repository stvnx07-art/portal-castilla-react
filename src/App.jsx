import { useLenis } from './hooks/useLenis'
import { useScrollReveal } from './hooks/useScrollReveal'
import { Preloader } from './components/Preloader'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { WhyUs } from './components/WhyUs'
import { Services } from './components/Services'
import { Process } from './components/Process'
import { Team } from './components/Team'
import { Testimonials } from './components/Testimonials'
import { FAQ } from './components/FAQ'
import { Location } from './components/Location'
import { ContactForm } from './components/ContactForm'
import { Footer } from './components/Footer'

export default function App() {
  useLenis()
  useScrollReveal()

  return (
    <>
      <Preloader />
      <Header />
      <main>
        <Hero />
        <WhyUs />
        <Services />
        <Process />
        <Team />
        <Testimonials />
        <FAQ />
        <Location />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
