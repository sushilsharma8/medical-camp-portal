import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container state-box">
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  )
}
