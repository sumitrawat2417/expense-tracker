import { useState, useEffect } from 'react';
import './App.css';

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

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<SummaryData>({ total: 0, breakdown: [] });
  
  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // 1. New State for our Form Inputs
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  // Fetch expenses when page loads or when search/filter changes
  useEffect(() => {
    fetchExpenses();
  }, [searchQuery, filterCategory]);

  // We only fetch the summary once on load, or when an expense is added/deleted
  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = () => {
    fetch('http://localhost:3000/api/expenses/summary')
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(err => console.error(err));
  };

  const fetchExpenses = () => {
    let url = 'http://localhost:3000/api/expenses';
    const params = new URLSearchParams();
    
    if (searchQuery) params.append('search', searchQuery);
    if (filterCategory) params.append('category', filterCategory);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }

    fetch(url)
      .then(res => res.json())
      .then(data => setExpenses(data))
      .catch(err => console.error(err));
  };

  // 2. The function that runs when you submit the form
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();

    const expenseData = {
      amount: parseFloat(amount),
      category,
      description,
      expense_date: date
    };

    try {
      let response;
      
      // If we are editing, send a PUT request
      if (editingId) {
        response = await fetch(`http://localhost:3000/api/expenses/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(expenseData)
        });
      } else {
        // Otherwise, send a POST request
        response = await fetch('http://localhost:3000/api/expenses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(expenseData)
        });
      }

      if (response.ok) {
        setAmount('');
        setCategory('');
        setDescription('');
        setDate('');
        setEditingId(null); // Reset the editing state
        
        fetchExpenses();
        fetchSummary();
      }
    } catch (error) {
      console.error('Failed to save expense:', error);
    }
  };

  // 3. The function that runs when you click "Edit"
  const handleEditClick = (expense: Expense) => {
    setEditingId(expense.id);
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setDescription(expense.description);
    // The date comes back from the database with a timestamp, so we split it to get just YYYY-MM-DD
    setDate(expense.expense_date.split('T')[0]); 
  };

  // 4. The function that runs when you click "Delete"
  const handleDeleteExpense = async (id: string) => {
    try {
      // We append the specific ID to the URL, exactly like we did in PowerShell!
      const response = await fetch(`http://localhost:3000/api/expenses/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // If the Waiter successfully deleted it, refresh our list and summary!
        fetchExpenses();
        fetchSummary();
      }
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };


  return (
    <div className="app-container">
      <h1 className="app-title">💸 My Expense Tracker</h1>

      <div className="main-grid">
        {/* LEFT COLUMN: Dashboard & Form */}
        <div className="left-column">
          
          {/* Total Spent Dashboard */}
          <div className="glass-card total-spent-card">
            <h2 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#94a3b8', fontWeight: 500 }}>Total Spent</h2>
            <div className="total-spent-amount">
              ${summary.total.toFixed(2)}
            </div>

            {/* Category Breakdown */}
            {summary.breakdown.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                {summary.breakdown.map((item) => (
                  <div key={item.category} className="category-bubble">
                    <span style={{ color: '#94a3b8', marginRight: '8px' }}>{item.category}</span>
                    <span style={{ fontWeight: '600', color: '#e2e8f0' }}>${item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add/Edit Form */}
          <form className="glass-card expense-form" onSubmit={handleAddExpense}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '1.4rem', fontWeight: 600 }}>
              {editingId ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <div className="form-group">
              <label>Amount ($)</label>
              <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Food">Food</option>
                <option value="Transportation">Transportation</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Bills">Bills</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What did you buy?" required />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>

            <button type="submit" style={{ background: editingId ? 'linear-gradient(135deg, #eab308 0%, #d97706 100%)' : undefined, marginTop: '10px' }}>
              {editingId ? '💾 Save Changes' : '✨ Add Expense'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingId(null);
                  setAmount(''); setCategory('Food'); setDescription(''); setDate('');
                }}
                style={{ background: 'rgba(255,255,255,0.1)', marginTop: '10px' }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* RIGHT COLUMN: Search & List */}
        <div className="right-column">
          <div className="glass-card" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <input 
              type="text" 
              placeholder="🔍 Search expenses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
            />
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', minWidth: '150px' }}
            >
              <option value="" style={{color: 'black'}}>All Categories</option>
              <option value="Food" style={{color: 'black'}}>Food</option>
              <option value="Transportation" style={{color: 'black'}}>Transportation</option>
              <option value="Entertainment" style={{color: 'black'}}>Entertainment</option>
              <option value="Bills" style={{color: 'black'}}>Bills</option>
              <option value="Other" style={{color: 'black'}}>Other</option>
            </select>
          </div>

          {/* 5. Our Expense List */}
          <div className="expense-list">
            {expenses.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '40px' }}>No expenses found.</p>
            ) : (
              expenses.map((expense) => (
                <div key={expense.id} className="expense-item">
                  <div className="expense-info">
                    <strong>{expense.description}</strong>
                    <small>{expense.category} • {new Date(expense.expense_date).toLocaleDateString()}</small>
                  </div>
                  <div className="expense-amount" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                    ${parseFloat(expense.amount).toFixed(2)}
                    <div>
                      <button onClick={() => handleEditClick(expense)} className="action-btn" style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDeleteExpense(expense.id)} className="action-btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
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
    </div>
  );
}

export default App;
