import { useState } from 'react'
import { signIn, signUp } from '../lib/supabase'

export default function Auth() {
  const [mode, setMode] = useState('login') // login | signup
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    if (mode === 'signup') {
      if (!fullName.trim()) { setError('Please enter your name.'); setLoading(false); return }
      const { error: err } = await signUp(email, password, fullName)
      if (err) setError(err.message)
      else setMessage('Account created! Check your email to confirm, then log in.')
    } else {
      const { error: err } = await signIn(email, password)
      if (err) setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 20, background: 'var(--bg)',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, margin: '0 auto 12px',
            background: 'linear-gradient(135deg, var(--teal), var(--blue))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 20, color: '#000',
          }}>E</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>ELLTPulse</div>
          <div style={{ fontSize: 13, color: 'var(--textM)', marginTop: 4 }}>Oxford ELLT Practice Hub</div>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 28,
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', marginBottom: 24, background: 'var(--bg3)', borderRadius: 10, padding: 3 }}>
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setMessage('') }}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 8, border: 'none',
                  background: mode === m ? 'var(--bg2)' : 'transparent',
                  color: mode === m ? 'var(--text)' : 'var(--textM)',
                  fontWeight: mode === m ? 600 : 400, fontSize: 13,
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s',
                }}>
                {m === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={submit}>
            {/* Full name — signup only */}
            {mode === 'signup' && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--textM)', display: 'block', marginBottom: 6 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--textM)', display: 'block', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--textM)', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{ marginBottom: 14, padding: '10px 14px', background: 'var(--coralBg)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, fontSize: 13, color: 'var(--coral)' }}>
                {error}
              </div>
            )}

            {/* Success */}
            {message && (
              <div style={{ marginBottom: 14, padding: '10px 14px', background: 'var(--tealBg)', border: '1px solid var(--tealBr)', borderRadius: 8, fontSize: 13, color: 'var(--teal)' }}>
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '11px 0', borderRadius: 8, border: 'none',
                background: loading ? 'var(--border)' : 'linear-gradient(135deg, var(--teal), var(--blue))',
                color: loading ? 'var(--textM)' : '#000',
                fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', transition: 'all 0.2s',
              }}
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Log In →' : 'Create Account →'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--textD)' }}>
          Your progress is saved securely to your account
        </div>
      </div>
    </div>
  )
}
