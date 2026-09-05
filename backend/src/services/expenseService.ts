import { expenseRepository } from '../repositories/expenseRepository.js';

/**
 * The Service layer handles any business logic before asking the Repository to save/fetch data.
 * Right now our logic is simple, but as the app grows, things like "Calculate totals" or "Apply taxes" would go here.
 */
export const expenseService = {
  
  fetchAllExpenses: async (category?: string, search?: string) => {
    return await expenseRepository.getAllExpenses(category, search);
  },

  createExpense: async (expenseData: { amount: number, category: string, description: string, expense_date: string }) => {
    return await expenseRepository.createExpense(
      expenseData.amount, 
      expenseData.category, 
      expenseData.description, 
      expenseData.expense_date
    );
  },

  removeExpense: async (id: string) => {
    return await expenseRepository.deleteExpense(id);
  },

  getSummary: async () => {
    const total = await expenseRepository.getTotalSpending();
    return {
      total: parseFloat(total)
    };
  }
};
