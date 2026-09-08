import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { campsApi, registrationsApi, extractErrors } from '../services/api.js'
import { Loading } from '../components/States.jsx'

const initialForm = {
  full_name: '',
  age: '',
  gender: '',
  contact_number: '',
  email: '',
  address: '',
  camp_id: '',
  preferred_time: '',
  health_concern: '',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[0-9]{7,15}$/

function validate(form) {
  const errors = {}
  if (!form.full_name.trim()) errors.full_name = 'Full name cannot be empty'
  else if (form.full_name.trim().length < 2) errors.full_name = 'Full name must be at least 2 characters'

  if (!form.age) errors.age = 'Age is required'
  else if (Number(form.age) <= 0 || !Number.isFinite(Number(form.age)))
    errors.age = 'Age must be a valid positive number'
  else if (Number(form.age) > 120) errors.age = 'Please enter a realistic age'

  if (!form.gender) errors.gender = 'Please select a gender'

  if (!form.contact_number.trim()) errors.contact_number = 'Contact number is required'
  else if (!PHONE_RE.test(form.contact_number.trim().replace(/[\s-]/g, '')))
    errors.contact_number = 'Enter a valid contact number (7-15 digits)'

  if (!form.email.trim()) errors.email = 'Email is required'
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Enter a valid email address'

  if (!form.address.trim()) errors.address = 'Address cannot be empty'

  if (!form.camp_id) errors.camp_id = 'Please select a camp'

  return errors
}

export default function Register() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [camps, setCamps] = useState([])
  const [campsStatus, setCampsStatus] = useState('loading')
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    campsApi
      .list()
      .then((data) => {
        setCamps(data)
        setCampsStatus('success')
        const preselect = searchParams.get('camp')
        if (preselect) {
          setForm((f) => ({ ...f, camp_id: preselect }))
        }
      })
      .catch(() => setCampsStatus('error'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const clientErrors = validate(form)
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length > 0) return

    setSubmitting(true)
    try {
      const payload = {
        ...form,
        age: Number(form.age),
        camp_id: Number(form.camp_id),
        preferred_time: form.preferred_time || null,
        health_concern: form.health_concern || null,
      }
      const result = await registrationsApi.create(payload)
      navigate('/register/success', { state: { registration: result } })
    } catch (err) {
      const backendErrors = extractErrors(err)
      const fieldErrors = {}
      let generalMessage = ''
      backendErrors.forEach((be) => {
        if (be.field && be.field !== 'field') fieldErrors[be.field] = be.message
        else generalMessage = be.message
      })
      setErrors((er) => ({ ...er, ...fieldErrors }))
      if (generalMessage) setServerError(generalMessage)
      else if (Object.keys(fieldErrors).length === 0) setServerError('Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (campsStatus === 'loading') {
    return (
      <div className="container section">
        <Loading label="Preparing registration form…" />
      </div>
    )
  }

  return (
    <div className="container section">
      <div className="page-header" style={{ paddingTop: 0 }}>
        <h1>Register for a Camp</h1>
        <p>Fill in your details below. Fields marked with the camp selector are required.</p>
      </div>

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        {serverError && <div className="form-banner">{serverError}</div>}
        {campsStatus === 'error' && (
          <div className="form-banner">
            Could not load the list of camps. You can still fill the form, but submission will fail
            until the server is reachable.
          </div>
        )}

        <div className="form-grid">
          <div className={`field full ${errors.camp_id ? 'has-error' : ''}`}>
            <label htmlFor="camp_id">Select Camp *</label>
            <select id="camp_id" name="camp_id" value={form.camp_id} onChange={handleChange}>
              <option value="">-- Choose a camp --</option>
              {camps.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.name} — {c.location}
                </option>
              ))}
            </select>
            {errors.camp_id && <span className="field-error">{errors.camp_id}</span>}
          </div>

          <div className={`field ${errors.full_name ? 'has-error' : ''}`}>
            <label htmlFor="full_name">Full Name *</label>
            <input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} placeholder="e.g. Priya Verma" />
            {errors.full_name && <span className="field-error">{errors.full_name}</span>}
          </div>

          <div className={`field ${errors.age ? 'has-error' : ''}`}>
            <label htmlFor="age">Age *</label>
            <input id="age" name="age" type="number" min="1" max="120" value={form.age} onChange={handleChange} placeholder="e.g. 32" />
            {errors.age && <span className="field-error">{errors.age}</span>}
          </div>

          <div className={`field ${errors.gender ? 'has-error' : ''}`}>
            <label htmlFor="gender">Gender *</label>
            <select id="gender" name="gender" value={form.gender} onChange={handleChange}>
              <option value="">-- Select --</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            {errors.gender && <span className="field-error">{errors.gender}</span>}
          </div>

          <div className={`field ${errors.contact_number ? 'has-error' : ''}`}>
            <label htmlFor="contact_number">Contact Number *</label>
            <input id="contact_number" name="contact_number" value={form.contact_number} onChange={handleChange} placeholder="e.g. 9876543210" />
            {errors.contact_number && <span className="field-error">{errors.contact_number}</span>}
          </div>

          <div className={`field ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="email">Email *</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g. priya@example.com" />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="preferred_time">Preferred Date/Time</label>
            <input id="preferred_time" name="preferred_time" value={form.preferred_time} onChange={handleChange} placeholder="e.g. Morning slot" />
          </div>

          <div className={`field full ${errors.address ? 'has-error' : ''}`}>
            <label htmlFor="address">Address *</label>
            <textarea id="address" name="address" rows="2" value={form.address} onChange={handleChange} placeholder="Your full address" />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>

          <div className="field full">
            <label htmlFor="health_concern">Health Concern / Purpose of Visit</label>
            <textarea
              id="health_concern"
              name="health_concern"
              rows="3"
              value={form.health_concern}
              onChange={handleChange}
              placeholder="Briefly describe your concern (optional)"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Registration'}
          </button>
        </div>
      </form>
    </div>
  )
}
