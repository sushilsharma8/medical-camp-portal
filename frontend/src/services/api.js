import axios from 'axios'

// Same-origin relative URLs by default. On Vercel, top-level rewrites send
// /api/* to the backend service, so the browser must call /api on this host.
// VITE_API_URL is optional and only for a cross-origin API. It is inlined at
// build time; do not point it at a service-binding variable (those exist only
// inside server functions at runtime).
const API_BASE_URL = import.meta.env.VITE_API_URL || ''

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Normalizes backend error shapes (validation errors vs plain detail strings)
// into a single flat array of { field, message } the UI can render.
function extractErrors(error) {
  const data = error?.response?.data
  if (!data) return [{ field: null, message: 'Network error. Is the backend running?' }]
  if (Array.isArray(data.errors)) return data.errors
  if (typeof data.detail === 'string') return [{ field: null, message: data.detail }]
  return [{ field: null, message: 'Something went wrong. Please try again.' }]
}

export const campsApi = {
  list: () => client.get('/api/camps').then((r) => r.data),
  get: (id) => client.get(`/api/camps/${id}`).then((r) => r.data),
}

export const registrationsApi = {
  create: (payload) => client.post('/api/registrations', payload).then((r) => r.data),
  list: () => client.get('/api/registrations').then((r) => r.data),
  get: (id) => client.get(`/api/registrations/${id}`).then((r) => r.data),
  update: (id, payload) => client.put(`/api/registrations/${id}`, payload).then((r) => r.data),
  remove: (id) => client.delete(`/api/registrations/${id}`).then((r) => r.data),
}

export { extractErrors }
export default client
