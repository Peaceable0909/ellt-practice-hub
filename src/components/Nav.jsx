import { signOut } from '../lib/supabase'

export default function Nav({ page, setPage, dark, setDark, user, profile }) {
  const links = ['Home', 'Practice', 'Mock Tests', 'Progress', 'My Plan', 'Live Sessions']
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Student'
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <nav style={{
      background: dark ? 'rgba(6,11,20,0.95)' : 'rgba(244,247,252,0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 20px',
        display: 'flex', alignItems: 'center', height: 60, gap: 6,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 24 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--teal), var(--blue))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 13, color: '#000',
          }}>E</div>
          <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', letterSpacing: '-0.3px' }}>
            ELLTPulse
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 2, flex: 1, flexWrap: 'wrap' }}>
          {links.map(l => (
            <button key={l} onClick={() => setPage(l)} style={{
              padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 500, transition: 'all 0.2s',
              background: page === l ? 'var(--tealBg)' : 'transparent',
              color: page === l ? 'var(--teal)' : 'var(--textM)',
              outline: page === l ? '1px solid var(--tealBr)' : 'none',
              fontFamily: 'inherit',
            }}>
              {l}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* Dark/light toggle */}
          <button onClick={() => setDark(d => !d)} title="Toggle theme" style={{
            width: 34, height: 34, borderRadius: 8,
            border: '1px solid var(--border)', background: 'var(--bg3)',
            color: 'var(--textM)', cursor: 'pointer', fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {dark ? '☀️' : '🌙'}
          </button>

          {/* User info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--teal), var(--blue))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#000', flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>
                {displayName}
              </span>
              <span style={{ fontSize: 10, color: 'var(--textD)', lineHeight: 1.2 }}>
                {user?.email}
              </span>
            </div>
          </div>

          {/* Log out */}
          <button
            onClick={signOut}
            title="Log out"
            style={{
              padding: '5px 10px', borderRadius: 7,
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--textM)', cursor: 'pointer', fontSize: 11,
              fontWeight: 500, fontFamily: 'inherit',
            }}
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  )
}
