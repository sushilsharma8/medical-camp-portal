export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div>
          <strong style={{ color: 'var(--teal-900)' }}>Medical Camp Registration Portal</strong>
          <p style={{ margin: '6px 0 0', maxWidth: '32ch' }}>
            Connecting communities with free and affordable medical camps.
          </p>
        </div>
        <div>
          <p style={{ margin: 0 }}>Built as a portfolio / academic project.</p>
          <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} Medical Camp Registration Portal.</p>
        </div>
      </div>
    </footer>
  )
}
