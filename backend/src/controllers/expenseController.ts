import type { Request, Response } from 'express';
import { expenseService } from '../services/expenseService.js';

/**
 * The Controller handles HTTP Requests and Responses.
 * It does NOT run SQL queries. It just coordinates between the network and the Service layer.
 */
export const expenseController = {

  getExpenses: async (req: Request, res: Response) => {
    try {
      const { category, search } = req.query;
      const userId = (req as any).user.id; // From our auth middleware!
      const expenses = await expenseService.fetchAllExpenses(userId, category as string, search as string);
      res.json(expenses);
    } catch (error) {
      console.error('Error in getExpenses controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  createExpense: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      // By the time it reaches here, the 'validation' middleware has already ensured req.body is perfect!
      const newExpense = await expenseService.createExpense(userId, req.body);
      res.status(201).json(newExpense);
    } catch (error) {
      console.error('Error in createExpense controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  deleteExpense: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const deletedExpense = await expenseService.removeExpense(userId, id as string);
      
      if (!deletedExpense) {
        // Because Express expects us to return something to end the function, we cast the return.
        // It's a TypeScript quirk with res.status().json()
        res.status(404).json({ error: 'Expense not found or you do not have permission to delete it.' });
        return;
      }

      res.json({ message: 'Expense deleted successfully', deletedExpense });
    } catch (error) {
      console.error('Error in deleteExpense controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getSummary: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const summary = await expenseService.getSummary(userId);
      res.json(summary);
    } catch (error) {
      console.error('Error in getSummary controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateExpense: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const updatedExpense = await expenseService.modifyExpense(userId, id as string, req.body);
      
      if (!updatedExpense) {
        res.status(404).json({ error: 'Expense not found or you do not have permission to edit it.' });
        return;
      }

      res.json(updatedExpense);
    } catch (error) {
      console.error('Error in updateExpense controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

};
