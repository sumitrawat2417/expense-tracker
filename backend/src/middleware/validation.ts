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
export const validateExpense = (req: Request, res: Response, next: NextFunction): void => {
  // safeParse doesn't throw errors, it returns an object indicating success or failure
  const result = expenseSchema.safeParse(req.body);
  
  if (!result.success) {
    // Send a 400 Bad Request with all the specific errors Zod found
    res.status(400).json({ errors: result.error.issues.map((e) => e.message) });
    return;
  }
  
  // If it passes, move on to the next function (the Controller)
  next();
};
