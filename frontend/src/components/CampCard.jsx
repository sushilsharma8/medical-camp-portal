import { Link } from 'react-router-dom'

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function CampCard({ camp }) {
  const services = camp.services
    ? camp.services.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  return (
    <article className="camp-card">
      <div className="camp-card-top" />
      <div className="camp-card-body">
        <h3>{camp.name}</h3>
        <div className="camp-meta">
          <span>📅 {formatDate(camp.date)}</span>
          <span>📍 {camp.location}</span>
        </div>
        <p className="camp-desc">
          {camp.description.length > 120 ? camp.description.slice(0, 120) + '…' : camp.description}
        </p>
        <div className="services-row">
          {services.slice(0, 3).map((s) => (
            <span className="service-chip" key={s}>
              {s}
            </span>
          ))}
          {services.length > 3 && <span className="service-chip">+{services.length - 3} more</span>}
        </div>
        <div className="camp-card-actions">
          <Link to={`/camps/${camp.id}`} className="btn btn-outline">
            View Details
          </Link>
          <Link to={`/register?camp=${camp.id}`} className="btn btn-primary">
            Register Now
          </Link>
        </div>
      </div>
    </article>
  )
}
