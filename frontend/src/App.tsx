import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts';
import {
  Wallet, Home, Activity, PieChart as PieChartIcon,
  Plus, LogOut, Search, CircleCheck,
  Coffee, Bus, Utensils, ShoppingCart, Paintbrush, Car, HandCoins, GraduationCap, Pill,
  Pizza, Ticket, Zap, ShoppingBag, HeartPulse, BookOpen, Package,
  TrendingUp, Inbox, X, Save, Edit3, Trash2, CheckCircle2
} from 'lucide-react';
import './App.css';

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────
interface Expense {
  id: string;
  amount: string;
  category: string;
  description: string;
  expense_date: string;
}
interface SummaryData {
  total: number;
  breakdown: { category: string; total: number }[];
}

// ─────────────────────────────────────────────
//  DUMMY DATA  (used for charts & demo feel)
// ─────────────────────────────────────────────
const AREA_DATA = [
  { day: '1 Sep', amount: 420 },  { day: '3 Sep', amount: 760 },
  { day: '5 Sep', amount: 620 },  { day: '7 Sep', amount: 1100 },
  { day: '9 Sep', amount: 970 },  { day: '11 Sep', amount: 1340 },
  { day: '13 Sep', amount: 1210 },{ day: '15 Sep', amount: 1580 },
  { day: '17 Sep', amount: 1450 },{ day: '19 Sep', amount: 1820 },
  { day: '21 Sep', amount: 2100 },{ day: '23 Sep', amount: 1940 },
  { day: '25 Sep', amount: 2260 },{ day: '27 Sep', amount: 2500 },
  { day: '29 Sep', amount: 2362 },
];

const BAR_DATA = [
  { month: 'Apr', amount: 18400 }, { month: 'May', amount: 22100 },
  { month: 'Jun', amount: 19800 }, { month: 'Jul', amount: 24300 },
  { month: 'Aug', amount: 21700 }, { month: 'Sep', amount: 23620 },
];

const DUMMY_INCOME = 62400;

const DEMO_TRANSACTIONS: {
  id: string; icon: React.ReactNode; color: string; name: string;
  sub: string; amount: number; date: string; group: string; type: 'expense'|'income';
}[] = [
  { id:'t1', icon:<Coffee size={20}/>,       color:'#7C4B2A', name:'Blue Bottle Coffee',  sub:'Dining · Amex —3009',        amount:-675,    date:'7 Sep 2026', group:'TODAY',     type:'expense' },
  { id:'t2', icon:<Bus size={20}/>,          color:'#1a3a5c', name:'Muni Transit',        sub:'Transport · Everyday —4021', amount:-3500,   date:'7 Sep 2026', group:'TODAY',     type:'expense' },
  { id:'t3', icon:<Utensils size={20}/>,     color:'#1a4a2e', name:'Sweetgreen',          sub:'Dining · Amex —3009',        amount:-1840,   date:'7 Sep 2026', group:'TODAY',     type:'expense' },
  { id:'t4', icon:<ShoppingCart size={20}/>, color:'#1a3a1a', name:'Whole Foods Market',  sub:'Groceries · Amex —3009',     amount:-8422,   date:'6 Sep 2026', group:'YESTERDAY', type:'expense' },
  { id:'t5', icon:<Paintbrush size={20}/>,   color:'#1e1a40', name:'Figma',               sub:'Subscriptions · Amex —3009', amount:-1500,   date:'6 Sep 2026', group:'YESTERDAY', type:'expense' },
  { id:'t6', icon:<Car size={20}/>,          color:'#ff0084', name:'Lyft',                sub:'Transport · Amex —3009',     amount:-2160,   date:'6 Sep 2026', group:'YESTERDAY', type:'expense' },
  { id:'t7', icon:<HandCoins size={20}/>,    color:'#1a3a2a', name:'Salary — Forbit',     sub:'Income · HDFC —8821',        amount:312000,  date:'5 Sep 2026', group:'5 SEP',     type:'income'  },
  { id:'t8', icon:<GraduationCap size={20}/>,color:'#1a2a4a', name:'Udemy Course',        sub:'Education · Amex —3009',     amount:-1299,   date:'4 Sep 2026', group:'4 SEP',     type:'expense' },
  { id:'t9', icon:<Pill size={20}/>,         color:'#1a1a4a', name:'Apollo Pharmacy',     sub:'Health · Amex —3009',        amount:-560,    date:'3 Sep 2026', group:'3 SEP',     type:'expense' },
];

