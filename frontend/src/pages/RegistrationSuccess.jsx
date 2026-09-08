import { useLocation, Link, Navigate } from 'react-router-dom'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function RegistrationSuccess() {
  const location = useLocation()
  const registration = location.state?.registration

  if (!registration) {
    return <Navigate to="/register" replace />
  }

  const campName = registration.camp?.name || `Camp #${registration.camp_id}`

  return (
    <div className="container section">
      <div className="success-card">
        <div className="success-badge">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2>Registration Successful!</h2>
        <p style={{ color: '#4A5D56' }}>Thank you for registering for the {campName}.</p>

        <div className="reg-id-pill">Registration ID: {registration.registration_id}</div>

        <div className="success-summary">
          <div><span>Name</span><span>{registration.full_name}</span></div>
          <div><span>Camp</span><span>{campName}</span></div>
          {registration.camp?.date && (
            <div><span>Camp Date</span><span>{formatDate(registration.camp.date)}</span></div>
          )}
          {registration.camp?.location && (
            <div><span>Location</span><span>{registration.camp.location}</span></div>
          )}
          <div><span>Contact</span><span>{registration.contact_number}</span></div>
          <div><span>Email</span><span>{registration.email}</span></div>
        </div>

        <div className="hero-cta" style={{ justifyContent: 'center', marginTop: 26 }}>
          <Link to="/camps" className="btn btn-outline">Browse More Camps</Link>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
