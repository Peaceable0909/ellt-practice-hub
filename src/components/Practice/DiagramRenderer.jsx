import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// ─── Chart/Diagram renderer for writing tasks and listening maps ───────────────

export default function DiagramRenderer({ taskId }) {
  const Component = DIAGRAMS[taskId]
  if (!Component) return null
  return (
    <div style={{ background:'var(--bg3)', border:'2px solid var(--border)', borderRadius:16, padding:16, marginBottom:18 }}>
      <div style={{ fontSize:10, fontWeight:700, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:10 }}>📊 Refer to this diagram when writing your answer</div>
      <Component />
    </div>
  )
}

// ─── Writing Task 1 Charts ────────────────────────────────────────────────────

// wt1 — Grandville Stadium attendance
function GrandvilleChart() {
  const data = [
    { year:'2005', football:28000, rugby:12000, athletics:8000 },
    { year:'2008', football:32000, rugby:14000, athletics:9500 },
    { year:'2011', football:35000, rugby:18000, athletics:11000 },
    { year:'2014', football:38000, rugby:22000, athletics:10000 },
    { year:'2017', football:41000, rugby:26000, athletics:13000 },
  ]
  return (
    <div>
      <div style={{ fontSize:13, fontWeight:800, color:'var(--text)', marginBottom:4, textAlign:'center' }}>Grandville Stadium — Annual Attendance (thousands)</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top:5, right:10, left:0, bottom:5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="year" tick={{ fontSize:11, fill:'var(--textM)' }} />
          <YAxis tick={{ fontSize:11, fill:'var(--textM)' }} tickFormatter={v => `${v/1000}k`} />
          <Tooltip formatter={v => v.toLocaleString()} />
          <Legend wrapperStyle={{ fontSize:11 }} />
          <Bar dataKey="football"  fill="#1CB0F6" name="Football" />
          <Bar dataKey="rugby"     fill="#58CC02" name="Rugby" />
          <Bar dataKey="athletics" fill="#FF9600" name="Athletics" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// wi2 — Further Education in Britain
function FurtherEdChart() {
  const data = [
    { period:'1970/71', menFT:1150, womenFT:720,  menPT:1450, womenPT:680  },
    { period:'1980/81', menFT:1250, womenFT:1000, menPT:1650, womenPT:1050 },
    { period:'1990/91', menFT:1300, womenFT:1350, menPT:1700, womenPT:1750 },
  ]
  return (
    <div>
      <div style={{ fontSize:13, fontWeight:800, color:'var(--text)', marginBottom:2, textAlign:'center' }}>Further Education in Britain — Men and Women (thousands)</div>
      <div style={{ fontSize:11, color:'var(--textM)', textAlign:'center', marginBottom:8 }}>Full-time and Part-time students across three periods</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top:5, right:10, left:0, bottom:5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="period" tick={{ fontSize:10, fill:'var(--textM)' }} />
          <YAxis tick={{ fontSize:11, fill:'var(--textM)' }} tickFormatter={v => `${v}k`} />
          <Tooltip formatter={v => `${v},000`} />
          <Legend wrapperStyle={{ fontSize:10 }} />
          <Bar dataKey="menFT"    fill="#1CB0F6" name="Men (Full-time)" />
          <Bar dataKey="womenFT"  fill="#CE82FF" name="Women (Full-time)" />
          <Bar dataKey="menPT"    fill="#58CC02" name="Men (Part-time)" />
          <Bar dataKey="womenPT"  fill="#FF9600" name="Women (Part-time)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// wo1 — Radio and TV Audiences 1992
function RadioTVChart() {
  const data = [
    { time:'6am',  radio:2,  tv:0  }, { time:'7am',  radio:15, tv:2  },
    { time:'8am',  radio:28, tv:4  }, { time:'9am',  radio:22, tv:7  },
    { time:'10am', radio:15, tv:12 }, { time:'11am', radio:12, tv:14 },
    { time:'12pm', radio:14, tv:18 }, { time:'1pm',  radio:18, tv:22 },
    { time:'2pm',  radio:12, tv:20 }, { time:'3pm',  radio:10, tv:22 },
    { time:'4pm',  radio:8,  tv:26 }, { time:'5pm',  radio:7,  tv:32 },
    { time:'6pm',  radio:8,  tv:42 }, { time:'7pm',  radio:6,  tv:52 },
    { time:'8pm',  radio:4,  tv:58 }, { time:'9pm',  radio:3,  tv:52 },
    { time:'10pm', radio:2,  tv:40 }, { time:'11pm', radio:1,  tv:22 },
  ]
  return (
    <div>
      <div style={{ fontSize:13, fontWeight:800, color:'var(--text)', marginBottom:2, textAlign:'center' }}>Radio and Television Audiences Throughout the Day (1992)</div>
      <div style={{ fontSize:11, color:'var(--textM)', textAlign:'center', marginBottom:8 }}>% of UK population listening/watching at each time</div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top:5, right:10, left:0, bottom:5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="time" tick={{ fontSize:9, fill:'var(--textM)' }} interval={2} />
          <YAxis tick={{ fontSize:11, fill:'var(--textM)' }} tickFormatter={v => `${v}%`} />
          <Tooltip formatter={v => `${v}%`} />
          <Legend wrapperStyle={{ fontSize:11 }} />
          <Line type="monotone" dataKey="radio" stroke="#FF9600" strokeWidth={2.5} dot={false} name="Radio" />
          <Line type="monotone" dataKey="tv"    stroke="#1CB0F6" strokeWidth={2.5} dot={false} name="Television" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// wo2 — International Tourism
function TourismDiagram() {
  return (
    <div style={{ padding:'0 4px' }}>
      <div style={{ fontSize:13, fontWeight:800, color:'var(--text)', marginBottom:12, textAlign:'center' }}>International Tourism — Key Data Points to Reference</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {[
          { label:'Global tourists 1950', value:'25 million', color:'var(--blue)' },
          { label:'Global tourists 2000', value:'700 million', color:'var(--blue)' },
          { label:'Tourism revenue (2000)', value:'$476 billion', color:'var(--green)' },
          { label:'Jobs supported globally', value:'1 in 12', color:'var(--amber)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background:'var(--bg2)', border:`2px solid ${color}44`, borderRadius:12, padding:'12px', textAlign:'center' }}>
            <div style={{ fontSize:18, fontWeight:900, color }}>{value}</div>
            <div style={{ fontSize:10, color:'var(--textM)', fontWeight:700, marginTop:4 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Listening Map / Plan Diagrams ────────────────────────────────────────────

// li7 — Town Library floor plan
function LibraryMap() {
  return (
    <div>
      <div style={{ fontSize:13, fontWeight:800, color:'var(--text)', marginBottom:8, textAlign:'center' }}>Town Library — Floor Plan</div>
      <div style={{ fontSize:11, color:'var(--textM)', marginBottom:10, textAlign:'center' }}>Label rooms 11–15 using the options provided</div>
      <svg viewBox="0 0 400 300" style={{ width:'100%', maxWidth:400, margin:'0 auto', display:'block' }} fontFamily="Arial, sans-serif">
        {/* Outer walls */}
        <rect x="20" y="20" width="360" height="260" fill="none" stroke="var(--text)" strokeWidth="2.5" />

        {/* Entrance at bottom */}
        <rect x="160" y="265" width="80" height="15" fill="var(--bg2)" stroke="var(--text)" strokeWidth="1.5" />
        <text x="200" y="277" textAnchor="middle" fontSize="10" fill="var(--text)" fontWeight="700">ENTRANCE</text>

        {/* Librarian's desk - right side near entrance */}
        <rect x="280" y="220" width="80" height="50" fill="#DDF4FF" stroke="#1CB0F6" strokeWidth="1.5" />
        <text x="320" y="242" textAnchor="middle" fontSize="9" fill="#1CB0F6" fontWeight="700">Librarian's</text>
        <text x="320" y="255" textAnchor="middle" fontSize="9" fill="#1CB0F6" fontWeight="700">Desk</text>

        {/* Room 11 - left side near entrance */}
        <rect x="20" y="180" width="100" height="90" fill="#F1DAFF" stroke="#CE82FF" strokeWidth="1.5" />
        <text x="70" y="222" textAnchor="middle" fontSize="11" fill="#CE82FF" fontWeight="900">11</text>
        <text x="70" y="238" textAnchor="middle" fontSize="9" fill="var(--textM)">?</text>

        {/* Room 12 - right side beyond desk */}
        <rect x="280" y="100" width="100" height="110" fill="#FFF0CD" stroke="#FF9600" strokeWidth="1.5" />
        <text x="330" y="153" textAnchor="middle" fontSize="11" fill="#FF9600" fontWeight="900">12</text>
        <text x="330" y="169" textAnchor="middle" fontSize="9" fill="var(--textM)">?</text>

        {/* Main library area in center */}
        <rect x="130" y="100" width="140" height="170" fill="var(--bg2)" stroke="var(--border)" strokeWidth="1" strokeDasharray="4" />
        <text x="200" y="170" textAnchor="middle" fontSize="10" fill="var(--textM)">Main Library</text>
        <text x="200" y="184" textAnchor="middle" fontSize="9" fill="var(--textD)">(Fiction / Non-fiction)</text>

        {/* Room 13 - far wall center */}
        <rect x="130" y="20" width="140" height="70" fill="#D7FFB8" stroke="#58CC02" strokeWidth="1.5" />
        <text x="200" y="53" textAnchor="middle" fontSize="11" fill="#58CC02" fontWeight="900">13</text>
        <text x="200" y="69" textAnchor="middle" fontSize="9" fill="var(--textM)">?</text>

        {/* Room 14 - left far */}
        <rect x="20" y="20" width="100" height="150" fill="#DDF4FF" stroke="#1CB0F6" strokeWidth="1.5" />
        <text x="70" y="92" textAnchor="middle" fontSize="11" fill="#1CB0F6" fontWeight="900">14</text>
        <text x="70" y="108" textAnchor="middle" fontSize="9" fill="var(--textM)">?</text>

        {/* Room 15 - right far */}
        <rect x="280" y="20" width="100" height="70" fill="#FFE5E5" stroke="#FF4B4B" strokeWidth="1.5" />
        <text x="330" y="53" textAnchor="middle" fontSize="11" fill="#FF4B4B" fontWeight="900">15</text>
        <text x="330" y="69" textAnchor="middle" fontSize="9" fill="var(--textM)">?</text>

        {/* Arrows for entrance direction */}
        <text x="200" y="257" textAnchor="middle" fontSize="16">↑</text>
      </svg>
      <div style={{ fontSize:10, color:'var(--textM)', textAlign:'center', marginTop:8 }}>
        Options: Art collection · Children's books · Computers · Local history · Meeting room · Multimedia · Periodicals · Reference books · Tourist info
      </div>
    </div>
  )
}

// lc17t3p2 — Local History Tour map
function HistoryTourMap() {
  const buildings = [
    { x:60,  y:60,  w:80, h:50, label:'A', color:'#D7FFB8', border:'#58CC02' },
    { x:180, y:60,  w:80, h:50, label:'B', color:'#DDF4FF', border:'#1CB0F6' },
    { x:300, y:60,  w:80, h:50, label:'C', color:'#FFF0CD', border:'#FF9600' },
    { x:60,  y:160, w:80, h:50, label:'D', color:'#F1DAFF', border:'#CE82FF' },
    { x:180, y:160, w:80, h:50, label:'E', color:'#FFE5E5', border:'#FF4B4B' },
    { x:300, y:160, w:80, h:50, label:'F', color:'#D0F5F1', border:'#18B8A8' },
    { x:130, y:260, w:80, h:50, label:'G', color:'#FFF0CD', border:'#FF9600' },
    { x:250, y:260, w:80, h:50, label:'H', color:'#D7FFB8', border:'#58CC02' },
  ]
  return (
    <div>
      <div style={{ fontSize:13, fontWeight:800, color:'var(--text)', marginBottom:8, textAlign:'center' }}>Local History Tour — Town Map</div>
      <div style={{ fontSize:11, color:'var(--textM)', marginBottom:10, textAlign:'center' }}>Match each location (A–H) to its historical use</div>
      <svg viewBox="0 0 440 340" style={{ width:'100%', maxWidth:440, margin:'0 auto', display:'block' }} fontFamily="Arial, sans-serif">
        {/* Roads */}
        <rect x="0" y="120" width="440" height="30" fill="#E5E5E5" />
        <rect x="0" y="220" width="440" height="30" fill="#E5E5E5" />
        <rect x="150" y="0" width="30" height="340" fill="#E5E5E5" />
        <rect x="270" y="0" width="30" height="340" fill="#E5E5E5" />
        <text x="220" y="138" textAnchor="middle" fontSize="9" fill="#999">HIGH STREET</text>
        <text x="220" y="238" textAnchor="middle" fontSize="9" fill="#999">MILL ROAD</text>

        {buildings.map(b => (
          <g key={b.label}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="4" fill={b.color} stroke={b.border} strokeWidth="2" />
            <text x={b.x + b.w/2} y={b.y + b.h/2 + 6} textAnchor="middle" fontSize="18" fill={b.border} fontWeight="900">{b.label}</text>
          </g>
        ))}

        {/* North arrow */}
        <text x="400" y="300" fontSize="20">↑</text>
        <text x="397" y="315" fontSize="9" fill="var(--textM)">North</text>
      </svg>
      <div style={{ fontSize:10, color:'var(--textM)', textAlign:'center', marginTop:8 }}>
        Options: Old bakery · Mill · Tannery · Port office · School · Jail · Church · Market
      </div>
    </div>
  )
}

// ─── Brick Manufacturing Process Diagram ──────────────────────────────────────
function BrickProcess() {
  const steps = [
    { n:1, label:'Clay Digging',       desc:'Clay dug from ground' },
    { n:2, label:'Grinding & Mixing',  desc:'Sand & water added' },
    { n:3, label:'Moulding',           desc:'Wire cut or moulded' },
    { n:4, label:'Drying',             desc:'24–48 hours in drying oven' },
    { n:5, label:'Kiln Firing',        desc:'1300°C for 2–3 days' },
    { n:6, label:'Cooling',            desc:'48–72 hours cooling' },
    { n:7, label:'Packaging & Delivery', desc:'Sorted and delivered' },
  ]
  return (
    <div>
      <div style={{ fontSize:13, fontWeight:800, color:'var(--text)', marginBottom:12, textAlign:'center' }}>The Brick Manufacturing Process</div>
      <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
        {steps.map((s, i) => (
          <div key={s.n} style={{ display:'flex', alignItems:'center', gap:0 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:0 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--blue)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:14, flexShrink:0 }}>{s.n}</div>
              {i < steps.length-1 && <div style={{ width:2, height:20, background:'var(--border)' }} />}
            </div>
            <div style={{ marginLeft:12, padding:'6px 0' }}>
              <div style={{ fontSize:13, fontWeight:800, color:'var(--text)' }}>{s.label}</div>
              <div style={{ fontSize:11, color:'var(--textM)', fontWeight:600 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


// ─── New Task 1 Charts ─────────────────────────────────────────────────────────

// wi4 — Consumer Expenditure UK vs France 2010
function ConsumerExpenditureChart() {
  const data = [
    { good:'Cars',      UK:450, France:400 },
    { good:'Computers', UK:350, France:360 },
    { good:'Books',     UK:400, France:300 },
    { good:'Perfume',   UK:145, France:200 },
    { good:'Cameras',   UK:360, France:150 },
  ]
  return (
    <div>
      <div style={{fontSize:13,fontWeight:800,color:'var(--text)',marginBottom:2,textAlign:'center'}}>Consumer Expenditure — UK vs France (2010)</div>
      <div style={{fontSize:11,color:'var(--textM)',textAlign:'center',marginBottom:8}}>Amount spent in thousands of pounds sterling (£000s)</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{top:5,right:10,left:0,bottom:5}}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="good" tick={{fontSize:10,fill:'var(--textM)'}} />
          <YAxis tick={{fontSize:10,fill:'var(--textM)'}} tickFormatter={v=>`£${v}k`} domain={[0,500]} />
          <Tooltip formatter={v=>`£${v},000`} />
          <Legend wrapperStyle={{fontSize:11}} />
          <Bar dataKey="UK"     fill="#1CB0F6" name="UK" />
          <Bar dataKey="France" fill="#CE82FF" name="France" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// wi5 — Consumption of Spreads 1981-2007
function SpreadsChart() {
  const data = [
    {year:'1981',butter:140,margarine:90,lowfat:0},
    {year:'1984',butter:130,margarine:92,lowfat:0},
    {year:'1986',butter:160,margarine:88,lowfat:0},
    {year:'1989',butter:120,margarine:85,lowfat:0},
    {year:'1991',butter:110,margarine:80,lowfat:0},
    {year:'1993',butter:95, margarine:75,lowfat:0},
    {year:'1996',butter:85, margarine:70,lowfat:10},
    {year:'1998',butter:75, margarine:65,lowfat:35},
    {year:'2001',butter:70, margarine:55,lowfat:82},
    {year:'2004',butter:60, margarine:48,lowfat:75},
    {year:'2007',butter:50, margarine:40,lowfat:70},
  ]
  return (
    <div>
      <div style={{fontSize:13,fontWeight:800,color:'var(--text)',marginBottom:2,textAlign:'center'}}>Consumption of Spreads (1981–2007)</div>
      <div style={{fontSize:11,color:'var(--textM)',textAlign:'center',marginBottom:8}}>Grams per person per week</div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{top:5,right:10,left:0,bottom:5}}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="year" tick={{fontSize:9,fill:'var(--textM)'}} interval={1} />
          <YAxis tick={{fontSize:10,fill:'var(--textM)'}} tickFormatter={v=>`${v}g`} />
          <Tooltip formatter={v=>`${v}g`} />
          <Legend wrapperStyle={{fontSize:11}} />
          <Line type="monotone" dataKey="butter"    stroke="#FF9600" strokeWidth={2.5} dot={false} name="Butter" />
          <Line type="monotone" dataKey="margarine" stroke="#1CB0F6" strokeWidth={2.5} dot={false} name="Margarine" />
          <Line type="monotone" dataKey="lowfat"    stroke="#58CC02" strokeWidth={2.5} dot={false} name="Low-fat spreads" strokeDasharray="5 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// wi6 — Indian Students in British Universities
function IndianStudentsTable() {
  const rows = [
    { uni:'Coventry University',   y1:2390, y2:5290, change:2900,  pct:121.3 },
    { uni:'BBP University',        y1:3505, y2:5145, change:1640,  pct:46.8  },
    { uni:'Sheffield University',  y1:815,  y2:2345, change:1530,  pct:187.7 },
    { uni:'Leicester University',  y1:1175, y2:2390, change:1215,  pct:103.4 },
    { uni:'Univ of Greenwich',     y1:2455, y2:4540, change:2085,  pct:84.9  },
    { uni:'Anglia Ruskin Univ',    y1:1925, y2:3265, change:1340,  pct:69.6  },
  ].sort((a,b)=>b.pct-a.pct)
  return (
    <div>
      <div style={{fontSize:13,fontWeight:800,color:'var(--text)',marginBottom:2,textAlign:'center'}}>Indian Full-time Students in UK Universities</div>
      <div style={{fontSize:11,color:'var(--textM)',textAlign:'center',marginBottom:10}}>Academic years 2020/21 and 2021/22</div>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
          <thead>
            <tr style={{background:'var(--bg3)'}}>
              {['University','2020/21','2021/22','Change','% Rise'].map(h=>(
                <th key={h} style={{padding:'8px 6px',textAlign:'left',fontWeight:800,color:'var(--text)',borderBottom:'2px solid var(--border)',whiteSpace:'nowrap'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i} style={{background:i%2===0?'var(--bg2)':'var(--bg3)'}}>
                <td style={{padding:'8px 6px',color:'var(--text)',fontWeight:700}}>{r.uni}</td>
                <td style={{padding:'8px 6px',color:'var(--textM)',fontWeight:600}}>{r.y1.toLocaleString()}</td>
                <td style={{padding:'8px 6px',color:'var(--text)',fontWeight:800}}>{r.y2.toLocaleString()}</td>
                <td style={{padding:'8px 6px',color:'var(--green)',fontWeight:700}}>+{r.change.toLocaleString()}</td>
                <td style={{padding:'8px 6px',fontWeight:900,color:r.pct>100?'var(--green)':r.pct>70?'var(--amber)':'var(--textM)'}}>{r.pct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Register all diagrams ─────────────────────────────────────────────────────
const DIAGRAMS = {
  // Writing tasks
  'wt1':  GrandvilleChart,
  'wi2':  FurtherEdChart,
  'wo1':  RadioTVChart,
  'wo3':  TourismDiagram,
  // Listening map tasks
  'li7':  LibraryMap,
  'lc17t3p2': HistoryTourMap,
  // Process diagram
  'w_process': BrickProcess,
  // New Task 1 charts
  'wi4': ConsumerExpenditureChart,
  'wi5': SpreadsChart,
  'wi6': IndianStudentsTable,
}
