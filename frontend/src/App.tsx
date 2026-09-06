import { useState, useEffect } from 'react';
import './App.css';

// ─── Types ───────────────────────────────────────────────────────────────────
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

// ─── Category Config ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Food',           icon: '🍔' },
  { name: 'Transportation', icon: '🚗' },
  { name: 'Entertainment',  icon: '🎮' },
  { name: 'Bills',          icon: '⚡' },
  { name: 'Shopping',       icon: '🛍️' },
  { name: 'Health',         icon: '🏥' },
  { name: 'Education',      icon: '📚' },
  { name: 'Other',          icon: '📦' },
];

const getCategoryIcon = (name: string) =>
  CATEGORIES.find(c => c.name === name)?.icon ?? '📦';

// Category accent colors for breakdown bars
const BAR_COLORS: Record<string, string> = {
  Food:           'linear-gradient(to right, #f97316, #fb923c)',
  Transportation: 'linear-gradient(to right, #3b82f6, #60a5fa)',
  Entertainment:  'linear-gradient(to right, #a855f7, #c084fc)',
  Bills:          'linear-gradient(to right, #f59e0b, #fbbf24)',
  Shopping:       'linear-gradient(to right, #ec4899, #f472b6)',
  Health:         'linear-gradient(to right, #10b981, #34d399)',
  Education:      'linear-gradient(to right, #14b8a6, #2dd4bf)',
  Other:          'linear-gradient(to right, #64748b, #94a3b8)',
};

