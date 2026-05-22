import { useState } from 'react'
import { Mail, Lock, User, Eye, EyeOff, Chrome } from 'lucide-react'
import { signIn, signUp, signInWithGoogle, sendPasswordReset, updatePassword } from '../lib/supabase'

function Field({ label, type, placeholder, value, onChange, icon: Icon, action }) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 13, fontWeight: 800, color: 'var(--textM)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--textD)', pointerEvents: 'none' }}>
            <Icon size={16} />
          </div>
        )}
        <input
          type={isPassword && show ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          style={{ paddingLeft: Icon ? 42 : 14, paddingRight: isPassword ? 44 : 14, fontSize: 15 }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--textD)' }}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {action && (
        <button type="button" onClick={action.fn}
          style={{ display: 'block', marginTop: 6, background: 'none', border: 'none', color: 'var(--green)', fontSize: 13, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', padding: 0, fontWeight: 700 }}>
          {action.label}
        </button>
      )}
    </div>
  )
}

function Alert({ msg, type }) {
  if (!msg) return null
  const isErr = type === 'error'
  return (
    <div style={{ marginBottom: 14, padding: '12px 14px', borderRadius: 12, fontSize: 13, lineHeight: 1.5, fontWeight: 600,
      background: isErr ? 'var(--coralBg)' : 'var(--greenBg)',
      border: `2px solid ${isErr ? 'var(--coral)' : 'var(--green)'}44`,
      color: isErr ? 'var(--coral)' : 'var(--green)' }}>
      {msg}
    </div>
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

  const clear = () => { setError(''); setMessage('') }

  const handleGoogle = async () => {
    clear(); setGLoading(true)
    const { error: err } = await signInWithGoogle()
    if (err) { setError(err.message); setGLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); clear(); setLoading(true)
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
      else setMessage('Reset link sent — check your inbox.')
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, margin: '0 auto 12px', background: 'var(--green)', border: '4px solid var(--greenD)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 24, color: '#fff' }}>E</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)' }}>ELLTPulse</div>
          <div style={{ fontSize: 13, color: 'var(--textM)', fontWeight: 600, marginTop: 3 }}>Oxford ELLT Practice Hub</div>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--bg2)', border: '2px solid var(--border)', borderBottom: '4px solid var(--borderB)', borderRadius: 20, padding: '24px 20px' }}>

          {/* Reset password */}
          {mode === 'reset' && (
            <>
              <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>Set new password</div>
              <div style={{ fontSize: 13, color: 'var(--textM)', fontWeight: 600, marginBottom: 18 }}>Choose a strong password for your account.</div>
              <Alert msg={error} type="error" /><Alert msg={message} type="success" />
              {!message && <form onSubmit={handleSubmit}>
                <Field label="New Password" type="password" placeholder="At least 6 characters" value={newPassword} onChange={e=>setNewPassword(e.target.value)} icon={Lock}/>
                <Field label="Confirm Password" type="password" placeholder="Repeat your new password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} icon={Lock}/>
                <button type="submit" disabled={loading} style={{ width:'100%', padding:'14px', borderRadius:12, border:'none', background:loading?'var(--border)':'var(--green)', color:loading?'var(--textM)':'#fff', fontWeight:900, fontSize:15, cursor:loading?'not-allowed':'pointer', fontFamily:'Nunito, sans-serif', borderBottom:`4px solid ${loading?'var(--border)':'var(--greenD)'}` }}>
                  {loading ? 'Saving...' : 'Update Password'}
                </button>
              </form>}
            </>
          )}

          {/* Forgot password */}
          {mode === 'forgot' && (
            <>
              <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>Forgot password?</div>
              <div style={{ fontSize: 13, color: 'var(--textM)', fontWeight: 600, marginBottom: 18 }}>Enter your email and we will send a reset link.</div>
              <Alert msg={error} type="error" /><Alert msg={message} type="success" />
              {!message && <form onSubmit={handleSubmit}>
                <Field label="Email" type="email" placeholder="you@email.com" value={email} onChange={e=>setEmail(e.target.value)} icon={Mail}/>
                <button type="submit" disabled={loading} style={{ width:'100%', padding:'14px', borderRadius:12, border:'none', background:loading?'var(--border)':'var(--green)', color:loading?'var(--textM)':'#fff', fontWeight:900, fontSize:15, cursor:loading?'not-allowed':'pointer', fontFamily:'Nunito, sans-serif', borderBottom:`4px solid ${loading?'var(--border)':'var(--greenD)'}` }}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>}
              <button type="button" onClick={()=>{setMode('login');clear()}} style={{ display:'block', textAlign:'center', width:'100%', marginTop:16, background:'none', border:'none', color:'var(--textM)', fontSize:13, cursor:'pointer', fontFamily:'Nunito, sans-serif', fontWeight:700 }}>
                Back to Log In
              </button>
            </>
          )}

          {/* Login / Signup */}
          {(mode === 'login' || mode === 'signup') && (
            <>
              {/* Tabs */}
              <div style={{ display:'flex', marginBottom:20, background:'var(--bg3)', borderRadius:12, padding:3 }}>
                {['login','signup'].map(m => (
                  <button key={m} type="button" onClick={()=>{setMode(m);clear()}} style={{ flex:1, padding:'10px 0', borderRadius:10, border:'none', background:mode===m?'var(--bg2)':'transparent', color:mode===m?'var(--text)':'var(--textM)', fontWeight:mode===m?900:600, fontSize:14, cursor:'pointer', fontFamily:'Nunito, sans-serif', boxShadow:mode===m?'0 1px 4px rgba(0,0,0,0.1)':'none', transition:'all .2s' }}>
                    {m === 'login' ? 'Log In' : 'Sign Up'}
                  </button>
                ))}
              </div>

              {/* Google */}
              <button type="button" onClick={handleGoogle} disabled={gLoading} style={{ width:'100%', padding:'12px', borderRadius:12, border:'2px solid var(--border)', borderBottom:'4px solid var(--borderB)', background:'var(--bg3)', color:'var(--text)', fontWeight:800, fontSize:14, cursor:gLoading?'not-allowed':'pointer', fontFamily:'Nunito, sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:16, minHeight:48 }}>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.5 30.3 0 24 0 14.7 0 6.7 5.4 2.7 13.3l7.9 6.1C12.5 13.2 17.8 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17z"/>
                  <path fill="#FBBC05" d="M10.6 28.6A14.8 14.8 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6L2.4 13.3A24 24 0 0 0 0 24c0 3.8.9 7.4 2.5 10.6l8.1-6z"/>
                  <path fill="#34A853" d="M24 48c6.3 0 11.7-2.1 15.6-5.7l-7.5-5.8c-2.1 1.4-4.8 2.2-8.1 2.2-6.2 0-11.5-4.2-13.4-9.8l-8 6.1C6.6 42.5 14.7 48 24 48z"/>
                </svg>
                {gLoading ? 'Connecting...' : 'Continue with Google'}
              </button>

              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                <div style={{ flex:1, height:'1px', background:'var(--border)' }}/>
                <span style={{ fontSize:12, color:'var(--textD)', fontWeight:700 }}>OR</span>
                <div style={{ flex:1, height:'1px', background:'var(--border)' }}/>
              </div>

              <Alert msg={error} type="error" /><Alert msg={message} type="success" />

              {!message && <form onSubmit={handleSubmit}>
                {mode === 'signup' && <Field label="Full Name" type="text" placeholder="Your full name" value={fullName} onChange={e=>setFullName(e.target.value)} icon={User}/>}
                <Field label="Email" type="email" placeholder="you@email.com" value={email} onChange={e=>setEmail(e.target.value)} icon={Mail}/>
                <Field label="Password" type="password" placeholder={mode==='signup'?'At least 6 characters':'Your password'} value={password} onChange={e=>setPassword(e.target.value)} icon={Lock}
                  action={mode==='login' ? { label:'Forgot password?', fn:()=>{setMode('forgot');clear()} } : null}/>
                <button type="submit" disabled={loading} style={{ width:'100%', padding:'14px', borderRadius:12, border:'none', background:loading?'var(--border)':'var(--green)', color:loading?'var(--textM)':'#fff', fontWeight:900, fontSize:15, cursor:loading?'not-allowed':'pointer', fontFamily:'Nunito, sans-serif', borderBottom:`4px solid ${loading?'var(--border)':'var(--greenD)'}`, marginTop:4 }}>
                  {loading ? 'Please wait...' : mode==='login' ? 'Log In' : 'Create Account'}
                </button>
              </form>}
            </>
          )}
        </div>

        <div style={{ textAlign:'center', marginTop:14, fontSize:12, color:'var(--textD)', fontWeight:600 }}>
          Your progress is saved securely to your account
        </div>
      </div>
    </div>
  )
}
