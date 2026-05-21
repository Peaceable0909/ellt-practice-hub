import { useState, useEffect, useCallback } from 'react'
import { loadResults } from './lib/supabase'
import Nav from './components/Nav'
import Home from './components/Home'
import Practice from './components/Practice'
import MockTests from './components/MockTests'
import Progress from './components/Progress'
import LiveSessions from './components/LiveSessions'

export default function App() {
  const [dark, setDark] = useState(true)
  const [page, setPage] = useState('Home')
  const [results, setResults] = useState([])
  const [loadingResults, setLoadingResults] = useState(false)

  // Apply dark/light class to body
  useEffect(() => {
    document.body.className = dark ? '' : 'light'
  }, [dark])

  // Load saved results from Supabase on mount
  useEffect(() => {
    setLoadingResults(true)
    loadResults()
      .then(data => setResults(data))
      .catch(() => {})
      .finally(() => setLoadingResults(false))
  }, [])

  // Add a new result to local state (avoids an extra DB round-trip)
  const addResult = useCallback(row => {
    setResults(prev => [
      { ...row, completed_at: new Date().toISOString() },
      ...prev.filter(r => r.test_id !== row.test_id),
    ])
  }, [])

  const sharedProps = { results, addResult }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <Nav page={page} setPage={setPage} dark={dark} setDark={setDark} />

      {page === 'Home'          && <Home          setPage={setPage} results={results} />}
      {page === 'Practice'      && <Practice       {...sharedProps} />}
      {page === 'Mock Tests'    && <MockTests      {...sharedProps} />}
      {page === 'Progress'      && <Progress       {...sharedProps} loading={loadingResults} />}
      {page === 'Live Sessions' && <LiveSessions />}
    </div>
  )
}
