import { useEffect, useState } from 'react'
import { campsApi, registrationsApi, extractErrors } from '../services/api.js'
import { Loading, ErrorState, EmptyState, Toast } from '../components/States.jsx'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Admin() {
  const [camps, setCamps] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [status, setStatus] = useState('loading')
  const [toast, setToast] = useState(null)

  const [viewing, setViewing] = useState(null)
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setStatus('loading')
    Promise.all([campsApi.list(), registrationsApi.list()])
      .then(([campsData, regsData]) => {
        setCamps(campsData)
        setRegistrations(regsData)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(load, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const openEdit = (reg) => {
    setEditing(reg)
    setEditForm({
      full_name: reg.full_name,
      age: reg.age,
      gender: reg.gender,
      contact_number: reg.contact_number,
      email: reg.email,
      address: reg.address,
      camp_id: reg.camp_id,
      preferred_time: reg.preferred_time || '',
      health_concern: reg.health_concern || '',
    })
  }

  const saveEdit = async () => {
    setSaving(true)
    try {
      const payload = { ...editForm, age: Number(editForm.age), camp_id: Number(editForm.camp_id) }
      const updated = await registrationsApi.update(editing.id, payload)
      setRegistrations((rs) => rs.map((r) => (r.id === updated.id ? updated : r)))
      setEditing(null)
      showToast('Registration updated successfully.')
    } catch (err) {
      const errs = extractErrors(err)
      showToast(errs[0]?.message || 'Update failed.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    try {
      await registrationsApi.remove(deleting.id)
      setRegistrations((rs) => rs.filter((r) => r.id !== deleting.id))
      setDeleting(null)
      showToast('Registration deleted.')
    } catch (err) {
      const errs = extractErrors(err)
      showToast(errs[0]?.message || 'Delete failed.', 'error')
    }
  }

  if (status === 'loading') return <div className="container section"><Loading label="Loading dashboard…" /></div>
  if (status === 'error') return <div className="container section"><ErrorState message="Could not load admin data." onRetry={load} /></div>

  const recent = [...registrations].slice(0, 5)

  return (
    <div className="container section">
      <div className="page-header" style={{ paddingTop: 0 }}>
        <h1>Admin Dashboard</h1>
        <p>Monitor camps and manage participant registrations.</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="num">{camps.length}</span>
          <span className="label">Total Camps</span>
        </div>
        <div className="stat-card">
          <span className="num">{registrations.length}</span>
          <span className="label">Total Registrations</span>
        </div>
        <div className="stat-card">
          <span className="num">{recent.length}</span>
          <span className="label">Recent Registrations</span>
        </div>
      </div>

      <h3>All Registrations</h3>
      {registrations.length === 0 ? (
        <EmptyState message="No registrations yet. Once people register, they'll show up here." />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Reg. ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Camp</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr key={r.id}>
                  <td>{r.registration_id}</td>
                  <td>{r.full_name}</td>
                  <td>{r.age}</td>
                  <td>{r.gender}</td>
                  <td>{r.contact_number}</td>
                  <td>{r.email}</td>
                  <td>{r.camp?.name || `#${r.camp_id}`}</td>
                  <td>{formatDate(r.created_at)}</td>
                  <td>
                    <div className="action-btns">
                      <button className="icon-btn" onClick={() => setViewing(r)}>View</button>
                      <button className="icon-btn edit" onClick={() => openEdit(r)}>Edit</button>
                      <button className="icon-btn danger" onClick={() => setDeleting(r)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View modal */}
      {viewing && (
        <div className="modal-backdrop" onClick={() => setViewing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{viewing.full_name}</h3>
            <p><b>Registration ID:</b> {viewing.registration_id}</p>
            <p><b>Age / Gender:</b> {viewing.age}, {viewing.gender}</p>
            <p><b>Contact:</b> {viewing.contact_number}</p>
            <p><b>Email:</b> {viewing.email}</p>
            <p><b>Address:</b> {viewing.address}</p>
            <p><b>Camp:</b> {viewing.camp?.name || `#${viewing.camp_id}`}</p>
            <p><b>Preferred Time:</b> {viewing.preferred_time || '—'}</p>
            <p><b>Health Concern:</b> {viewing.health_concern || '—'}</p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setViewing(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editing && editForm && (
        <div className="modal-backdrop" onClick={() => !saving && setEditing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <h3>Edit Registration</h3>
            <div className="field">
              <label>Full Name</label>
              <input value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} />
            </div>
            <div className="field">
              <label>Age</label>
              <input type="number" value={editForm.age} onChange={(e) => setEditForm({ ...editForm, age: e.target.value })} />
            </div>
            <div className="field">
              <label>Contact Number</label>
              <input value={editForm.contact_number} onChange={(e) => setEditForm({ ...editForm, contact_number: e.target.value })} />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            </div>
            <div className="field">
              <label>Camp</label>
              <select value={editForm.camp_id} onChange={(e) => setEditForm({ ...editForm, camp_id: e.target.value })}>
                {camps.map((c) => (
                  <option value={c.id} key={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setEditing(null)} disabled={saving}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEdit} disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleting && (
        <div className="modal-backdrop" onClick={() => setDeleting(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this registration?</h3>
            <p>
              This will permanently remove <b>{deleting.full_name}</b>'s registration
              ({deleting.registration_id}). This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDeleting(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  )
}
