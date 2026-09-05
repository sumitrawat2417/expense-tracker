import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

// 1. We define the schema (the "shape") of a valid Expense request using Zod
export const expenseSchema = z.object({
  amount: z.number().positive("Amount must be greater than zero"),
  category: z.string().min(1, "Category cannot be empty"),
  description: z.string().min(1, "Description cannot be empty"),
  expense_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  })
});

// 2. We create an Express Middleware that automatically checks incoming requests against our Schema
export const validateExpense = (req: Request, res: Response, next: NextFunction) => {
  try {
    // This will throw an error if the body doesn't match the schema
    expenseSchema.parse(req.body);
    
    // If it passes, move on to the next function (the Controller)
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Send a 400 Bad Request with all the specific errors Zod found
      res.status(400).json({ errors: error.errors.map(e => e.message) });
    } else {
      res.status(400).json({ error: 'Invalid input' });
    }
  }
};
