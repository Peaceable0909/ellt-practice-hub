import { useState } from 'react'
import { signOut } from '../lib/supabase'

export default function Nav({ page, setPage, dark, setDark, user, profile, results = [] }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const streak = 1
  const xp = results.reduce((s, r) => s + (r.score || 0) * 10, 0)
  const hearts = 5
  const displayName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student'
  const initials = (profile?.full_name || displayName).split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const links = ['Home', 'Practice', 'Mock Tests', 'Progress', 'My Plan', 'Live Sessions']

  return (
    <nav style={{
      background: 'var(--bg2)', borderBottom: '2px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', height: 62, gap: 8 }}>
        {/* Logo */}
        <div onClick={() => setPage('Home')} style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 20, cursor: 'pointer', flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: '#fff', border: '3px solid var(--greenD)' }}>E</div>
          <span style={{ fontWeight: 900, fontSize: 17, color: 'var(--text)', letterSpacing: '-0.3px' }}>ELLTPulse</span>
        </div>

        {/* Desktop nav */}
        <div style={{ display: 'flex', gap: 2, flex: 1, flexWrap: 'wrap' }}>
          {links.map(l => (
            <button key={l} onClick={() => setPage(l)} style={{
              padding: '7px 12px', borderRadius: 10, border: 'none',
              background: page === l ? 'var(--greenBg)' : 'transparent',
              color: page === l ? 'var(--green)' : 'var(--textM)',
              fontWeight: page === l ? 800 : 600, fontSize: 12,
              cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
              borderBottom: page === l ? '2px solid var(--greenD)' : '2px solid transparent',
              transition: 'all .15s',
            }}>
              {l}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginLeft: 8 }}>
          {/* Streak */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }} onClick={() => setPage('Progress')}>
            <span style={{ fontSize: 20 }}>🔥</span>
            <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--streak)' }}>{streak}</span>
          </div>

          {/* XP */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }} onClick={() => setPage('Progress')}>
            <span style={{ fontSize: 16 }}>⚡</span>
            <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--xp)' }}>{xp}</span>
          </div>

          {/* Hearts */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ fontSize: 14, opacity: i < hearts ? 1 : 0.2 }}>❤️</span>
            ))}
          </div>

          {/* Theme */}
          <button onClick={() => setDark(d => !d)} style={{ width: 32, height: 32, borderRadius: 8, border: '2px solid var(--border)', background: 'var(--bg3)', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {dark ? '☀️' : '🌙'}
          </button>

          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={signOut} title="Log out">
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--green)', border: '3px solid var(--greenD)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff' }}>
              {initials}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
