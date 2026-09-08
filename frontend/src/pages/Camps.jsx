import { useEffect, useState } from 'react'
import CampCard from '../components/CampCard.jsx'
import { Loading, ErrorState, EmptyState } from '../components/States.jsx'
import { campsApi } from '../services/api.js'

export default function Camps() {
  const [camps, setCamps] = useState([])
  const [status, setStatus] = useState('loading') // loading | success | error

  const load = () => {
    setStatus('loading')
    campsApi
      .list()
      .then((data) => {
        setCamps(data)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(load, [])

  return (
    <div className="container">
      <div className="page-header">
        <h1>Upcoming Medical Camps</h1>
        <p>Browse all scheduled camps, check what's on offer, and register for the one that suits you.</p>
      </div>

      <div className="section" style={{ paddingTop: 8 }}>
        {status === 'loading' && <Loading label="Loading camps…" />}
        {status === 'error' && (
          <ErrorState message="Could not load camps. Please check your connection to the server." onRetry={load} />
        )}
        {status === 'success' && camps.length === 0 && <EmptyState message="No camps are scheduled right now." />}
        {status === 'success' && camps.length > 0 && (
          <div className="camp-grid">
            {camps.map((c) => (
              <CampCard camp={c} key={c.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
