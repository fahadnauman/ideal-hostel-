"use client";

import { useState, useEffect } from "react";
import { getMealsForDate } from "@/lib/meals-store";
import type { MealType, MealRecord } from "@/types";
import { UtensilsCrossed, ChevronLeft, ChevronRight, Calendar, Coffee, Sun, Moon, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

export default function MealsDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateStr = selectedDate.toISOString().split("T")[0];
  const isToday = dateStr === new Date().toISOString().split("T")[0];
  const [records, setRecords] = useState<MealRecord[]>([]);

  useEffect(() => {
    // Fetch live meals for the selected date
    const liveRecords = getMealsForDate(dateStr);
    setRecords(liveRecords);
  }, [dateStr]);

  const refreshMeals = () => {
    const liveRecords = getMealsForDate(dateStr);
    setRecords([...liveRecords]);
  };
  
  // Calculate headcounts for the selected date
  const getCount = (type: MealType, optedIn: boolean) => {
    return records.filter(r => r.mealType === type && r.status === (optedIn ? "OPTED_IN" : "SKIPPED")).length;
  };

  const bfastOpt = getCount("BREAKFAST", true);
  const lunchOpt = getCount("LUNCH", true);
  const dinnerOpt = getCount("DINNER", true);
  
  const skippedRecords = records.filter(r => r.status === "SKIPPED");

  const changeDate = (days: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + days);
    setSelectedDate(next);
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-accent/5 flex items-center justify-center">
            <UtensilsCrossed className="w-[18px] h-[18px] text-muted" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Mess & Meals Planner</h1>
            <p className="text-[13px] text-muted mt-0.5">Track daily headcount and tenant meal preferences</p>
          </div>
        </div>
      </div>

      {/* ── Date Navigator ───────────────────────────── */}
      <div className="flex items-center justify-between bg-surface border border-border rounded-xl p-2 w-full sm:w-fit">
        <button 
          onClick={() => changeDate(-1)}
          className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-default"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 px-6">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">
            {selectedDate.toLocaleDateString("en-IN", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          {isToday && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider">
              Today
            </span>
          )}
        </div>
        <button 
          onClick={() => changeDate(1)}
          className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-default"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* ── Headcount KPIs ───────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MealKpiCard 
          title="Breakfast" 
          count={bfastOpt} 
          icon={Coffee}
          timeWindow="7:30 AM - 9:30 AM"
          empty={!isToday}
        />
        <MealKpiCard 
          title="Lunch" 
          count={lunchOpt} 
          icon={Sun}
          timeWindow="1:00 PM - 3:00 PM"
          empty={!isToday}
        />
        <MealKpiCard 
          title="Dinner" 
          count={dinnerOpt} 
          icon={Moon}
          timeWindow="8:00 PM - 10:00 PM"
          empty={!isToday}
        />
      </div>

      {/* ── Skipped Meals List ───────────────────────── */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col">
        <div className="p-5 border-b border-border-light bg-surface-hover/30">
          <h2 className="text-base font-semibold tracking-tight text-foreground">Skipped Meals Overview</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">Tenants who have opted out of meals for this day.</p>
        </div>

        {!isToday ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4 text-muted-foreground">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold">No data available</h3>
            <p className="text-sm text-muted mt-1 max-w-[240px]">
              Meal preferences for this date have not been recorded yet.
            </p>
          </div>
        ) : skippedRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4 text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold">100% Attendance</h3>
            <p className="text-sm text-muted mt-1 max-w-[240px]">
              No tenants have opted out of meals today.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-hover/50 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-semibold">Tenant</th>
                  <th className="px-6 py-3 font-semibold">Room</th>
                  <th className="px-6 py-3 font-semibold">Meal Skipped</th>
                  <th className="px-6 py-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {skippedRecords.map((r, i) => (
                  <tr key={i} className="hover:bg-surface-hover/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{r.tenantName}</td>
                    <td className="px-6 py-4 font-medium text-muted-foreground">{r.roomNumber}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                        {r.mealType === "BREAKFAST" && <Coffee className="w-3.5 h-3.5" />}
                        {r.mealType === "LUNCH" && <Sun className="w-3.5 h-3.5" />}
                        {r.mealType === "DINNER" && <Moon className="w-3.5 h-3.5" />}
                        {r.mealType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600">
                        <XCircle className="w-3.5 h-3.5" />
                        Skipped
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function MealKpiCard({ title, count, icon: Icon, timeWindow, empty }: { title: string, count: number, icon: React.ElementType, timeWindow: string, empty: boolean }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold tracking-tight text-foreground">
          {empty ? "-" : count}
        </div>
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-1">{timeWindow}</p>
      </div>
    </div>
  );
}
