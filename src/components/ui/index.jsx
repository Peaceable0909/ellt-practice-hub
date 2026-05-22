// Duolingo-style UI primitives

export function Chip({ text, color }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 800, padding: '3px 9px', borderRadius: 100,
      background: `${color}22`, color, border: `2px solid ${color}44`,
      letterSpacing: '0.3px', whiteSpace: 'nowrap', display: 'inline-block',
      textTransform: 'uppercase',
    }}>
      {text}
    </span>
  )
}

export function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} className="skill-card" style={style}>
      {children}
    </div>
  )
}

export function Btn({ children, onClick, primary, color, small, disabled }) {
  const isGreen = primary && (!color || color === 'var(--teal)' || color === 'var(--green)')
  const bg = disabled ? 'var(--bg3)'
    : isGreen ? 'var(--green)'
    : primary ? color
    : 'var(--bg2)'
  const borderBtm = disabled ? 'var(--border)'
    : isGreen ? 'var(--greenD)'
    : primary ? `${color}cc`
    : 'var(--borderB)'

  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: small ? '7px 14px' : '12px 22px',
      borderRadius: 12, fontWeight: 800,
      fontSize: small ? 12 : 14,
      letterSpacing: small ? '0.3px' : '0.5px',
      textTransform: 'uppercase',
      cursor: disabled ? 'not-allowed' : 'pointer',
      border: primary ? 'none' : '2px solid var(--border)',
      borderBottom: primary ? `4px solid ${borderBtm}` : `4px solid var(--borderB)`,
      background: bg,
      color: primary ? '#fff' : disabled ? 'var(--textD)' : 'var(--text)',
      transition: 'all .15s', opacity: disabled ? 0.5 : 1,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: 'Nunito, sans-serif',
    }}>
      {children}
    </button>
  )
}

export function Section({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>{title}</h3>
      {subtitle && <p style={{ color: 'var(--textM)', fontSize: 14 }}>{subtitle}</p>}
    </div>
  )
}

export function FeedbackBlock({ feedback, accentColor }) {
  if (!feedback) return null
  const lines = feedback.split('\n').filter(l => l.trim())
  return (
    <div style={{ marginTop: 14, background: 'var(--bg3)', border: `2px solid ${accentColor}44`, borderRadius: 16, padding: 18, borderBottom: `4px solid ${accentColor}66` }}>
      <div style={{ fontSize: 11, color: accentColor, fontWeight: 900, marginBottom: 12, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
        AI Examiner Feedback
      </div>
      {lines.map((line, i) => {
        const isBand = line.startsWith('BAND:')
        const isScore = line.startsWith('SCORE:') || (line.includes('SCORE:') && !line.startsWith('-'))
        const isHeader = line.endsWith(':') && line === line.toUpperCase()
        const isBullet = line.startsWith('- ')
        return (
          <div key={i} style={{
            fontSize: isBand || isScore ? 16 : isHeader ? 11 : 14,
            fontWeight: isBand || isScore ? 900 : isHeader ? 800 : 600,
            color: isBand ? 'var(--green)' : isScore ? 'var(--amber)' : isHeader ? 'var(--textM)' : 'var(--text)',
            marginBottom: isBullet ? 5 : isHeader ? 10 : 8,
            paddingLeft: isBullet ? 14 : 0,
            borderLeft: isBullet ? `3px solid ${accentColor}66` : 'none',
            lineHeight: 1.6, letterSpacing: isHeader ? '0.5px' : 'normal',
            textTransform: isHeader ? 'uppercase' : 'none',
          }}>
            {isBullet ? line.slice(2) : line}
          </div>
        )
      })}
    </div>
  )
}
