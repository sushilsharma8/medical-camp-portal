export function Loading({ label = 'Loading…' }) {
  return (
    <div className="state-box" role="status">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  )
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="state-box">
      <p style={{ color: 'var(--error)', fontWeight: 600 }}>{message}</p>
      {onRetry && (
        <button className="btn btn-outline" onClick={onRetry} style={{ marginTop: 10 }}>
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ message = 'Nothing to show yet.' }) {
  return (
    <div className="state-box">
      <p>{message}</p>
    </div>
  )
}

export function Toast({ message, type = 'success', onClose }) {
  if (!message) return null
  return (
    <div className={`toast ${type === 'error' ? 'error' : ''}`} onAnimationEnd={onClose}>
      {message}
    </div>
  )
}
