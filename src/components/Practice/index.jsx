import { useMemo } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Headphones, BookOpen, PenLine, Mic, ChevronLeft, ChevronRight, Target, Sparkles } from 'lucide-react'
import ListeningHub from './ListeningHub'
import ReadingHub from './ReadingHub'
import WritingHub from './WritingHub'
import SpeakingHub from './SpeakingHub'
import { SKILLS, SKILL_LABELS, skillScores, weakestSkill, formatSkillScore } from '../../lib/skillStats'
import { quietCard, backLink } from '../PlanBits'

const TABS = [
  { key:'Listening', Icon:Headphones, color:'var(--blue)',   bg:'var(--blueBg)'   },
  { key:'Reading',   Icon:BookOpen,   color:'var(--amber)',  bg:'var(--amberBg)'  },
  { key:'Writing',   Icon:PenLine,    color:'var(--purple)', bg:'var(--purpleBg)' },
  { key:'Speaking',  Icon:Mic,        color:'var(--coral)',  bg:'var(--coralBg)'  },
]

const SKILL_SLUGS = TABS.map(t => t.key.toLowerCase())
const tabFor = slug => TABS.find(t => t.key.toLowerCase() === slug)

export default function Practice({ results, addResult, userId }) {
  // The URL drives everything: /practice/:skill/:testId (listening|reading|writing|speaking).
  // /practice and any unknown skill fall back to Listening; an unknown testId shows the list.
  const { skill, testId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const slug = SKILL_SLUGS.includes(skill) ? skill : 'listening'
  const tab = tabFor(slug).key
  const listPath = `/practice/${slug}`

  // Opened from a plan task (router state { from: 'today' })? Carry that state through every
  // move inside Practice so the Back to Today bar survives switching tabs and opening tests.
  // fromList marks a test opened from this skill's list, i.e. the entry below it is that list.
  const { fromList, ...routeState } = location.state || {}
  const fromToday = routeState.from === 'today'

  const openTest = id => navigate(`${listPath}/${encodeURIComponent(id)}`, { state: { ...routeState, fromList: true } })
  // Back out of a test to its list: pop the list entry when the test was opened from it (so
  // Back / Next Test never skips past it). A test with no list below it - a deep link, or "Practise"
  // from the Full plan - gets the list swapped in for the test URL, so the student stays in Practice
  // and Back never loops.
  const closeTest = () => {
    if (fromList) navigate(-1)
    else navigate(listPath, { replace: true, state: routeState })
  }
  const hubProps = {
    results, addResult, userId,
    selectedId: testId,
    onSelect: id => (id ? openTest(id) : closeTest()),
  }

  return (
    <div className="app-container">
      {fromToday && (
        <Link to="/today" style={{ ...backLink, display: 'flex', width: '100%', marginBottom: 14, color: 'var(--blueT)', border: '2px solid var(--blueBdr)', borderBottom: '3px solid var(--blue)' }}>
          <ChevronLeft size={16} /> Back to Today
        </Link>
      )}

      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>Practice Hub</h2>
        <p style={{ color: 'var(--textM)', fontSize: 13, fontWeight: 600 }}>Real Oxford ELLT + IELTS tests — all content inline, no PDFs.</p>
      </div>

      {/* Out of the way while a test is open */}
      {!testId && <Recommended results={results} currentSlug={slug} state={routeState} />}

      {/* Scrollable tab bar for mobile */}
      <div className="tab-bar" style={{ marginBottom: 20 }}>
        {TABS.map(({ key, Icon, color, bg }) => (
          <Link key={key} to={`/practice/${key.toLowerCase()}`} state={routeState} aria-current={tab===key ? 'page' : undefined} style={{
            padding: '10px 16px', borderRadius: 14, textDecoration: 'none', boxSizing: 'border-box',
            border: tab===key ? `2px solid ${color}` : '2px solid var(--border)',
            borderBottom: tab===key ? `4px solid ${color}` : '4px solid var(--borderB)',
            background: tab===key ? bg : 'var(--bg2)',
            color: tab===key ? color : 'var(--textM)',
            fontWeight: 800, fontSize: 13, fontFamily: 'Nunito, sans-serif',
            display: 'flex', alignItems: 'center', gap: 6,
            textTransform: 'uppercase', letterSpacing: '0.4px',
            cursor: 'pointer', minHeight: 44, flexShrink: 0,
          }}>
            <Icon size={15} />
            {key}
          </Link>
        ))}
      </div>

      {tab === 'Listening' && <ListeningHub {...hubProps} />}
      {tab === 'Reading'   && <ReadingHub   {...hubProps} />}
      {tab === 'Writing'   && <WritingHub   {...hubProps} />}
      {tab === 'Speaking'  && <SpeakingHub  {...hubProps} />}
    </div>
  )
}

// ── Recommended ────────────────────────────────────────────────
// Points at the weakest skill once there are results in at least two skills. Before that
// there is nothing to compare, so it gently nudges toward a skill that has not been tried
// yet (Listening for a brand new student).
function Recommended({ results, currentSlug, state }) {
  const rec = useMemo(() => {
    const weakest = weakestSkill(results)   // null until two skills have results
    if (weakest) {
      const label = SKILL_LABELS[weakest.skill]
      return {
        skill: weakest.skill, Icon: Target,
        title: `Work on ${label}`,
        text: `Your ${label.toLowerCase()} average is ${formatSkillScore(weakest)}, your lowest skill. Extra practice here lifts your overall band fastest.`,
      }
    }
    const tried = skillScores(results)[0]?.skill
    const next = SKILLS.find(s => s !== tried)
    return {
      skill: next, Icon: Sparkles,
      title: tried ? `Try ${SKILL_LABELS[next]} next` : 'Start with Listening',
      text: tried
        ? `Once you have scores in two skills we will point you at the one that needs work. ${SKILL_LABELS[next]} is a good second.`
        : 'Not sure where to begin? Listening is a gentle first step, and it shows us where to focus your practice.',
    }
  }, [results])

  const { color } = tabFor(rec.skill)
  const here = rec.skill === currentSlug
  return (
    <div style={{ ...quietCard, border: `2px solid color-mix(in srgb, ${color} 45%, var(--border))`, borderBottom: `4px solid color-mix(in srgb, ${color} 45%, var(--borderB))`, padding: '12px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `color-mix(in srgb, ${color} 12%, var(--bg3))`, border: `2px solid color-mix(in srgb, ${color} 30%, var(--border))` }}>
        <rec.Icon size={20} color={color} />
      </div>
      <div style={{ flex: '1 1 180px', minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--textM)', textTransform: 'uppercase', letterSpacing: '0.7px' }}>Recommended</div>
        <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text)', lineHeight: 1.3 }}>{rec.title}</div>
        <div style={{ fontSize: 12, color: 'var(--textM)', fontWeight: 600, lineHeight: 1.5, marginTop: 2 }}>{rec.text}</div>
      </div>
      {here ? (
        <span style={{ fontSize: 11, fontWeight: 900, color, textTransform: 'uppercase', letterSpacing: '0.4px', flexShrink: 0 }}>Pick a test below</span>
      ) : (
        <Link to={`/practice/${rec.skill}`} state={state} style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4, minHeight: 40, padding: '9px 14px', borderRadius: 12, textDecoration: 'none', fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.4px', border: 'none', borderBottom: '4px solid var(--greenD)', background: 'var(--green)', color: '#fff' }}>
          Practise {SKILL_LABELS[rec.skill]} <ChevronRight size={14} />
        </Link>
      )}
    </div>
  )
}
