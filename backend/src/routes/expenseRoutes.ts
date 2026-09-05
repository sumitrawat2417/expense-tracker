import { Router } from 'express';
import { expenseController } from '../controllers/expenseController.js';
import { validateExpense } from '../middleware/validation.js';

const router = Router();

// Map the URL endpoints to their specific controller functions
// Notice how clean this looks compared to stuffing everything in server.ts!

// GET /api/expenses
router.get('/', expenseController.getExpenses);

// POST /api/expenses
// Notice we put validateExpense right in the middle! It acts as a shield before the controller.
router.post('/', validateExpense, expenseController.createExpense);

// GET /api/expenses/summary
// IMPORTANT: This must go BEFORE /:id so Express doesn't think "summary" is an ID!
router.get('/summary', expenseController.getSummary);

// PUT /api/expenses/:id
// We use the same validateExpense bouncer to protect edits!
router.put('/:id', validateExpense, expenseController.updateExpense);

// DELETE /api/expenses/:id
router.delete('/:id', expenseController.deleteExpense);

export default router;
