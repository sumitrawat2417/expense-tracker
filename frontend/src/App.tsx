import { useState, useEffect } from 'react';
import './App.css';

interface Expense {
  id: string;
  amount: string;
  category: string;
  description: string;
  expense_date: string;
}

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalSpent, setTotalSpent] = useState<number>(0);
  
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
      .then(data => setTotalSpent(data.total))
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
      <h1>💸 My Expense Tracker</h1>

      <div className="glass-card" style={{ textAlign: 'center', marginBottom: '30px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#94a3b8' }}>Total Spent</h2>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', background: 'linear-gradient(to right, #4ade80, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ${totalSpent.toFixed(2)}
        </div>
      </div>

      {/* 3. Our New Form */}
      <form className="glass-card expense-form" onSubmit={handleAddExpense}>
        <div className="form-group">
          <label>Amount ($)</label>
          <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Bills">Bills</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className="form-group full-width">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <button type="submit" style={{ background: editingId ? '#eab308' : undefined }}>
          {editingId ? '💾 Save Changes' : '✨ Add Expense'}
        </button>
        {editingId && (
          <button 
            type="button" 
            onClick={() => {
              setEditingId(null);
              setAmount(''); setCategory('Food'); setDescription(''); setDate('');
            }}
            style={{ background: '#475569', marginTop: '10px' }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* 4. Search and Filter Bar */}
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
          <p style={{ textAlign: 'center' }}>No expenses yet. Add one above!</p>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id} className="glass-card expense-item">
              <div className="expense-info">
                <strong>{expense.category}</strong>
                <small>{expense.description} • {new Date(expense.expense_date).toLocaleDateString()}</small>
              </div>
              <div className="expense-amount" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                ${parseFloat(expense.amount).toFixed(2)}
                <div>
                  <button onClick={() => handleEditClick(expense)} className="delete-btn" style={{ background: '#eab308', marginRight: '10px' }}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDeleteExpense(expense.id)} className="delete-btn">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
