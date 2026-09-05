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

  // 1. New State for our Form Inputs
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  // Fetch expenses when page loads
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = () => {
    fetch('http://localhost:3000/api/expenses')
      .then(res => res.json())
      .then(data => setExpenses(data))
      .catch(err => console.error(err));
  };

  // 2. The function that runs when you click "Add Expense"
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault(); // Stops the page from refreshing!

    const newExpense = {
      amount: parseFloat(amount),
      category: category,
      description: description,
      expense_date: date
    };

    try {
      // Send a POST request to our Waiter!
      const response = await fetch('http://localhost:3000/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpense)
      });

      if (response.ok) {
        // Clear the form
        setAmount('');
        setDescription('');
        setDate('');
        // Refresh the list from the database
        fetchExpenses();
      }
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };

  // 3. The function that runs when you click "Delete"
  const handleDeleteExpense = async (id: string) => {
    try {
      // We append the specific ID to the URL, exactly like we did in PowerShell!
      const response = await fetch(`http://localhost:3000/api/expenses/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // If the Waiter successfully deleted it, refresh our list!
        fetchExpenses();
      }
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };


  return (
    <div className="app-container">
      <h1>💸 My Expense Tracker</h1>

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

        <button type="submit">✨ Add Expense</button>
      </form>

      {/* The Expense List */}
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
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteExpense(expense.id)}
                >
                  Delete
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
