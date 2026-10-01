export type Expense = {
  id: string;
  category: string;
  amount: number;
  date: string;
  status: "PAID" | "UNPAID";
};

// Use globalThis to maintain state across hot reloads in development
const globalForExpenses = globalThis as unknown as {
  __pghq_expenses: Expense[];
};

if (!globalForExpenses.__pghq_expenses) {
  globalForExpenses.__pghq_expenses = [];
}

export function getAllExpenses(): Expense[] {
  return [...globalForExpenses.__pghq_expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function addExpense(expense: Omit<Expense, "id">): Expense {
  const newExpense: Expense = {
    ...expense,
    id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
  globalForExpenses.__pghq_expenses.unshift(newExpense);
  return newExpense;
}

export function updateExpenseStatus(id: string, status: "PAID" | "UNPAID"): Expense | null {
  const index = globalForExpenses.__pghq_expenses.findIndex(e => e.id === id);
  if (index !== -1) {
    globalForExpenses.__pghq_expenses[index].status = status;
    return globalForExpenses.__pghq_expenses[index];
  }
  return null;
}

export function updateExpense(id: string, updates: Partial<Omit<Expense, "id">>): Expense | null {
  const index = globalForExpenses.__pghq_expenses.findIndex(e => e.id === id);
  if (index !== -1) {
    globalForExpenses.__pghq_expenses[index] = {
      ...globalForExpenses.__pghq_expenses[index],
      ...updates
    };
    return globalForExpenses.__pghq_expenses[index];
  }
  return null;
}

export function deleteExpense(id: string): boolean {
  const initialLength = globalForExpenses.__pghq_expenses.length;
  globalForExpenses.__pghq_expenses = globalForExpenses.__pghq_expenses.filter(e => e.id !== id);
  return globalForExpenses.__pghq_expenses.length < initialLength;
}
