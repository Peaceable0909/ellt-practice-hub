import { Home, BookOpen, ClipboardList, BarChart2, Calendar, Radio,
         Headphones, Flame, Zap, Sun, Moon, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { signOut } from '../lib/supabase'

const NAV_ITEMS = [
  { key: 'Home',          icon: Home,          label: 'Home'     },
  { key: 'Practice',      icon: BookOpen,       label: 'Practice' },
  { key: 'Mock Tests',    icon: ClipboardList,  label: 'Mocks'    },
  { key: 'Progress',      icon: BarChart2,      label: 'Progress' },
  { key: 'My Plan',       icon: Calendar,       label: 'My Plan'  },
  { key: 'Live Sessions', icon: Radio,          label: 'Live'     },
]

export default function Nav({ page, setPage, dark, setDark, user, profile, results = [] }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const streak = 1
  const xp = results.reduce((s, r) => s + (r.score || 0) * 10, 0)
  const displayName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student'
  const initials = (profile?.full_name || displayName).split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <>
      {/* ─── DESKTOP / TABLET TOP NAV ─────────────────── */}
      <nav style={{
        background: 'var(--bg2)', borderBottom: '2px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', height: 62, gap: 6 }}>

          {/* Logo */}
          <div onClick={() => setPage('Home')} style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 12, cursor: 'pointer', flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#fff', border: '3px solid var(--greenD)', flexShrink: 0 }}>E</div>
            <span style={{ fontWeight: 900, fontSize: 16, color: 'var(--text)', letterSpacing: '-0.3px', display: 'none' }} className="show-md">ELLTPulse</span>
          </div>

          {/* Desktop nav links — hidden on mobile */}
          <div style={{ display: 'none', gap: 2, flex: 1, flexWrap: 'wrap' }} className="nav-links-desktop">
            {NAV_ITEMS.map(({ key, icon: Icon, label }) => (
              <button key={key} onClick={() => setPage(key)} style={{
                padding: '7px 11px', borderRadius: 10, border: 'none',
                background: page === key ? 'var(--greenBg)' : 'transparent',
                color: page === key ? 'var(--green)' : 'var(--textM)',
                fontWeight: page === key ? 800 : 600, fontSize: 12,
                cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
                borderBottom: page === key ? '2px solid var(--greenD)' : '2px solid transparent',
                display: 'flex', alignItems: 'center', gap: 6, transition: 'all .15s',
              }}>
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Spacer on mobile */}
          <div style={{ flex: 1 }} />

          {/* Stats + controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

            {/* Streak */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }} onClick={() => setPage('Progress')}>
              <Flame size={18} color="var(--streak)" fill="var(--streak)" />
              <span style={{ fontWeight: 900, fontSize: 14, color: 'var(--streak)' }}>{streak}</span>
            </div>

            {/* XP */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }} onClick={() => setPage('Progress')}>
              <Zap size={16} color="var(--xp)" fill="var(--xp)" />
              <span style={{ fontWeight: 900, fontSize: 14, color: 'var(--xp)' }}>{xp}</span>
            </div>

            {/* Theme toggle */}
            <button onClick={() => setDark(d => !d)} style={{ width: 36, height: 36, borderRadius: 10, border: '2px solid var(--border)', background: 'var(--bg3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--textM)', flexShrink: 0 }}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Avatar + logout */}
            <button onClick={signOut} title="Log out" style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--green)', border: '3px solid var(--greenD)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', cursor: 'pointer', flexShrink: 0 }}>
              {initials}
            </button>
          </div>
        </div>
      </nav>

      {/* ─── MOBILE BOTTOM NAV ────────────────────────── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: 'var(--bg2)', borderTop: '2px solid var(--border)',
        display: 'flex', height: 64, paddingBottom: 'env(safe-area-inset-bottom)',
      }} className="bottom-nav">
        {NAV_ITEMS.slice(0, 5).map(({ key, icon: Icon, label }) => {
          const active = page === key
          return (
            <button key={key} onClick={() => setPage(key)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 3, border: 'none', background: 'transparent',
              cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
              color: active ? 'var(--green)' : 'var(--textD)',
              borderTop: active ? '3px solid var(--green)' : '3px solid transparent',
              transition: 'all .15s',
            }}>
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span style={{ fontSize: 9, fontWeight: active ? 900 : 600, letterSpacing: '0.3px', textTransform: 'uppercase' }}>{label}</span>
            </button>
          )
        })}
      </div>

      {/* Inject show/hide CSS */}
      <style>{`
        @media (min-width: 768px) {
          .nav-links-desktop { display: flex !important; }
          .bottom-nav { display: none !important; }
          .show-md { display: inline !important; }
        }
      `}</style>
    </>
  )
}
