import { useState, useEffect } from 'react'
import { signIn, signUp, signInWithGoogle, sendPasswordReset, updatePassword } from '../lib/supabase'

// Input field component
function Field({ label, type, placeholder, value, onChange, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--textM)', display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        style={{
          width: '100%', padding: '10px 14px', borderRadius: 12,
          border: '1px solid var(--border)', background: 'var(--bg)',
          color: 'var(--text)', fontSize: 13, fontFamily: 'inherit',
          outline: 'none', boxSizing: 'border-box', transition: 'border .2s',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--teal)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
      {children}
    </div>
  )
}

// Google button
function GoogleBtn({ onClick, loading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      style={{
        width: '100%', padding: '11px 0', borderRadius: 12,
        border: '1px solid var(--border)', background: 'var(--bg3)',
        color: 'var(--text)', fontWeight: 600, fontSize: 13,
        cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        transition: 'all .2s', opacity: loading ? 0.6 : 1,
      }}
    >
      {/* Google logo SVG */}
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.5 30.3 0 24 0 14.7 0 6.7 5.4 2.7 13.3l7.9 6.1C12.5 13.2 17.8 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17z"/>
        <path fill="#FBBC05" d="M10.6 28.6A14.8 14.8 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6L2.4 13.3A24 24 0 0 0 0 24c0 3.8.9 7.4 2.5 10.6l8.1-6z"/>
        <path fill="#34A853" d="M24 48c6.3 0 11.7-2.1 15.6-5.7l-7.5-5.8c-2.1 1.4-4.8 2.2-8.1 2.2-6.2 0-11.5-4.2-13.4-9.8l-8 6.1C6.6 42.5 14.7 48 24 48z"/>
      </svg>
      Continue with Google
    </button>
  )
}

// Divider
function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}/>
      <span style={{ fontSize: 12, color: 'var(--textD)' }}>or</span>
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}/>
    </div>
  )
}

// Error / success alert
function Alert({ msg, type }) {
  if (!msg) return null
  const isError = type === 'error'
  return (
    <div style={{
      marginBottom: 14, padding: '10px 14px', borderRadius: 12, fontSize: 13, lineHeight: 1.5,
      background: isError ? 'var(--coralBg)' : 'var(--tealBg)',
      border: `1px solid ${isError ? 'rgba(248,113,113,0.3)' : 'var(--tealBr)'}`,
      color: isError ? 'var(--coral)' : 'var(--teal)',
    }}>
      {msg}
    </div>
  )
}

// Submit button
function SubmitBtn({ loading, label }) {
  return (
    <button type="submit" disabled={loading} style={{
      width: '100%', padding: '11px 0', borderRadius: 12, border: 'none',
      background: loading ? 'var(--border)' : 'linear-gradient(135deg, var(--teal), var(--blue))',
      color: loading ? 'var(--textM)' : '#000',
      fontWeight: 900, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer',
      fontFamily: 'inherit', transition: 'all .2s',
    }}>
      {loading ? 'Please wait…' : label}
    </button>
  )
}

