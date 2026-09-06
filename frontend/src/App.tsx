import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts';
import {
  Home, BarChart2, Layers, User, Plus, X,
  Sun, Moon, Bell, ChevronDown, TrendingUp, TrendingDown,
  Coffee, Bus, Utensils, ShoppingCart, Car, Paintbrush,
  HandCoins, GraduationCap, Pill, Pizza, Ticket, Zap,
  ShoppingBag, HeartPulse, BookOpen, Package,
  Edit3, Trash2, Save, CheckCircle2, Settings, Shield, LogOut,
  Wallet, ArrowUpRight, ArrowDownRight, AlertCircle, Target,
} from 'lucide-react';
import './App.css';

// ─── Types ───────────────────────────────────────────────────
interface Expense {
  id: string; amount: string; category: string;
  description: string; expense_date: string;
}
interface SummaryData {
  total: number; breakdown: { category: string; total: number }[];
}

// ─── Dummy Data ───────────────────────────────────────────────
const AREA_DATA = [
  { day: '1', amt: 420 },  { day: '3', amt: 760 },  { day: '5', amt: 580 },
  { day: '7', amt: 1100 }, { day: '9', amt: 870 },  { day: '11', amt: 1340 },
  { day: '13', amt: 1100 },{ day: '15', amt: 1520 }, { day: '17', amt: 1310 },
  { day: '19', amt: 1780 },{ day: '21', amt: 2040 }, { day: '23', amt: 1880 },
  { day: '25', amt: 2180 },{ day: '27', amt: 2420 }, { day: '29', amt: 2362 },
];
const BAR_DATA = [
  { m: 'Apr', v: 18400 }, { m: 'May', v: 22100 },
  { m: 'Jun', v: 19800 }, { m: 'Jul', v: 24300 },
  { m: 'Aug', v: 21700 }, { m: 'Sep', v: 23620 },
];
const DUMMY_INCOME   = 62400;
const DUMMY_BALANCE  = 38778.20;

const DEMO_TXS = [
  { id:'t1', icon:<Coffee size={17}/>,       bg:'#7C4B2A22', name:'Blue Bottle Coffee', sub:'Food & Drink', amount:-675,   date:'7 Sep 2026', group:'Today', type:'expense' as const },
  { id:'t2', icon:<Bus size={17}/>,          bg:'#1a3a5c33', name:'Metro Pass',         sub:'Transport',   amount:-3500,  date:'7 Sep 2026', group:'Today', type:'expense' as const },
  { id:'t3', icon:<ShoppingCart size={17}/>, bg:'#1a3a1a33', name:'Whole Foods',        sub:'Groceries',   amount:-8422,  date:'6 Sep 2026', group:'Yesterday', type:'expense' as const },
  { id:'t4', icon:<Paintbrush size={17}/>,   bg:'#1e1a4033', name:'Figma Pro',          sub:'Subscriptions',amount:-1500, date:'6 Sep 2026', group:'Yesterday', type:'expense' as const },
  { id:'t5', icon:<HandCoins size={17}/>,    bg:'#1a3a2a33', name:'Salary — Sep',       sub:'Income',      amount:62400,  date:'5 Sep 2026', group:'5 Sep', type:'income' as const },
  { id:'t6', icon:<GraduationCap size={17}/>,bg:'#1a2a4a33', name:'Udemy Course',       sub:'Education',   amount:-1299,  date:'4 Sep 2026', group:'4 Sep', type:'expense' as const },
  { id:'t7', icon:<Pill size={17}/>,         bg:'#1a1a4a33', name:'Apollo Pharmacy',    sub:'Health',      amount:-560,   date:'3 Sep 2026', group:'3 Sep', type:'expense' as const },
];

