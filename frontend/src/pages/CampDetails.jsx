import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Loading, ErrorState } from '../components/States.jsx'
import { campsApi } from '../services/api.js'

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function CampDetails() {
  const { id } = useParams()
  const [camp, setCamp] = useState(null)
  const [status, setStatus] = useState('loading')

  const load = () => {
    setStatus('loading')
    campsApi
      .get(id)
      .then((data) => {
        setCamp(data)
        setStatus('success')
      })
      .catch((err) => {
        setStatus(err?.response?.status === 404 ? 'not-found' : 'error')
      })
  }

  useEffect(load, [id])

  if (status === 'loading') return <div className="container"><Loading label="Loading camp details…" /></div>
  if (status === 'error') return <div className="container"><ErrorState message="Could not load this camp." onRetry={load} /></div>
  if (status === 'not-found') {
    return (
      <div className="container state-box">
        <h2>Camp not found</h2>
        <p>This camp may have been removed or the link is incorrect.</p>
        <Link to="/camps" className="btn btn-primary">Back to Camps</Link>
      </div>
    )
  }

  const services = camp.services ? camp.services.split(',').map((s) => s.trim()).filter(Boolean) : []

  return (
    <div className="container section">
      <div className="details-header">
        <div>
          <h1 style={{ marginBottom: 6 }}>{camp.name}</h1>
          <p style={{ color: '#4A5D56', margin: 0 }}>{camp.location}</p>
        </div>
        <Link to={`/register?camp=${camp.id}`} className="btn btn-primary">
          Register Now
        </Link>
      </div>

      <div className="details-meta-list">
        <div><b>Date</b> {formatDate(camp.date)}</div>
        <div><b>Location</b> {camp.location}</div>
      </div>

      <h3>About this camp</h3>
      <p style={{ maxWidth: '70ch', color: '#33473F' }}>{camp.description}</p>

      <h3 style={{ marginTop: 22 }}>Services & Doctors Available</h3>
      <div className="services-row">
        {services.map((s) => (
          <span className="service-chip" key={s}>{s}</span>
        ))}
      </div>

      <div style={{ marginTop: 32 }}>
        <Link to={`/register?camp=${camp.id}`} className="btn btn-accent">
          Register for this Camp
        </Link>{' '}
        <Link to="/camps" className="btn btn-ghost">
          ← Back to all camps
        </Link>
      </div>
    </div>
  )
}