export default function Auth({ isPasswordRecovery }) {
  const [mode, setMode] = useState(isPasswordRecovery ? 'reset' : 'login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [gLoading, setGLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // If parent tells us it's a recovery session, switch to reset mode
  useEffect(() => {
    if (isPasswordRecovery) setMode('reset')
  }, [isPasswordRecovery])

  const clear = () => { setError(''); setMessage('') }

  const handleGoogle = async () => {
    clear()
    setGLoading(true)
    const { error: err } = await signInWithGoogle()
    if (err) { setError(err.message); setGLoading(false) }
    // On success, page redirects to Google — no need to stop loading
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clear()
    setLoading(true)

    if (mode === 'login') {
      const { error: err } = await signIn(email, password)
      if (err) setError(err.message)

    } else if (mode === 'signup') {
      if (!fullName.trim()) { setError('Please enter your full name.'); setLoading(false); return }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return }
      const { error: err } = await signUp(email, password, fullName)
      if (err) setError(err.message)
      else setMessage('Account created! Check your email to confirm, then log in.')

    } else if (mode === 'forgot') {
      const { error: err } = await sendPasswordReset(email)
      if (err) setError(err.message)
      else setMessage('Password reset link sent! Check your email inbox.')

    } else if (mode === 'reset') {
      if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return }
      if (newPassword !== confirmPassword) { setError('Passwords do not match.'); setLoading(false); return }
      const { error: err } = await updatePassword(newPassword)
      if (err) setError(err.message)
      else setMessage('Password updated! You are now logged in.')
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
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, margin: '0 auto 12px',
            background: 'linear-gradient(135deg, var(--teal), var(--blue))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 22, color: '#000',
          }}>E</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>ELLTPulse</div>
          <div style={{ fontSize: 13, color: 'var(--textM)', marginTop: 4 }}>Oxford ELLT Practice Hub</div>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 28,
        }}>

          {/* ── RESET PASSWORD MODE ── */}
          {mode === 'reset' && (
            <>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                Set a new password
              </div>
              <div style={{ fontSize: 13, color: 'var(--textM)', marginBottom: 20 }}>
                Choose a strong password for your account.
              </div>
              <Alert msg={error} type="error"/>
              <Alert msg={message} type="success"/>
              {!message && (
                <form onSubmit={handleSubmit}>
                  <Field label="New Password" type="password" placeholder="At least 6 characters"
                    value={newPassword} onChange={e => setNewPassword(e.target.value)}/>
                  <Field label="Confirm Password" type="password" placeholder="Repeat your new password"
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/>
                  <SubmitBtn loading={loading} label="Update Password →"/>
                </form>
              )}
            </>
          )}

          {/* ── FORGOT PASSWORD MODE ── */}
          {mode === 'forgot' && (
            <>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                Forgot your password?
              </div>
              <div style={{ fontSize: 13, color: 'var(--textM)', marginBottom: 20 }}>
                Enter your email and we'll send you a reset link.
              </div>
              <Alert msg={error} type="error"/>
              <Alert msg={message} type="success"/>
              {!message && (
                <form onSubmit={handleSubmit}>
                  <Field label="Email" type="email" placeholder="you@email.com"
                    value={email} onChange={e => setEmail(e.target.value)}/>
                  <SubmitBtn loading={loading} label="Send Reset Link →"/>
                </form>
              )}
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <button type="button" onClick={() => { setMode('login'); clear() }}
                  style={{ background: 'none', border: 'none', color: 'var(--teal)',
                    fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
                  ← Back to Log In
                </button>
              </div>
            </>
          )}

          {/* ── LOGIN / SIGNUP MODES ── */}
          {(mode === 'login' || mode === 'signup') && (
            <>
              {/* Tab switcher */}
              <div style={{ display: 'flex', marginBottom: 22, background: 'var(--bg3)', borderRadius: 10, padding: 3 }}>
                {['login', 'signup'].map(m => (
                  <button key={m} type="button"
                    onClick={() => { setMode(m); clear() }}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 12, border: 'none',
                      background: mode === m ? 'var(--bg2)' : 'transparent',
                      color: mode === m ? 'var(--text)' : 'var(--textM)',
                      fontWeight: mode === m ? 600 : 400, fontSize: 13,
                      cursor: 'pointer', fontFamily: 'inherit',
                      boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all .2s',
                    }}>
                    {m === 'login' ? 'Log In' : 'Sign Up'}
                  </button>
                ))}
              </div>

              {/* Google button */}
              <GoogleBtn onClick={handleGoogle} loading={gLoading}/>
              <Divider/>

              <Alert msg={error} type="error"/>
              <Alert msg={message} type="success"/>

              {!message && (
                <form onSubmit={handleSubmit}>
                  {mode === 'signup' && (
                    <Field label="Full Name" type="text" placeholder="Your full name"
                      value={fullName} onChange={e => setFullName(e.target.value)}/>
                  )}
                  <Field label="Email" type="email" placeholder="you@email.com"
                    value={email} onChange={e => setEmail(e.target.value)}/>
                  <Field
                    label="Password"
                    type="password"
                    placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  >
                    {mode === 'login' && (
                      <button type="button"
                        onClick={() => { setMode('forgot'); clear() }}
                        style={{ display: 'block', marginTop: 6, background: 'none', border: 'none',
                          color: 'var(--teal)', fontSize: 12, cursor: 'pointer',
                          fontFamily: 'inherit', padding: 0, fontWeight: 500 }}>
                        Forgot password?
                      </button>
                    )}
                  </Field>
                  <SubmitBtn loading={loading}
                    label={mode === 'login' ? 'Log In →' : 'Create Account →'}/>
                </form>
              )}
            </>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: 'var(--textD)' }}>
          Your progress is saved securely to your account
        </div>
      </div>
    </div>
  )
}
