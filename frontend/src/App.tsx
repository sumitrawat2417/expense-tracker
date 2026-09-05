import { useState, useEffect } from 'react';
import './App.css';

// We define what an Expense looks like so TypeScript can help us
interface Expense {
  id: string;
  amount: string;
  category: string;
  description: string;
  expense_date: string;
}

function App() {
  // We use State to store the data once it arrives from the backend
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // useEffect runs automatically exactly once when the page loads
  useEffect(() => {
    // 1. We talk to the Waiter (our Express server)
    fetch('http://localhost:3000/api/expenses')
      .then(response => response.json()) // 2. Convert the Waiter's response into JSON
      .then(data => setExpenses(data))   // 3. Save that JSON into our React State
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>💸 My Full-Stack Expense Tracker</h1>

      {/* We map over our state and create a card for every expense */}
      {expenses.length === 0 ? (
        <p>No expenses found. (Did you delete them all?)</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {expenses.map((expense) => (
            <li key={expense.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px', borderRadius: '5px' }}>
              <strong>{expense.category}</strong>: ${expense.amount} <br />
              <small>{expense.description}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
