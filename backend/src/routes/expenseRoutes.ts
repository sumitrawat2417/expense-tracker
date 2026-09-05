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

// DELETE /api/expenses/:id
router.delete('/:id', expenseController.deleteExpense);

export default router;