// ─── Main Component ───────────────────────────────────────────────────────────
function App() {
  // ── State ──
  const [expenses,       setExpenses]       = useState<Expense[]>([]);
  const [summary,        setSummary]        = useState<SummaryData>({ total: 0, breakdown: [] });

  // Auth
  const [token,          setToken]          = useState<string | null>(localStorage.getItem('token'));
  const [isLoginView,    setIsLoginView]    = useState(true);
  const [authEmail,      setAuthEmail]      = useState('');
  const [authPassword,   setAuthPassword]   = useState('');
  const [authError,      setAuthError]      = useState('');

  // Edit
  const [editingId,      setEditingId]      = useState<string | null>(null);

  // Search / Filter
  const [searchQuery,    setSearchQuery]    = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Form
  const [amount,      setAmount]      = useState('');
  const [category,    setCategory]    = useState('Food');
  const [description, setDescription] = useState('');
  const [date,        setDate]        = useState('');

  // ── Effects ──
  useEffect(() => {
    if (token) { fetchExpenses(); fetchSummary(); }
  }, [searchQuery, filterCategory, token]);

  // ── API Helpers ──
  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  });

  const fetchSummary = () => {
    if (!token) return;
    fetch('http://localhost:3000/api/expenses/summary', { headers: authHeaders() })
      .then(res => { if (res.status === 401 || res.status === 403) handleLogout(); return res.json(); })
      .then(data => setSummary(data))
      .catch(console.error);
  };

  const fetchExpenses = () => {
    let url = 'http://localhost:3000/api/expenses';
    const params = new URLSearchParams();
    if (searchQuery)    params.append('search',   searchQuery);
    if (filterCategory) params.append('category', filterCategory);
    if (params.toString()) url += '?' + params.toString();
    fetch(url, { headers: authHeaders() })
      .then(res => res.json())
      .then(data => setExpenses(data))
      .catch(console.error);
  };

  // ── Auth ──
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const endpoint = isLoginView ? 'login' : 'register';
    try {
      const res  = await fetch(`http://localhost:3000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setAuthEmail(''); setAuthPassword('');
    } catch (err: any) { setAuthError(err.message); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setExpenses([]);
    setSummary({ total: 0, breakdown: [] });
  };

  // ── CRUD ──
  const resetForm = () => {
    setAmount(''); setCategory('Food'); setDescription(''); setDate(''); setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = JSON.stringify({ amount: parseFloat(amount), category, description, expense_date: date });
    const isEdit = !!editingId;
    const url    = isEdit ? `http://localhost:3000/api/expenses/${editingId}` : 'http://localhost:3000/api/expenses';
    try {
      const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: authHeaders(), body });
      if (res.ok) { resetForm(); fetchExpenses(); fetchSummary(); }
    } catch (err) { console.error(err); }
  };

  const handleEditClick = (expense: Expense) => {
    setEditingId(expense.id);
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setDescription(expense.description);
    setDate(expense.expense_date.split('T')[0]);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/expenses/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (res.ok) { fetchExpenses(); fetchSummary(); }
    } catch (err) { console.error(err); }
  };

  // ── Auth Screen ──────────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-icon">💸</div>
            <span className="auth-logo-text">FinTrack</span>
          </div>

          <h1 className="auth-headline">
            {isLoginView ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="auth-subline">
            {isLoginView
              ? 'Sign in to your personal finance dashboard.'
              : 'Start tracking your expenses privately and securely.'}
          </p>

          {authError && <div className="auth-error">{authError}</div>}

          <form onSubmit={handleAuth}>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn-primary" type="submit" style={{ marginTop: '8px' }}>
              {isLoginView ? 'Sign In →' : 'Create Account →'}
            </button>
          </form>

          <p className="auth-toggle">
            {isLoginView ? "Don't have an account? " : 'Already have an account? '}
            <span onClick={() => { setIsLoginView(!isLoginView); setAuthError(''); }}>
              {isLoginView ? 'Sign up' : 'Sign in'}
            </span>
          </p>
        </div>
      </div>
    );
  }

  // ── Max amount for breakdown bar widths ──
  const maxBreakdown = Math.max(...summary.breakdown.map(b => b.total), 1);

  // ── Dashboard ────────────────────────────────────────────────────────────────
  return (
    <div className="app-wrapper">
      {/* ── Top Bar ── */}
      <header className="topbar">
        <div className="topbar-brand">
          <div className="topbar-logo-icon">💸</div>
          <span className="topbar-name">FinTrack</span>
        </div>
        <div className="topbar-right">
          <span className="topbar-date">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
          <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="app-main">
        <div className="main-grid">

          {/* ── LEFT COLUMN ── */}
          <div className="left-col">

            {/* Summary Card */}
            <div className="summary-card">
              <p className="summary-label">Total Spent</p>
              <div className="summary-total">
                <span className="currency">₹</span>
                {summary.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>

              {summary.breakdown.length > 0 && (
                <div className="breakdown-section">
                  {summary.breakdown.map(item => (
                    <div key={item.category} className="breakdown-row">
                      <div className="breakdown-row-header">
                        <span className="breakdown-cat-name">
                          {getCategoryIcon(item.category)} {item.category}
                        </span>
                        <span className="breakdown-cat-amount">
                          ₹{item.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="breakdown-bar-track">
                        <div
                          className="breakdown-bar-fill"
                          style={{
                            width: `${(item.total / maxBreakdown) * 100}%`,
                            background: BAR_COLORS[item.category] ?? BAR_COLORS['Other'],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add / Edit Form */}
            <div className="card form-card">
              <h2 className="form-title">
                {editingId ? '✏️  Edit Expense' : '+ Add Expense'}
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Amount */}
                <div className="form-field">
                  <label className="form-label">Amount</label>
                  <div className="amount-input-wrap">
                    <span className="amount-prefix">₹</span>
                    <input
                      className="form-input amount-field"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Category chips */}
                <div className="form-field">
                  <label className="form-label">Category</label>
                  <div className="category-chips">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.name}
                        type="button"
                        className={`category-chip${category === cat.name ? ' active' : ''}`}
                        onClick={() => setCategory(cat.name)}
                      >
                        <span className="category-chip-icon">{cat.icon}</span>
                        <span className="category-chip-label">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="form-field">
                  <label className="form-label">Description</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="What did you spend on?"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Date */}
                <div className="form-field">
                  <label className="form-label">Date</label>
                  <input
                    className="form-input"
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className={`btn-primary${editingId ? ' btn-edit' : ''}`}>
                  {editingId ? '💾  Save Changes' : '✨  Add Expense'}
                </button>
                {editingId && (
                  <button type="button" className="btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="right-col">

            {/* Filters Bar */}
            <div className="filters-bar">
              <div className="search-wrap">
                <span className="search-icon">🔍</span>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="form-input filter-select"
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>

            {/* Expense List */}
            <div className="expense-list">
              {expenses.length === 0 ? (
                <div className="expense-empty">
                  <span className="expense-empty-icon">📭</span>
                  <p>No expenses found. Add your first one!</p>
                </div>
              ) : (
                expenses.map(expense => (
                  <div key={expense.id} className={`expense-item cat-${expense.category.replace(/\s+/g, '')}`}>
                    {/* Category icon */}
                    <div className="expense-cat-icon">
                      {getCategoryIcon(expense.category)}
                    </div>

                    {/* Body */}
                    <div className="expense-body">
                      <div className="expense-desc">{expense.description}</div>
                      <div className="expense-meta">
                        <span className="expense-cat-badge">{expense.category}</span>
                        <span className="expense-date">
                          {new Date(expense.expense_date).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="expense-right">
                      <span className="expense-amount-val">
                        ₹{parseFloat(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <div className="expense-actions">
                        <button className="action-btn edit-btn" onClick={() => handleEditClick(expense)}>
                          ✏️ Edit
                        </button>
                        <button className="action-btn del-btn" onClick={() => handleDelete(expense.id)}>
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
