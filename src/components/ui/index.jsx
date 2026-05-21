// Shared primitive components used across the app

export function Chip({ text, color }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100,
      background: `${color}18`, color, border: `1px solid ${color}33`,
      letterSpacing: '0.3px', whiteSpace: 'nowrap', display: 'inline-block',
    }}>
      {text}
    </span>
  )
}

export function Card({ children, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 12, padding: 16, ...style,
      }}
    >
      {children}
    </div>
  )
}

export function Btn({ children, onClick, primary, color, small, disabled }) {
  const bg = primary
    ? `linear-gradient(135deg, ${color || 'var(--teal)'}, ${color ? color + 'cc' : 'var(--tealD)'})`
    : disabled ? 'var(--bg3)' : 'transparent'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: small ? '6px 12px' : '9px 18px',
        borderRadius: 8, fontWeight: 600,
        fontSize: small ? 11 : 13,
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: primary ? 'none' : '1px solid var(--border)',
        background: bg,
        color: primary ? '#000' : disabled ? 'var(--textD)' : 'var(--textM)',
        transition: 'all 0.2s', opacity: disabled ? 0.6 : 1,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  )
}

export function Section({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{title}</h3>
      {subtitle && <p style={{ color: 'var(--textM)', fontSize: 13 }}>{subtitle}</p>}
    </div>
  )
}

export function FeedbackBlock({ feedback, accentColor }) {
  if (!feedback) return null
  const lines = feedback.split('\n').filter(l => l.trim())
  return (
    <div style={{
      marginTop: 14, background: 'var(--bg3)',
      border: `1px solid ${accentColor}33`, borderRadius: 10, padding: 16,
    }}>
      <div style={{ fontSize: 11, color: accentColor, fontWeight: 600, marginBottom: 10, letterSpacing: '0.5px' }}>
        AI EXAMINER FEEDBACK
      </div>
      {lines.map((line, i) => {
        const isBand = line.startsWith('BAND:')
        const isScore = line.startsWith('SCORE:') || (line.includes('SCORE:') && !line.startsWith('-'))
        const isHeader = line.endsWith(':') && line === line.toUpperCase()
        const isBullet = line.startsWith('- ')
        return (
          <div key={i} style={{
            fontSize: isBand || isScore ? 15 : isHeader ? 11 : 13,
            fontWeight: isBand || isScore ? 700 : isHeader ? 600 : 400,
            color: isBand ? 'var(--teal)' : isScore ? 'var(--amber)' : isHeader ? 'var(--textM)' : 'var(--text)',
            marginBottom: isBullet ? 4 : isHeader ? 8 : 8,
            paddingLeft: isBullet ? 10 : 0,
            borderLeft: isBullet ? `2px solid ${accentColor}44` : 'none',
            lineHeight: 1.6,
            letterSpacing: isHeader ? '0.5px' : 'normal',
          }}>
            {isBullet ? line.slice(2) : line}
          </div>
        )
      })}
    </div>
  )
}