// ─────────────────────────────────────────────
//  CATEGORY CONFIG
// ─────────────────────────────────────────────
const CATEGORIES = [
  { name:'Food',           icon:<Pizza size={18}/>,         color:'#f97316' },
  { name:'Transportation', icon:<Car size={18}/>,           color:'#3b82f6' },
  { name:'Entertainment',  icon:<Ticket size={18}/>,        color:'#a855f7' },
  { name:'Bills',          icon:<Zap size={18}/>,           color:'#f59e0b' },
  { name:'Shopping',       icon:<ShoppingBag size={18}/>,   color:'#ec4899' },
  { name:'Health',         icon:<HeartPulse size={18}/>,    color:'#10b981' },
  { name:'Education',      icon:<BookOpen size={18}/>,      color:'#14b8a6' },
  { name:'Other',          icon:<Package size={18}/>,       color:'#64748b' },
];
const getCatConfig = (name: string) =>
  CATEGORIES.find(c => c.name === name) ?? CATEGORIES[7];

// ─────────────────────────────────────────────
//  CUSTOM TOOLTIP
// ─────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="custom-tooltip-label">{label}</div>
      <strong>₹{payload[0].value.toLocaleString('en-IN')}</strong>
    </div>
  );
};

// ─────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  // Auth
  const [token,        setToken]        = useState<string|null>(localStorage.getItem('token'));
  const [isLogin,      setIsLogin]      = useState(true);
  const [authEmail,    setAuthEmail]    = useState('');
  const [authPass,     setAuthPass]     = useState('');
  const [authError,    setAuthError]    = useState('');

  // Data
  const [expenses,     setExpenses]     = useState<Expense[]>([]);
  const [summary,      setSummary]      = useState<SummaryData>({ total: 0, breakdown: [] });

  // UI
  const [activePage,   setActivePage]   = useState<'home'|'activity'|'insights'>('home');
  const [period,       setPeriod]       = useState<'Week'|'Month'|'Year'>('Month');
  const [showAdd,      setShowAdd]      = useState(false);
  const [searchQ,      setSearchQ]      = useState('');
  const [txFilter,     setTxFilter]     = useState<'All'|'Expenses'|'Income'>('All');
  const [editingId,    setEditingId]    = useState<string|null>(null);

  // Form
  const [fAmount,      setFAmount]      = useState('');
  const [fCategory,    setFCategory]    = useState('Food');
  const [fDesc,        setFDesc]        = useState('');
  const [fDate,        setFDate]        = useState('');
  const [fType,        setFType]        = useState<'Expense'|'Income'>('Expense');

  // ── Effects ──
  useEffect(() => { if (token) { fetchExpenses(); fetchSummary(); } }, [token]);

  // ── Helpers ──
  const authH = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  });

  const fetchSummary = () => {
    if (!token) return;
    fetch('http://localhost:3000/api/expenses/summary', { headers: authH() })
      .then(r => { if (r.status === 401) handleLogout(); return r.json(); })
      .then(d => setSummary(d)).catch(console.error);
  };

  const fetchExpenses = () => {
    if (!token) return;
    fetch('http://localhost:3000/api/expenses', { headers: authH() })
      .then(r => r.json()).then(d => setExpenses(d)).catch(console.error);
  };

  // ── Auth ──
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault(); setAuthError('');
    try {
      const res  = await fetch(`http://localhost:3000/api/auth/${isLogin?'login':'register'}`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email: authEmail, password: authPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem('token', data.token);
      setToken(data.token); setAuthEmail(''); setAuthPass('');
    } catch (err: any) { setAuthError(err.message); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null); setExpenses([]); setSummary({ total:0, breakdown:[] });
  };

  // ── CRUD ──
  const resetForm = () => {
    setFAmount(''); setFCategory('Food'); setFDesc('');
    setFDate(''); setEditingId(null); setShowAdd(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = JSON.stringify({
      amount: parseFloat(fAmount), category: fCategory,
      description: fDesc, expense_date: fDate,
    });
    const url = editingId
      ? `http://localhost:3000/api/expenses/${editingId}`
      : 'http://localhost:3000/api/expenses';
    try {
      const res = await fetch(url, { method: editingId?'PUT':'POST', headers: authH(), body });
      if (res.ok) { resetForm(); fetchExpenses(); fetchSummary(); }
    } catch (err) { console.error(err); }
  };

  const handleEditClick = (exp: Expense) => {
    setEditingId(exp.id); setFAmount(exp.amount.toString());
    setFCategory(exp.category); setFDesc(exp.description);
    setFDate(exp.expense_date.split('T')[0]); setShowAdd(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/expenses/${id}`, { method:'DELETE', headers: authH() });
      if (res.ok) { fetchExpenses(); fetchSummary(); }
    } catch (err) { console.error(err); }
  };

  // ── Derived ──
  const totalSpent    = summary.total || 0;
  const change        = '+9% vs last month';
  const maxBreakdown  = Math.max(...summary.breakdown.map(b => b.total), 1);

  // Merge real breakdown with category colors for donut
  const donutData = summary.breakdown.length > 0
    ? summary.breakdown.map(b => ({ ...b, color: getCatConfig(b.category).color }))
    : CATEGORIES.slice(0,5).map((c,i)=>({ category:c.name, total:[48,16,13,11,12][i], color:c.color }));

  const donutTotal = donutData.reduce((s,d)=>s+d.total, 0);

  // Filter transactions (real expenses)
  const realTxs = expenses.map(e => ({
    id: e.id, icon: getCatConfig(e.category).icon,
    color: getCatConfig(e.category).color + '33',
    name: e.description, sub: e.category,
    amount: -parseFloat(e.amount),
    date: new Date(e.expense_date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }),
    group: 'MY EXPENSES', type: 'expense' as const,
  }));

  const allTxs = [...DEMO_TRANSACTIONS, ...realTxs];
  const filteredTxs = allTxs
    .filter(t => txFilter === 'All' || (txFilter === 'Expenses' ? t.type==='expense' : t.type==='income'))
    .filter(t => !searchQ || t.name.toLowerCase().includes(searchQ.toLowerCase()));

  const txGroups = filteredTxs.reduce<Record<string,typeof allTxs>>((acc, t) => {
    (acc[t.group] = acc[t.group] || []).push(t); return acc;
  }, {});

  // ── AUTH SCREEN ──────────────────────────────────────────────────────────────
  if (!token) return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-mark"><Wallet size={20} color="#fff" strokeWidth={2.5}/></div>
          <span className="auth-logo-name">FinTrack</span>
        </div>
        <h1 className="auth-h1">{isLogin ? 'Welcome back' : 'Get started'}</h1>
        <p className="auth-sub">
          {isLogin ? 'Sign in to your personal finance dashboard.' : 'Create your private expense tracker account.'}
        </p>
        {authError && <div className="auth-error">{authError}</div>}
        <form onSubmit={handleAuth}>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input className="auth-input" type="email" placeholder="you@example.com"
              value={authEmail} onChange={e=>setAuthEmail(e.target.value)} required />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input className="auth-input" type="password" placeholder="••••••••"
              value={authPass} onChange={e=>setAuthPass(e.target.value)} required />
          </div>
          <button className="auth-submit" type="submit">
            {isLogin ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>
        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={()=>{setIsLogin(!isLogin);setAuthError('');}}>
            {isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  );

  // ── DASHBOARD ────────────────────────────────────────────────────────────────
  return (
    <div className="app-shell">
      {/* ── Sidebar ── */}
      <nav className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark"><Wallet size={18} color="#fff" strokeWidth={2.5}/></div>
          <span className="sidebar-logo-name">FinTrack</span>
        </div>

        <span className="nav-section-label">Main</span>
        {([
          { id:'home',     icon:<Home size={20}/>, label:'Home'     },
          { id:'activity', icon:<Activity size={20}/>, label:'Activity'  },
          { id:'insights', icon:<PieChartIcon size={20}/>, label:'Insights'  },
        ] as const).map(item => (
          <button key={item.id}
            className={`nav-item${activePage===item.id?' active':''}`}
            onClick={()=>setActivePage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>{item.label}
          </button>
        ))}

        <span className="nav-section-label hide-on-mobile">Account</span>
        <button className="nav-item hide-on-mobile" onClick={()=>setShowAdd(true)}>
          <span className="nav-icon"><Plus size={20}/></span>Add Expense
        </button>

        <div className="sidebar-bottom">
          <div className="sidebar-user" onClick={handleLogout} title="Click to sign out">
            <div className="user-avatar">
              {authEmail ? authEmail[0].toUpperCase() : 'U'}
            </div>
            <span className="user-email">{authEmail || 'My Account'}</span>
            <span className="signout-icon"><LogOut size={16}/></span>
          </div>
        </div>
      </nav>

      {/* ── Page Content ── */}
      <main className="page-content">

        {/* ════════ HOME PAGE ════════ */}
        {activePage === 'home' && (
          <>
            <div className="page-header">
              <div>
                <div className="page-title">Net Cash Flow · Sep</div>
                <div className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CircleCheck size={14} color="#00d084"/> Updated just now · connected to backend
                </div>
              </div>
              <div className="page-date">
                {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
              </div>
            </div>

            <div className="home-grid">
              {/* Hero chart card */}
              <div className="hero-card">
                <div className="hero-label">Total Spent · September</div>
                <div className="hero-amount">
                  <span className="currency">₹</span>
                  {totalSpent > 0
                    ? totalSpent.toLocaleString('en-IN', {minimumFractionDigits:2})
                    : '23,621.80'}
                </div>
                <span className="hero-badge">▲ {change}</span>

                <div className="period-toggle">
                  {(['Week','Month','Year'] as const).map(p=>(
                    <button key={p} className={`period-btn${period===p?' active':''}`}
                      onClick={()=>setPeriod(p)}>{p}</button>
                  ))}
                </div>

                {/* Area Chart */}
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={AREA_DATA} margin={{top:0,right:0,left:-30,bottom:0}}>
                    <defs>
                      <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#f5a623" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#f5a623" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{fill:'#55556a',fontSize:11}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill:'#55556a',fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v}`} />
                    <Tooltip content={<ChartTooltip/>} cursor={{stroke:'rgba(245,166,35,0.2)',strokeWidth:1}}/>
                    <Area type="monotone" dataKey="amount" stroke="#f5a623" strokeWidth={2.5}
                      fill="url(#goldGrad)" dot={false} activeDot={{r:5,fill:'#f5a623',strokeWidth:0}}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Donut card */}
              <div className="donut-card">
                <div className="card-label">Spending Breakdown</div>
                <div className="donut-wrap">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie data={donutData} dataKey="total" innerRadius={52} outerRadius={72}
                        paddingAngle={3} stroke="none">
                        {donutData.map((d,i)=><Cell key={i} fill={d.color}/>)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="donut-center">
                    <div className="donut-center-label">SPENT</div>
                    <div className="donut-center-val">
                      ₹{totalSpent > 0
                        ? Math.round(totalSpent/1000)+'k'
                        : '23k'}
                    </div>
                  </div>
                </div>

                <div className="cat-legend">
                  {donutData.map(d=>(
                    <div key={d.category} className="cat-legend-row">
                      <div className="cat-legend-left">
                        <div className="cat-dot" style={{background:d.color}}/>
                        <span className="cat-legend-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ opacity: 0.8 }}>{getCatConfig(d.category).icon}</span> {d.category}
                        </span>
                      </div>
                      <span className="cat-legend-pct">
                        {Math.round((d.total/donutTotal)*100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* IN / OUT row */}
              <div className="inout-grid">
                <div className="inout-card">
                  <div className="inout-label">In · September</div>
                  <div className="inout-amount green">₹{(DUMMY_INCOME).toLocaleString('en-IN')}</div>
                  <div className="inout-bar green"/>
                </div>
                <div className="inout-card">
                  <div className="inout-label">Out · September</div>
                  <div className="inout-amount red">
                    ₹{totalSpent>0 ? totalSpent.toLocaleString('en-IN',{maximumFractionDigits:0}) : '23,622'}
                  </div>
                  <div className="inout-bar red"/>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ════════ ACTIVITY PAGE ════════ */}
        {activePage === 'activity' && (
          <>
            <div className="page-header">
              <div>
                <div className="page-title">Activity</div>
                <div className="page-subtitle">{allTxs.length} transactions this month</div>
              </div>
            </div>

            <div className="search-box">
              <span className="search-icon-pos"><Search size={16}/></span>
              <input className="search-input" placeholder="Search merchants, notes, amounts..."
                value={searchQ} onChange={e=>setSearchQ(e.target.value)}/>
            </div>

            <div className="activity-filters">
              {(['All','Expenses','Income'] as const).map(f=>(
                <button key={f} className={`filter-chip${txFilter===f?' active':''}`}
                  onClick={()=>setTxFilter(f)}>{f}</button>
              ))}
            </div>

            {Object.entries(txGroups).map(([group, txs])=>{
              const groupTotal = txs.reduce((s,t)=>s+t.amount,0);
              return (
                <div key={group}>
                  <div className="tx-group-label">
                    <span>{group}</span>
                    <span className="tx-group-total" style={{color: groupTotal>=0?'#00d084':'#ff9999'}}>
                      {groupTotal>=0?'+':''}{(groupTotal/100).toFixed(2).replace('-','−')} 
                    </span>
                  </div>
                  {txs.map(t=>(
                    <div key={t.id} className="tx-item">
                      <div className="tx-logo" style={{background:t.color}}>
                        {t.icon}
                      </div>
                      <div className="tx-body">
                        <div className="tx-name">{t.name}</div>
                        <div className="tx-sub">{t.sub}</div>
                      </div>
                      <div className="tx-right">
                        <div className={`tx-amount ${t.type}`} style={{color: t.type==='income'?'#00d084':'#f0f0f5'}}>
                          {t.type==='income' ? '+' : ''}₹{Math.abs(t.amount/100).toLocaleString('en-IN',{minimumFractionDigits:2})}
                        </div>
                        <div className="tx-date">{t.date}</div>
                      </div>
                      {t.type==='expense' && expenses.find(e=>e.id===t.id) && (
                        <div style={{display:'flex',gap:'6px',marginLeft:'12px'}}>
                          <button style={{background:'transparent',border:'1px solid rgba(245,166,35,0.3)',color:'#f5a623',padding:'4px 10px',borderRadius:'6px',cursor:'pointer',fontSize:'0.75rem',fontWeight:600, display: 'flex', alignItems: 'center', gap: '4px'}}
                            onClick={()=>handleEditClick(expenses.find(e=>e.id===t.id)!)}><Edit3 size={12}/> Edit</button>
                          <button style={{background:'transparent',border:'1px solid rgba(255,77,77,0.3)',color:'#ff4d4d',padding:'4px 10px',borderRadius:'6px',cursor:'pointer',fontSize:'0.75rem',fontWeight:600, display: 'flex', alignItems: 'center', gap: '4px'}}
                            onClick={()=>handleDelete(t.id)}><Trash2 size={12}/> Del</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </>
        )}

        {/* ════════ INSIGHTS PAGE ════════ */}
        {activePage === 'insights' && (
          <>
            <div className="page-header">
              <div>
                <div className="page-title">Insights</div>
                <div className="page-subtitle">Your financial health at a glance</div>
              </div>
            </div>

            {/* Monthly bar chart */}
            <div className="card" style={{marginBottom:'20px'}}>
              <div className="card-label">Monthly Spending — Last 6 Months</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={BAR_DATA} margin={{top:10,right:0,left:-20,bottom:0}}>
                  <XAxis dataKey="month" tick={{fill:'#55556a',fontSize:12}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:'#55556a',fontSize:11}} axisLine={false} tickLine={false}
                    tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
                  <Tooltip content={<ChartTooltip/>}/>
                  <Bar dataKey="amount" radius={[6,6,0,0]}>
                    {BAR_DATA.map((_,i)=>(
                      <Cell key={i} fill={i===BAR_DATA.length-1?'#f5a623':'#1c1c28'}
                        stroke={i===BAR_DATA.length-1?'none':'rgba(255,255,255,0.07)'}/>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="insights-grid">
              <div className="stat-card">
                <div className="stat-card-label">Avg. Daily Spend</div>
                <div className="stat-card-val">₹{totalSpent>0 ? Math.round(totalSpent/30).toLocaleString('en-IN') : '787'}</div>
                <div className="stat-card-sub">Based on current month</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">Largest Category</div>
                <div className="stat-card-val">
                  {summary.breakdown[0]?.category ?? 'Bills'}
                </div>
                <div className="stat-card-sub">
                  ₹{summary.breakdown[0]
                    ? summary.breakdown[0].total.toLocaleString('en-IN',{maximumFractionDigits:0})
                    : '11,340'} this month
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">Savings Rate</div>
                <div className="stat-card-val" style={{color:'#00d084'}}>
                  {totalSpent > 0
                    ? Math.max(0, Math.round((1 - totalSpent / DUMMY_INCOME) * 100)) + '%'
                    : '62%'}
                </div>
                <div className="stat-card-sub">Of monthly income saved</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">Health Score</div>
                <div className="health-ring-wrap">
                  <div className="health-score-num" style={{color:'#00d084'}}>82</div>
                  <div>
                    <div className="health-score-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Strong <TrendingUp size={16} color="#00d084"/></div>
                    <div className="health-score-sub">▲ 4 pts this month</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* ── FAB ── */}
      <button className="fab" onClick={()=>setShowAdd(true)} title="Add expense"><Plus size={28} strokeWidth={2.5}/></button>

      {/* ── Add / Edit Panel ── */}
      {showAdd && (
        <div className="add-overlay" onClick={e=>{ if(e.target===e.currentTarget) resetForm(); }}>
          <div className="add-panel">
            <div className="add-panel-header">
              <span className="add-panel-title">{editingId ? 'Edit Expense' : 'New Transaction'}</span>
              <button className="close-btn" onClick={resetForm}><X size={18}/></button>
            </div>

            <div className="type-toggle">
              {(['Expense','Income'] as const).map(t=>(
                <button key={t} className={`type-btn${fType===t?' active':''}`} onClick={()=>setFType(t)}>{t}</button>
              ))}
            </div>

            <div className="amount-display">
              {fAmount
                ? <><span className="cur-sym">₹</span>{parseFloat(fAmount).toLocaleString('en-IN')}</>
                : <span className="placeholder">₹0</span>
              }
            </div>

            <form onSubmit={handleSave}>
              <div className="field-row">
                <label className="field-label">Amount</label>
                <input className="field-input" type="number" step="0.01" min="0"
                  placeholder="Enter amount" value={fAmount} onChange={e=>setFAmount(e.target.value)} required/>
              </div>

              <div className="field-row">
                <label className="field-label">Category</label>
                <div className="cat-chips">
                  {CATEGORIES.map(c=>(
                    <button key={c.name} type="button"
                      className={`cat-chip${fCategory===c.name?' sel':''}`}
                      onClick={()=>setFCategory(c.name)}>
                      {c.icon} {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field-row">
                <label className="field-label">Description</label>
                <input className="field-input" type="text" placeholder="What did you spend on?"
                  value={fDesc} onChange={e=>setFDesc(e.target.value)} required/>
              </div>

              <div className="field-row">
                <label className="field-label">Date</label>
                <input className="field-input" type="date"
                  value={fDate} onChange={e=>setFDate(e.target.value)} required/>
              </div>

              <button type="submit" className="save-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {editingId ? <><Save size={18}/> Save Changes</> : <><CheckCircle2 size={18}/> Add Transaction</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