const CAT_REPORT = [
  { name:'Food',          pct:31, amt:7340.20, vs:'+8%',  isUp:true,  color:'#f97316', icon:<Pizza size={16}/>,       bg:'#f9731622' },
  { name:'Bills',         pct:24, amt:5680.00, vs:'-3%',  isUp:false, color:'#f59e0b', icon:<Zap size={16}/>,         bg:'#f59e0b22' },
  { name:'Shopping',      pct:18, amt:4260.50, vs:'+12%', isUp:true,  color:'#ec4899', icon:<ShoppingBag size={16}/>, bg:'#ec489922' },
  { name:'Transport',     pct:13, amt:3080.00, vs:'-1%',  isUp:false, color:'#3b82f6', icon:<Car size={16}/>,         bg:'#3b82f622' },
  { name:'Entertainment', pct:9,  amt:2130.00, vs:'+5%',  isUp:true,  color:'#8b5cf6', icon:<Ticket size={16}/>,      bg:'#8b5cf622' },
  { name:'Health',        pct:5,  amt:1185.00, vs:'-2%',  isUp:false, color:'#10b981', icon:<HeartPulse size={16}/>,  bg:'#10b98122' },
];

const GOALS = [
  { name:'House Down Payment', target:500000, saved:148750, color:'#7C3AED', icon:<Home size={16}/>, bg:'#7C3AED22', alert:true },
  { name:'Emergency Fund',     target:100000, saved:65000,  color:'#10b981', icon:<Shield size={16}/>, bg:'#10b98122', alert:false },
];
const BUDGETS = [
  { name:'Food & Dining',  budget:12000, spent:7340, color:'#f97316', icon:<Pizza size={16}/>, bg:'#f9731622' },
  { name:'Shopping',       budget:8000,  spent:4260, color:'#ec4899', icon:<ShoppingBag size={16}/>, bg:'#ec489922' },
  { name:'Transport',      budget:5000,  spent:3080, color:'#3b82f6', icon:<Car size={16}/>, bg:'#3b82f622' },
  { name:'Entertainment',  budget:4000,  spent:2130, color:'#8b5cf6', icon:<Ticket size={16}/>, bg:'#8b5cf622' },
];

// ─── Category config ─────────────────────────────────────────
const CATEGORIES = [
  { name:'Food',           icon:<Pizza size={16}/>,        color:'#f97316' },
  { name:'Transportation', icon:<Car size={16}/>,          color:'#3b82f6' },
  { name:'Entertainment',  icon:<Ticket size={16}/>,       color:'#8b5cf6' },
  { name:'Bills',          icon:<Zap size={16}/>,          color:'#f59e0b' },
  { name:'Shopping',       icon:<ShoppingBag size={16}/>,  color:'#ec4899' },
  { name:'Health',         icon:<HeartPulse size={16}/>,   color:'#10b981' },
  { name:'Education',      icon:<BookOpen size={16}/>,     color:'#14b8a6' },
  { name:'Other',          icon:<Package size={16}/>,      color:'#64748b' },
];
const getCat = (n: string) => CATEGORIES.find(c => c.name === n) ?? CATEGORIES[7];

// ─── Tooltip ──────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="custom-tooltip-label">{label}</div>
      <strong>₹{payload[0].value.toLocaleString('en-IN')}</strong>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────
