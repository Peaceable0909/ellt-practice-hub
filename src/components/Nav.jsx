import { Home, BookOpen, ClipboardList, BarChart2, Calendar, Radio,
         Flame, Zap, Sun, Moon, LogOut, User, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { signOut } from '../lib/supabase'

const NAV_ITEMS = [
  { key: 'Home',          icon: Home,         label: 'Home'     },
  { key: 'Practice',      icon: BookOpen,      label: 'Practice' },
  { key: 'Mock Tests',    icon: ClipboardList, label: 'Mocks'    },
  { key: 'Progress',      icon: BarChart2,     label: 'Progress' },
  { key: 'My Plan',       icon: Calendar,      label: 'My Plan'  },
  { key: 'Live Sessions', icon: Radio,         label: 'Live'     },
]

export default function Nav({ page, setPage, dark, setDark, user, profile, results = [] }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropRef = useRef(null)

  const streak = 1
  const xp = results.reduce((s, r) => s + (r.score || 0) * 10, 0)
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Student'
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <>
      {/* ── TOP NAV ───────────────────────────────────── */}
      <nav style={{ background: 'var(--bg2)', borderBottom: '2px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', height: 62, gap: 6 }}>

          {/* Logo */}
          <div onClick={() => setPage('Home')} style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 12, cursor: 'pointer', flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#fff', border: '3px solid var(--greenD)', flexShrink: 0 }}>E</div>
            <span style={{ fontWeight: 900, fontSize: 16, color: 'var(--text)', letterSpacing: '-0.3px' }} className="hide-mobile">ELLTPulse</span>
          </div>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', gap: 2, flex: 1, flexWrap: 'wrap' }} className="hide-mobile">
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

          <div style={{ flex: 1 }} className="show-mobile-only" />

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

            {/* Streak */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }} onClick={() => setPage('Progress')}>
              <Flame size={18} color="var(--streak)" fill="var(--streak)" className="streak-fire" />
              <span style={{ fontWeight: 900, fontSize: 14, color: 'var(--streak)' }}>{streak}</span>
            </div>

            {/* XP */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }} onClick={() => setPage('Progress')}>
              <Zap size={16} color="var(--xp)" fill="var(--xp)" />
              <span style={{ fontWeight: 900, fontSize: 14, color: 'var(--xp)' }}>{xp}</span>
            </div>

            {/* Theme toggle */}
            <button onClick={() => setDark(d => !d)} title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{ width: 36, height: 36, borderRadius: 10, border: '2px solid var(--border)', borderBottom: '3px solid var(--borderB)', background: 'var(--bg3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--textM)', flexShrink: 0 }}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Avatar — opens dropdown, does NOT log out */}
            <div ref={dropRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(o => !o)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px 4px 4px', borderRadius: 12, border: '2px solid var(--border)', borderBottom: '3px solid var(--borderB)', background: 'var(--bg3)', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}
              >
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--green)', border: '2px solid var(--greenD)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                  {initials}
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text)', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="hide-mobile">
                  {displayName.split(' ')[0]}
                </span>
                <ChevronDown size={12} color="var(--textM)" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s' }} />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: 200,
                  background: 'var(--bg2)', border: '2px solid var(--border)', borderBottom: '4px solid var(--borderB)',
                  borderRadius: 14, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 200,
                }}>
                  {/* User info header */}
                  <div style={{ padding: '14px 16px', borderBottom: '2px solid var(--border)', background: 'var(--bg3)' }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--text)' }}>{displayName}</div>
                    <div style={{ fontSize: 12, color: 'var(--textM)', fontWeight: 600, marginTop: 2 }}>{user?.email}</div>
                  </div>

                  {/* Menu items */}
                  {[
                    { icon: User,     label: 'My Profile',     action: () => { setPage('Progress'); setDropdownOpen(false) } },
                    { icon: Calendar, label: 'My Learning Plan',action: () => { setPage('My Plan'); setDropdownOpen(false) } },
                    { icon: BarChart2,label: 'My Progress',     action: () => { setPage('Progress'); setDropdownOpen(false) } },
                  ].map(({ icon: Icon, label, action }) => (
                    <button key={label} onClick={action} style={{
                      width: '100%', padding: '12px 16px', border: 'none', background: 'transparent',
                      display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                      fontFamily: 'Nunito, sans-serif', fontSize: 14, fontWeight: 700,
                      color: 'var(--text)', borderBottom: '1px solid var(--border)',
                      textAlign: 'left', transition: 'background .15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <Icon size={16} color="var(--textM)" />
                      {label}
                    </button>
                  ))}

                  {/* Log out — clearly separate at the bottom */}
                  <button onClick={() => { setDropdownOpen(false); signOut() }} style={{
                    width: '100%', padding: '12px 16px', border: 'none', background: 'transparent',
                    display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                    fontFamily: 'Nunito, sans-serif', fontSize: 14, fontWeight: 800,
                    color: 'var(--coral)', textAlign: 'left', transition: 'background .15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--coralBg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE BOTTOM NAV ─────────────────────────── */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, background: 'var(--bg2)', borderTop: '2px solid var(--border)', display: 'flex', height: 64, paddingBottom: 'env(safe-area-inset-bottom)' }} className="bottom-nav">
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

      <style>{`
        .hide-mobile  { display: inline-flex; }
        .show-mobile-only { display: none; }
        .bottom-nav   { display: flex; }
        @media (min-width: 768px) {
          .hide-mobile      { display: inline-flex !important; }
          .show-mobile-only { display: none !important; }
          .bottom-nav       { display: none !important; }
        }
        @media (max-width: 767px) {
          .hide-mobile      { display: none !important; }
          .show-mobile-only { display: flex !important; }
        }
      `}</style>
    </>
  )
}
