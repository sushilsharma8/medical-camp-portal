import { Link } from 'react-router-dom'

const highlights = [
  {
    title: 'Free & low-cost care',
    text: 'Browse medical camps offering checkups, screenings, and consultations at no or minimal cost.',
    icon: '🩺',
  },
  {
    title: 'Simple registration',
    text: 'Register for any camp in minutes with a short, guided form — no paperwork, no queues.',
    icon: '📝',
  },
  {
    title: 'Instant confirmation',
    text: 'Get a unique registration ID the moment you sign up, so you always have proof of your slot.',
    icon: '✅',
  },
  {
    title: 'Organized for camp staff',
    text: 'An admin dashboard keeps every registration searchable, editable, and easy to manage.',
    icon: '📊',
  },
]

export default function Home() {
  return (
    <div>
      <section className="hero container">
        <div className="hero-grid">
          <div>
            <span className="eyebrow-plain">Community health, made accessible</span>
            <h1>Find a medical camp near you and register in minutes</h1>
            <p className="lead">
              The Medical Camp Registration Portal brings together checkup drives, eye camps,
              diabetes screenings, and women's health camps in one place — so getting care starts
              with a click, not a queue.
            </p>
            <div className="hero-cta">
              <Link to="/camps" className="btn btn-primary">
                View Camps
              </Link>
              <Link to="/register" className="btn btn-accent">
                Register Now
              </Link>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <svg width="100%" viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="40" y="30" width="180" height="200" rx="16" fill="#FBFAF7" stroke="#0E4B49" strokeWidth="1.5" />
              <rect x="60" y="54" width="140" height="12" rx="6" fill="#DCE6E1" />
              <rect x="60" y="78" width="100" height="12" rx="6" fill="#DCE6E1" />
              <circle cx="200" cy="150" r="58" fill="#EAF3EE" />
              <path d="M200 122v56M172 150h56" stroke="#0E4B49" strokeWidth="8" strokeLinecap="round" />
              <rect x="60" y="150" width="70" height="12" rx="6" fill="#DCE6E1" />
              <rect x="60" y="174" width="90" height="12" rx="6" fill="#DCE6E1" />
              <circle cx="252" cy="70" r="18" fill="#E0A233" />
            </svg>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2>Why use this portal</h2>
            <p>
              We built this portal to remove the friction between people who need basic
              healthcare and the camps that provide it.
            </p>
          </div>
          <div className="feature-grid">
            {highlights.map((h) => (
              <div className="feature-card" key={h.title}>
                <div className="icon-wrap" style={{ fontSize: 20 }}>
                  {h.icon}
                </div>
                <h3>{h.title}</h3>
                <p>{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Ready to register for a camp?</h2>
          <p style={{ maxWidth: '52ch', margin: '0 auto 22px', color: '#4A5D56' }}>
            Pick from our upcoming health camps and reserve your spot today.
          </p>
          <Link to="/camps" className="btn btn-primary">
            Browse Upcoming Camps
          </Link>
        </div>
      </section>
    </div>
  )
}
