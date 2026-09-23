"use client";

import { PieChart, IndianRupee, TrendingDown, TrendingUp, Receipt, Plus } from "lucide-react";
import { mockPaymentHistory } from "@/data/mock-rooms";

export default function ExpensesDashboard() {
  const currentMonth = "Sep 2026";

  // Real revenue calculated from mock data
  const totalRevenue = mockPaymentHistory
    .filter(p => p.status === "PAID" && p.month === currentMonth)
    .reduce((sum, p) => sum + p.amount, 0);

  // Mock Expenses
  const expenses = [
    { id: "e1", category: "Electricity Bill", amount: 4500, date: "2026-09-05", status: "PAID" },
    { id: "e2", category: "Water Supply", amount: 1200, date: "2026-09-08", status: "PAID" },
    { id: "e3", category: "Staff Wages (Cook & Cleaning)", amount: 12000, date: "2026-09-01", status: "PAID" },
    { id: "e4", category: "Groceries & Mess Supplies", amount: 8500, date: "2026-09-12", status: "PAID" },
    { id: "e5", category: "Internet / Wi-Fi", amount: 1499, date: "2026-09-02", status: "PAID" },
    { id: "e6", category: "Plumbing Repair", amount: 850, date: "2026-09-15", status: "UNPAID" },
  ];

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
        
        <button className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-sm font-semibold rounded-xl hover:bg-accent-hover transition-default">
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
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {expenses.map((expense) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