export default function App() {
  // Auth
  const [token,     setToken]    = useState<string|null>(localStorage.getItem('token'));
  const [isLogin,   setIsLogin]  = useState(true);
  const [authEmail, setEmail]    = useState('');
  const [authPass,  setPass]     = useState('');
  const [authError, setError]    = useState('');

  // Data
  const [expenses,  setExpenses] = useState<Expense[]>([]);
  const [summary,   setSummary]  = useState<SummaryData>({ total: 0, breakdown: [] });

  // UI
  const [page,       setPage]    = useState<'home'|'report'|'plan'|'settings'>('home');
  const [theme,      setTheme]   = useState<'dark'|'light'>(() => (localStorage.getItem('theme') as any) || 'dark');
  const [showAdd,    setShowAdd] = useState(false);
  const [reportTab,  setRepTab]  = useState<'expenses'|'income'>('expenses');
  const [editingId,  setEditId]  = useState<string|null>(null);

  // Form
  const [fAmt,  setFAmt]  = useState('');
  const [fCat,  setFCat]  = useState('Food');
  const [fDesc, setFDesc] = useState('');
  const [fDate, setFDate] = useState('');
  const [fType, setFType] = useState<'Expense'|'Income'>('Expense');

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => { if (token) { fetchExp(); fetchSum(); } }, [token]);

  const authH = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` });

  const fetchSum = () => {
    if (!token) return;
    fetch('http://localhost:3000/api/expenses/summary', { headers: authH() })
      .then(r => { if (r.status === 401) logout(); return r.json(); })
      .then(d => setSummary(d)).catch(console.error);
  };
  const fetchExp = () => {
    if (!token) return;
    fetch('http://localhost:3000/api/expenses', { headers: authH() })
      .then(r => r.json()).then(setExpenses).catch(console.error);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    try {
      const res  = await fetch(`http://localhost:3000/api/auth/${isLogin ? 'login' : 'register'}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem('token', data.token);
      setToken(data.token); setEmail(''); setPass('');
    } catch (err: any) { setError(err.message); }
  };

  const logout = () => { localStorage.removeItem('token'); setToken(null); setExpenses([]); setSummary({ total: 0, breakdown: [] }); };

  const resetForm = () => { setFAmt(''); setFCat('Food'); setFDesc(''); setFDate(''); setEditId(null); setShowAdd(false); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = JSON.stringify({ amount: parseFloat(fAmt), category: fCat, description: fDesc, expense_date: fDate });
    const url  = editingId ? `http://localhost:3000/api/expenses/${editingId}` : 'http://localhost:3000/api/expenses';
    try {
      const res = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: authH(), body });
      if (res.ok) { resetForm(); fetchExp(); fetchSum(); }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/expenses/${id}`, { method: 'DELETE', headers: authH() });
      if (res.ok) { fetchExp(); fetchSum(); }
    } catch (err) { console.error(err); }
  };

  // Derived
  const totalSpent = summary.total || 0;
  const balance    = DUMMY_BALANCE;
  const donutData  = summary.breakdown.length > 0
    ? summary.breakdown.map(b => ({ name: b.category, value: b.total, color: getCat(b.category).color }))
    : CAT_REPORT.map(c => ({ name: c.name, value: c.pct, color: c.color }));

  // Group demo transactions
  const groups = DEMO_TXS.reduce<Record<string, typeof DEMO_TXS>>((acc, t) => {
    (acc[t.group] = acc[t.group] || []).push(t); return acc;
  }, {});

  // ── Theme toggle button ───────────────────────────────────────
  const ThemeToggle = () => (
    <button className="theme-toggle" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? <Sun size={14}/> : <Moon size={14}/>}
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );

  // ── AUTH ─────────────────────────────────────────────────────
  if (!token) return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-mark"><Wallet size={18} color="#fff"/></div>
          <span className="auth-logo-name">FinTrack</span>
        </div>
        <h1 className="auth-h1">{isLogin ? 'Welcome back' : 'Get started'}</h1>
        <p className="auth-sub">{isLogin ? 'Sign in to your finance dashboard.' : 'Create your private expense tracker.'}</p>
        {authError && <div className="auth-error">{authError}</div>}
        <form onSubmit={handleAuth}>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input className="auth-input" type="email" placeholder="you@example.com" value={authEmail} onChange={e=>setEmail(e.target.value)} required/>
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input className="auth-input" type="password" placeholder="••••••••" value={authPass} onChange={e=>setPass(e.target.value)} required/>
          </div>
          <button className="auth-submit" type="submit">{isLogin ? 'Sign In →' : 'Create Account →'}</button>
        </form>
        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={()=>{ setIsLogin(!isLogin); setError(''); }}>{isLogin ? 'Sign up' : 'Sign in'}</span>
        </p>
      </div>
    </div>
  );

  // ─── NAV CONFIG ───────────────────────────────────────────────
  const NAV = [
    { id:'home',     icon:<Home size={20}/>,      label:'Home'    },
    { id:'report',   icon:<BarChart2 size={20}/>,  label:'Report'  },
    { id:'plan',     icon:<Layers size={20}/>,     label:'Plan'    },
    { id:'settings', icon:<User size={20}/>,       label:'Profile' },
  ] as const;

  // ─── DASHBOARD ────────────────────────────────────────────────
  return (
    <div className="app-shell">

      {/* ══ Sidebar (desktop) ══ */}
      <nav className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark"><Wallet size={16} color="#fff"/></div>
          <span className="sidebar-logo-name">FinTrack</span>
        </div>

        <span className="nav-section-label">Menu</span>
        {NAV.map(item => (
          <button key={item.id} className={`nav-item${page===item.id?' active':''}`} onClick={()=>setPage(item.id)}>
            <span className="nav-icon">{item.icon}</span>{item.label}
          </button>
        ))}

        <span className="nav-section-label">Quick</span>
        <button className="nav-item" onClick={()=>setShowAdd(true)}>
          <span className="nav-icon"><Plus size={18}/></span>Add Expense
        </button>

        <div className="sidebar-bottom">
          <div style={{ marginBottom:'10px' }}><ThemeToggle/></div>
          <div className="sidebar-user" onClick={logout} title="Sign out">
            <div className="user-avatar">{authEmail?.[0]?.toUpperCase()||'U'}</div>
            <span className="user-email">{authEmail || 'My Account'}</span>
            <span className="signout-icon"><LogOut size={14}/></span>
          </div>
        </div>
      </nav>

      {/* ══ Page content ══ */}
      <main className="page-content">

        {/* ════ HOME ════ */}
        {page === 'home' && (
          <>
            {/* Hero */}
            <div className="hero-section">
              <div className="hero-toprow">
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <div style={{ width:28, height:28, background:'rgba(255,255,255,0.2)', borderRadius:'var(--r-sm)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Wallet size={15} color="#fff"/>
                  </div>
                  <span style={{ fontSize:'1.1rem', fontWeight:800, color:'#fff', letterSpacing:'-0.4px' }}>FinTrack</span>
                </div>
                <button className="hero-month-pill">
                  September 2026 <ChevronDown size={12}/>
                </button>
              </div>
              <p className="hero-balance-label">Current Balance</p>
              <div className="hero-balance">
                <span className="hero-cur">₹</span>
                {balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <p className="hero-change pos"><TrendingUp size={13}/> +₹2,840 since last month</p>
            </div>

            {/* Income / Expense cards */}
            <div className="money-cards">
              <div className="money-card">
                <div className="money-card-top">
                  <div className="money-card-icon green"><ArrowDownRight size={16}/></div>
                  <span className="money-card-label">Income</span>
                </div>
                <div className="money-card-amount">₹{DUMMY_INCOME.toLocaleString('en-IN')}</div>
              </div>
              <div className="money-card">
                <div className="money-card-top">
                  <div className="money-card-icon red"><ArrowUpRight size={16}/></div>
                  <span className="money-card-label">Expenses</span>
                </div>
                <div className="money-card-amount">
                  ₹{totalSpent > 0 ? totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '23,622'}
                </div>
              </div>
            </div>

            {/* Spending trend */}
            <div style={{ margin:'16px 24px 0', background:'var(--bg-card)', borderRadius:'var(--r-xl)', padding:'16px 16px 8px', boxShadow:'var(--shadow-card)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
                <span style={{ fontSize:'0.85rem', fontWeight:700, color:'var(--text-1)', letterSpacing:'-0.2px' }}>Spending trend</span>
                <span style={{ fontSize:'0.72rem', fontWeight:600, color:'var(--text-3)' }}>Sep 2026</span>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={AREA_DATA} margin={{ top:0, right:0, left:-30, bottom:0 }}>
                  <defs>
                    <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#7C3AED" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fill:'var(--text-3)', fontSize:10 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill:'var(--text-3)', fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v}`}/>
                  <Tooltip content={<ChartTooltip/>} cursor={{ stroke:'rgba(124,58,237,0.15)', strokeWidth:1 }}/>
                  <Area type="monotone" dataKey="amt" stroke="#7C3AED" strokeWidth={2}
                    fill="url(#purpleGrad)" dot={false} activeDot={{ r:4, fill:'#7C3AED', strokeWidth:0 }}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Insight strip */}
            <div className="insight-strip">
              <div className="insight-strip-left">
                <TrendingUp size={18}/>
                Your spending insight is ready
              </div>
              <div className="insight-strip-badge">View →</div>
            </div>

            {/* Transactions */}
            <div className="section-header">
              <span className="section-title">Transactions</span>
              <span className="section-action" onClick={()=>setPage('report')}>See all</span>
            </div>

            {Object.entries(groups).map(([grp, txs]) => (
              <div key={grp}>
                <div className="tx-date-label">
                  <span>{grp}</span>
                  <span>Total {txs.reduce((s,t)=>s+t.amount,0) < 0 ? '-' : '+'}₹{Math.abs(txs.reduce((s,t)=>s+t.amount,0)/100).toFixed(2)}</span>
                </div>
                {txs.map((t, i) => (
                  <div key={t.id}>
                    <div className="tx-item">
                      <div className="tx-logo" style={{ background: t.bg }}>{t.icon}</div>
                      <div className="tx-body">
                        <div className="tx-name">{t.name}</div>
                        <div className="tx-sub">{t.sub}</div>
                      </div>
                      <div className="tx-right">
                        <div className={`tx-amount ${t.type}`}>
                          {t.type==='income' ? '+' : '−'}₹{Math.abs(t.amount/100).toLocaleString('en-IN', { minimumFractionDigits:2 })}
                        </div>
                      </div>
                    </div>
                    {i < txs.length-1 && <div className="tx-divider"/>}
                  </div>
                ))}
              </div>
            ))}

            {/* Real expenses */}
            {expenses.length > 0 && (
              <div>
                <div className="tx-date-label"><span>My Records</span></div>
                {expenses.map((e, i) => {
                  const cat = getCat(e.category);
                  return (
                    <div key={e.id}>
                      <div className="tx-item">
                        <div className="tx-logo" style={{ background: cat.color + '22' }}>{cat.icon}</div>
                        <div className="tx-body">
                          <div className="tx-name">{e.description}</div>
                          <div className="tx-sub">{e.category}</div>
                        </div>
                        <div className="tx-right">
                          <div className="tx-amount expense">−₹{parseFloat(e.amount).toLocaleString('en-IN', { minimumFractionDigits:2 })}</div>
                        </div>
                        <div style={{ display:'flex', gap:'6px', marginLeft:'8px' }}>
                          <button onClick={()=>{ setEditId(e.id); setFAmt(e.amount); setFCat(e.category); setFDesc(e.description); setFDate(e.expense_date.split('T')[0]); setShowAdd(true); }}
                            style={{ background:'transparent', border:'1px solid var(--border)', color:'var(--text-2)', padding:'3px 8px', borderRadius:'var(--r-sm)', cursor:'pointer', display:'flex', alignItems:'center', gap:'3px', fontSize:'0.72rem' }}>
                            <Edit3 size={11}/>
                          </button>
                          <button onClick={()=>handleDelete(e.id)}
                            style={{ background:'transparent', border:'1px solid var(--border)', color:'var(--red)', padding:'3px 8px', borderRadius:'var(--r-sm)', cursor:'pointer', display:'flex', alignItems:'center', gap:'3px', fontSize:'0.72rem' }}>
                            <Trash2 size={11}/>
                          </button>
                        </div>
                      </div>
                      {i < expenses.length-1 && <div className="tx-divider"/>}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ════ REPORT ════ */}
        {page === 'report' && (
          <>
            <div className="page-header">
              <div>
                <div className="page-title">Reports</div>
                <div className="page-subtitle">September 2026</div>
              </div>
            </div>

            <div className="tab-row">
              <button className={`tab-btn${reportTab==='expenses'?' active':''}`} onClick={()=>setRepTab('expenses')}>Expenses</button>
              <button className={`tab-btn${reportTab==='income'?' active':''}`}   onClick={()=>setRepTab('income')}>Income</button>
            </div>

            {/* Donut */}
            <div className="report-donut-wrap">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie data={donutData} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={3} stroke="none">
                    {donutData.map((d, i) => <Cell key={i} fill={d.color}/>)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="report-donut-center">
                <div className="report-donut-label">Total Expenses</div>
                <div className="report-donut-total">
                  ₹{totalSpent > 0 ? (totalSpent/1000).toFixed(1)+'k' : '23.6k'}
                </div>
              </div>
            </div>

            <div className="report-total-row">
              <span className="report-total-label">All Expenses</span>
              <span className="report-total-val">Total ₹{totalSpent > 0 ? totalSpent.toLocaleString('en-IN', { maximumFractionDigits:0 }) : '23,622'}</span>
            </div>

            {CAT_REPORT.map((c, i) => (
              <div key={c.name}>
                <div className="cat-report-item">
                  <div className="cat-report-top">
                    <div className="cat-report-icon" style={{ background: c.bg, color: c.color }}>{c.icon}</div>
                    <div className="cat-report-info">
                      <div className="cat-report-name">{c.name}</div>
                      <div className="cat-report-pct">{c.pct}% of total</div>
                    </div>
                    <div className="cat-report-right">
                      <div className="cat-report-amt">₹{c.amt.toLocaleString('en-IN', { minimumFractionDigits:2 })}</div>
                      <div className={`cat-report-vs ${c.isUp?'up':'down'}`}>{c.vs} vs last month</div>
                    </div>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width:`${c.pct}%`, background: c.color }}/>
                  </div>
                </div>
                {i < CAT_REPORT.length-1 && <div className="cat-divider"/>}
              </div>
            ))}

            {/* 6-month bar */}
            <div style={{ margin:'20px 24px 0', background:'var(--bg-card)', borderRadius:'var(--r-xl)', padding:'16px', boxShadow:'var(--shadow-card)' }}>
              <div style={{ fontSize:'0.85rem', fontWeight:700, color:'var(--text-1)', marginBottom:'12px' }}>6-Month Overview</div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={BAR_DATA} margin={{ top:4, right:0, left:-20, bottom:0 }}>
                  <XAxis dataKey="m" tick={{ fill:'var(--text-3)', fontSize:11 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill:'var(--text-3)', fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
                  <Tooltip content={<ChartTooltip/>}/>
                  <Bar dataKey="v" radius={[5,5,0,0]}>
                    {BAR_DATA.map((_,i) => (
                      <Cell key={i}
                        fill={i===BAR_DATA.length-1 ? '#7C3AED' : 'var(--bg-elevated)'}
                        stroke={i===BAR_DATA.length-1 ? 'none' : 'var(--border)'}/>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* ════ PLAN ════ */}
        {page === 'plan' && (
          <>
            <div className="page-header">
              <div>
                <div className="page-title">My Plan</div>
                <div className="page-subtitle">Goals & budgets at a glance</div>
              </div>
              <button style={{ background:'var(--purple-dim)', border:'none', borderRadius:'var(--r-md)', padding:'7px 13px', display:'flex', alignItems:'center', gap:'6px', color:'var(--purple)', fontWeight:700, fontSize:'0.82rem', cursor:'pointer' }}>
                <Plus size={14}/> Add
              </button>
            </div>

            {/* Goals */}
            <div className="section-header" style={{ paddingTop:0 }}>
              <span className="section-title">Goals</span>
              <span className="section-action">View All</span>
            </div>
            {GOALS.map(g => {
              const pct = Math.round((g.saved/g.target)*100);
              return (
                <div key={g.name} className="plan-goal-item">
                  <div className="plan-goal-top">
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      <div className="plan-goal-icon" style={{ background: g.bg, color: g.color }}>{g.icon}</div>
                      <div>
                        <div className="plan-goal-name">{g.name}</div>
                        <div className="plan-goal-sub">View All</div>
                      </div>
                    </div>
                    <Target size={16} color="var(--text-3)" style={{ cursor:'pointer' }}/>
                  </div>
                  <div className="plan-goal-amount">₹{g.saved.toLocaleString('en-IN')}.00</div>
                  <div className="plan-goal-of">Out of ₹{g.target.toLocaleString('en-IN')}.00</div>
                  <div className="plan-progress-track">
                    <div className="plan-progress-fill" style={{ width:`${pct}%`, background: g.color }}/>
                  </div>
                  <div className="plan-progress-row">
                    <span>Your Progress</span>
                    <span>₹{(g.target-g.saved).toLocaleString('en-IN')} left</span>
                  </div>
                  {g.alert && (
                    <div className="plan-alert">
                      <AlertCircle size={14}/> You're {100-pct}% behind schedule
                    </div>
                  )}
                </div>
              );
            })}

            {/* Budgets */}
            <div className="section-header">
              <span className="section-title">Budgets</span>
              <span className="section-action">View All</span>
            </div>
            <div style={{ background:'var(--bg-card)', margin:'0 24px', borderRadius:'var(--r-xl)', boxShadow:'var(--shadow-card)', overflow:'hidden' }}>
              {BUDGETS.map((b, i) => {
                const pct = Math.round((b.spent/b.budget)*100);
                return (
                  <div key={b.name}>
                    <div className="plan-budget-item">
                      <div className="plan-budget-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                      <div className="plan-budget-info">
                        <div className="plan-budget-name">{b.name}</div>
                        <div className="plan-budget-sub">₹{b.spent.toLocaleString('en-IN')} of ₹{b.budget.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="plan-budget-pct" style={{ color: b.color, borderColor: b.color, fontSize:'0.7rem', fontWeight:700, width:40, height:40, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:`3px solid ${b.color}22`, background:`${b.color}11` }}>
                        {pct}%
                      </div>
                    </div>
                    {i < BUDGETS.length-1 && <div style={{ height:1, background:'var(--border)', margin:'0 16px' }}/>}
                  </div>
                );
              })}
            </div>

            {/* Stats row */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', margin:'16px 24px 0' }}>
              {[
                { label:'Avg Daily Spend', val:`₹${totalSpent>0?Math.round(totalSpent/30).toLocaleString('en-IN'):'787'}`, sub:'This month', color:'var(--purple)' },
                { label:'Savings Rate',    val: totalSpent>0 ? `${Math.max(0,Math.round((1-totalSpent/DUMMY_INCOME)*100))}%` : '62%', sub:'Of income saved', color:'var(--green)' },
              ].map(s => (
                <div key={s.label} style={{ background:'var(--bg-card)', borderRadius:'var(--r-xl)', padding:'16px', boxShadow:'var(--shadow-card)' }}>
                  <div style={{ fontSize:'0.68rem', fontWeight:600, color:'var(--text-3)', marginBottom:'8px' }}>{s.label}</div>
                  <div style={{ fontSize:'1.4rem', fontWeight:800, letterSpacing:'-0.8px', color: s.color }}>{s.val}</div>
                  <div style={{ fontSize:'0.72rem', color:'var(--text-3)', marginTop:'4px' }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ════ SETTINGS ════ */}
        {page === 'settings' && (
          <>
            <div className="page-header">
              <div>
                <div className="page-title">Profile</div>
                <div className="page-subtitle">Account & preferences</div>
              </div>
            </div>

            <div className="profile-card">
              <div className="profile-avatar">{authEmail?.[0]?.toUpperCase()||'U'}</div>
              <div>
                <div className="profile-name">{authEmail || 'My Account'}</div>
                <div className="profile-plan">Free Plan · FinTrack</div>
              </div>
            </div>

            {/* Theme toggle card */}
            <div className="settings-section">
              <div className="settings-section-title">Appearance</div>
              <div className="settings-card">
                <div className="settings-row" onClick={()=>setTheme(t=>t==='dark'?'light':'dark')}>
                  <div className="settings-row-left">
                    <div className="settings-row-icon" style={{ background:'var(--bg-elevated)', color:'var(--text-2)' }}>
                      {theme==='dark'?<Sun size={15}/>:<Moon size={15}/>}
                    </div>
                    {theme==='dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  </div>
                  <span style={{ fontSize:'0.78rem', fontWeight:600, color:'var(--purple)' }}>Toggle</span>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <div className="settings-section-title">Account</div>
              <div className="settings-card">
                {[
                  { label:'General Settings', icon:<Settings size={15}/>, bg:'var(--blue-dim)', color:'var(--blue)' },
                  { label:'Privacy & Security', icon:<Shield size={15}/>, bg:'var(--green-dim)', color:'var(--green)' },
                ].map(r => (
                  <div key={r.label} className="settings-row">
                    <div className="settings-row-left">
                      <div className="settings-row-icon" style={{ background: r.bg, color: r.color }}>{r.icon}</div>
                      {r.label}
                    </div>
                    <span style={{ color:'var(--text-3)', fontSize:'0.82rem' }}>›</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <div className="settings-section-title">Danger Zone</div>
              <div className="settings-card">
                <button onClick={logout} style={{ width:'100%', padding:'14px 18px', background:'transparent', border:'none', color:'var(--red)', fontSize:'0.87rem', fontWeight:600, display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', textAlign:'left' }}>
                  <div className="settings-row-icon" style={{ background:'var(--red-dim)', color:'var(--red)' }}><LogOut size={15}/></div>
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* ══ Desktop FAB ══ */}
      <button className="fab-desktop" onClick={()=>setShowAdd(true)} title="Add expense">
        <Plus size={22} strokeWidth={2.5}/>
      </button>

      {/* ══ Mobile bottom nav ══ */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {NAV.slice(0,2).map(item => (
            <button key={item.id} className={`bottom-nav-item${page===item.id?' active':''}`} onClick={()=>setPage(item.id)}>
              {item.icon}
              {item.label}
            </button>
          ))}
          <div className="fab-wrap">
            <button className="fab" onClick={()=>setShowAdd(true)}>
              <Plus size={22} strokeWidth={2.5}/>
            </button>
          </div>
          {NAV.slice(2).map(item => (
            <button key={item.id} className={`bottom-nav-item${page===item.id?' active':''}`} onClick={()=>setPage(item.id)}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ══ Add / Edit panel ══ */}
      {showAdd && (
        <div className="add-overlay" onClick={e=>{ if(e.target===e.currentTarget) resetForm(); }}>
          <div className="add-panel">
            <div className="add-panel-header">
              <span className="add-panel-title">{editingId ? 'Edit Expense' : 'New Transaction'}</span>
              <button className="close-btn" onClick={resetForm}><X size={16}/></button>
            </div>

            <div className="type-toggle">
              {(['Expense','Income'] as const).map(t=>(
                <button key={t} className={`type-btn${fType===t?' active':''}`} onClick={()=>setFType(t)}>{t}</button>
              ))}
            </div>

            <div className="amount-display">
              {fAmt ? <><span className="cur-sym">₹</span>{parseFloat(fAmt).toLocaleString('en-IN')}</> : <span className="placeholder">₹ 0</span>}
            </div>

            <form onSubmit={handleSave}>
              <div className="field-row">
                <label className="field-label">Amount</label>
                <input className="field-input" type="number" step="0.01" min="0" placeholder="0.00" value={fAmt} onChange={e=>setFAmt(e.target.value)} required/>
              </div>
              <div className="field-row">
                <label className="field-label">Category</label>
                <div className="cat-chips">
                  {CATEGORIES.map(c=>(
                    <button key={c.name} type="button" className={`cat-chip${fCat===c.name?' sel':''}`} onClick={()=>setFCat(c.name)}>
                      {c.icon} {c.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="field-row">
                <label className="field-label">Description</label>
                <input className="field-input" type="text" placeholder="What did you spend on?" value={fDesc} onChange={e=>setFDesc(e.target.value)} required/>
              </div>
              <div className="field-row">
                <label className="field-label">Date</label>
                <input className="field-input" type="date" value={fDate} onChange={e=>setFDate(e.target.value)} required/>
              </div>
              <button type="submit" className="save-btn" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
                {editingId ? <><Save size={16}/> Save Changes</> : <><CheckCircle2 size={16}/> Add Transaction</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
