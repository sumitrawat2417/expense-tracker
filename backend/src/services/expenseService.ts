import { expenseRepository } from '../repositories/expenseRepository.js';

/**
 * The Service layer handles any business logic before asking the Repository to save/fetch data.
 * Right now our logic is simple, but as the app grows, things like "Calculate totals" or "Apply taxes" would go here.
 */
export const expenseService = {
  
  fetchAllExpenses: async (userId: string, category?: string, search?: string) => {
    return await expenseRepository.getAllExpenses(userId, category, search);
  },

  createExpense: async (userId: string, expenseData: { amount: number, category: string, description: string, expense_date: string }) => {
    return await expenseRepository.createExpense(
      userId,
      expenseData.amount, 
      expenseData.category, 
      expenseData.description, 
      expenseData.expense_date
    );
  },

  removeExpense: async (userId: string, id: string) => {
    return await expenseRepository.deleteExpense(userId, id);
  },

  getSummary: async (userId: string) => {
    const total = await expenseRepository.getTotalSpending(userId);
    const breakdown = await expenseRepository.getCategoryBreakdown(userId);
    
    return {
      total: parseFloat(total),
      breakdown: breakdown.map((item: any) => ({
        category: item.category,
        total: parseFloat(item.total)
      }))
    };
  },

  modifyExpense: async (userId: string, id: string, expenseData: { amount: number, category: string, description: string, expense_date: string }) => {
    return await expenseRepository.updateExpense(
      userId,
      id,
      expenseData.amount, 
      expenseData.category, 
      expenseData.description, 
      expenseData.expense_date
    );
  }
};
