import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // This is a static contact form for demo purposes; wire it to a real
    // endpoint (e.g. /api/contact) if the portal needs to receive messages.
    setSent(true)
  }

  return (
    <div className="container section">
      <div className="page-header" style={{ paddingTop: 0 }}>
        <h1>Contact Us</h1>
        <p>Have a question about a camp or your registration? Reach out and we'll get back to you.</p>
      </div>

      <div className="contact-grid">
        <div className="contact-info-list">
          <div className="contact-info-item">
            <div className="icon-wrap">📞</div>
            <div>
              <strong>Phone</strong>
              <p style={{ margin: 0, color: '#4A5D56' }}>+91 98765 43210</p>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="icon-wrap">✉️</div>
            <div>
              <strong>Email</strong>
              <p style={{ margin: 0, color: '#4A5D56' }}>support@medicalcampportal.org</p>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="icon-wrap">📍</div>
            <div>
              <strong>Office</strong>
              <p style={{ margin: 0, color: '#4A5D56' }}>SCO 45, Sector 17, Chandigarh, India</p>
            </div>
          </div>
        </div>

        <form className="form-card" style={{ padding: 24 }} onSubmit={handleSubmit}>
          {sent && <div className="success-summary" style={{ marginBottom: 16 }}>Thanks — your message has been noted. We'll be in touch soon.</div>}
          <div className="field">
            <label htmlFor="c-name">Name</label>
            <input id="c-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="c-email">Email</label>
            <input id="c-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="c-message">Message</label>
            <textarea id="c-message" rows="4" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Send Message</button>
          </div>
        </form>
      </div>
    </div>
  )
}
