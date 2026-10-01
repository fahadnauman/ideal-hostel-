"use client";

import React, { useState, useEffect } from "react";
import { PieChart, IndianRupee, TrendingDown, TrendingUp, Receipt, Plus, X, Loader2, Pencil, Trash2 } from "lucide-react";
import { mockPaymentHistory } from "@/data/mock-rooms";

export default function ExpensesDashboard() {
  const currentMonth = "Sep 2026";

  // Real revenue calculated from mock data
  const totalRevenue = mockPaymentHistory
    .filter(p => p.status === "PAID" && p.month === currentMonth)
    .reduce((sum, p) => sum + p.amount, 0);

  // Expenses State
  const [expenses, setExpenses] = useState<{ id: string; category: string; amount: number; date: string; status: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/expenses")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setExpenses(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch expenses:", err);
        setLoading(false);
      });
  }, []);

  const totalExpenses = expenses.filter(e => e.status === "PAID").reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === "UNPAID").reduce((sum, e) => sum + e.amount, 0);

  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-accent/5 flex items-center justify-center">
            <PieChart className="w-[18px] h-[18px] text-muted" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Expenses & P&L</h1>
            <p className="text-[13px] text-muted mt-0.5">Track monthly operational costs and profit margins</p>
          </div>
        </div>
        
        <button 
          onClick={() => {
            setEditingExpense(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-sm font-semibold rounded-xl hover:bg-accent-hover transition-default"
        >
          <Plus className="w-4 h-4" />
          Record Expense
        </button>
      </div>

      {/* ── P&L Summary Cards ────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Gross Revenue" 
          amount={totalRevenue} 
          icon={TrendingUp} 
          color="emerald" 
          subtitle={currentMonth}
        />
        <KpiCard 
          title="Total Expenses" 
          amount={totalExpenses} 
          icon={TrendingDown} 
          color="rose" 
          subtitle="Operational costs"
        />
        <KpiCard 
          title="Net Profit" 
          amount={netProfit} 
          icon={IndianRupee} 
          color={netProfit >= 0 ? "emerald" : "rose"} 
          subtitle="After expenses"
        />
        
        <div className="bg-surface border border-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-medium text-muted-foreground">Profit Margin</h3>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-tight tabular-nums">{profitMargin}%</div>
            <p className="text-[11px] text-muted-foreground mt-1">Gross margin</p>
          </div>
        </div>
      </div>

      {/* ── Expense Breakdown Table ──────────────────── */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col">
        <div className="p-5 border-b border-border-light bg-surface-hover/30 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">Expense Log</h2>
            <p className="text-[13px] text-muted-foreground mt-0.5">Detailed breakdown for {currentMonth}</p>
          </div>
          {pendingExpenses > 0 && (
            <div className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1.5">
              <span>Unpaid Bills:</span>
              <span className="tabular-nums">₹{pendingExpenses.toLocaleString("en-IN")}</span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-hover/50 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-semibold">Category / Description</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold text-right">Amount</th>
                <th className="px-6 py-3 font-semibold text-right">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
                    Loading expenses...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No expenses recorded yet.
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-surface-hover/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <Receipt className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="font-medium text-foreground">{expense.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-6 py-4 font-semibold text-right tabular-nums">
                      ₹{expense.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border
                        ${expense.status === 'PAID' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'}`}
                      >
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditingExpense(expense);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={async () => {
                            if (confirm(`Are you sure you want to delete ${expense.category}?`)) {
                              try {
                                const res = await fetch(`/api/expenses/${expense.id}`, { method: "DELETE" });
                                if (res.ok) {
                                  setExpenses(expenses.filter(e => e.id !== expense.id));
                                } else {
                                  alert("Failed to delete expense");
                                }
                              } catch (err) {
                                console.error(err);
                                alert("Error deleting expense");
                              }
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <RecordExpenseModal 
          expenseToEdit={editingExpense}
          onClose={() => {
            setIsModalOpen(false);
            setEditingExpense(null);
          }} 
          onSave={(expense) => {
            if (editingExpense) {
              setExpenses(expenses.map(e => e.id === expense.id ? expense : e));
            } else {
              setExpenses([expense, ...expenses]);
            }
            setIsModalOpen(false);
            setEditingExpense(null);
          }} 
        />
      )}
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────── */

function KpiCard({ title, amount, icon: Icon, color, subtitle }: { title: string, amount: number, icon: React.ElementType, color: string, subtitle: string }) {
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100",
    info: "text-blue-600 bg-blue-50 border-blue-100",
  };
  
  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-medium text-muted-foreground">{title}</h3>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${colorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-semibold tracking-tight tabular-nums">₹{amount.toLocaleString("en-IN")}</div>
        <p className="text-[11px] text-muted-foreground mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function RecordExpenseModal({ onClose, onSave, expenseToEdit }: { onClose: () => void; onSave: (expense: any) => void; expenseToEdit?: any }) {
  const [category, setCategory] = useState(expenseToEdit?.category || "");
  const [amount, setAmount] = useState(expenseToEdit?.amount?.toString() || "");
  const [status, setStatus] = useState(expenseToEdit?.status || "PAID");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount) return;
    
    setIsSubmitting(true);
    
    try {
      const url = expenseToEdit ? `/api/expenses/${expenseToEdit.id}` : "/api/expenses";
      const method = expenseToEdit ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, amount, status }),
      });
      
      const data = await res.json();
      if (data.success) {
        onSave(data.data);
      } else {
        alert(`Failed to ${expenseToEdit ? 'update' : 'record'} expense`);
      }
    } catch (err) {
      console.error(err);
      alert(`Error ${expenseToEdit ? 'updating' : 'saving'} expense`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">{expenseToEdit ? 'Edit Expense' : 'Record New Expense'}</h2>
          <button onClick={onClose} disabled={isSubmitting} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSave} className="p-5 space-y-4 flex-1">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Category / Description</label>
            <input 
              type="text" 
              required
              disabled={isSubmitting}
              value={category} 
              onChange={e => setCategory(e.target.value)} 
              placeholder="e.g., Electricity Bill, Cleaning Supplies"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Amount (₹)</label>
            <input 
              type="number" 
              required
              disabled={isSubmitting}
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              placeholder="0.00"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
            <select 
              value={status} 
              disabled={isSubmitting}
              onChange={e => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <option value="PAID">Paid</option>
              <option value="UNPAID">Unpaid</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isSubmitting ? "Saving..." : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
