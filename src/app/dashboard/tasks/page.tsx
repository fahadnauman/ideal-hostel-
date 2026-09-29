"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Flag,
  CalendarDays,
  Tag,
  ChevronDown,
  ClipboardList,
  Loader2,
  StickyNote,
  Clock,
  CheckSquare,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import type { OwnerTask, TaskPriority, TaskStatus } from "@/types";

/* ─── Helpers ────────────────────────────────────────────────── */

const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  HIGH: {
    label: "High",
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
  MEDIUM: {
    label: "Medium",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  LOW: {
    label: "Low",
    color: "text-slate-600",
    bg: "bg-slate-100",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
};

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  PENDING: {
    label: "To Do",
    color: "text-slate-700",
    bg: "bg-slate-50",
    border: "border-slate-200",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  DONE: {
    label: "Done",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
};

const CATEGORIES = [
  "General",
  "Finance",
  "Maintenance",
  "Housekeeping",
  "Admin",
  "Marketing",
  "Other",
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function formatDueDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil(
    (d.getTime() - new Date(now.toDateString()).getTime()) / 86400000
  );
  if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)}d`;
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  return `Due in ${diffDays}d`;
}

function isDueDateOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return new Date(dateStr).getTime() < new Date().setHours(0, 0, 0, 0);
}

/* ─── Add Task Form ──────────────────────────────────────────── */

interface AddTaskFormProps {
  onAdd: () => void;
}

function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("General");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          notes,
          priority,
          dueDate: dueDate || null,
          category,
        }),
      });
      setTitle("");
      setNotes("");
      setPriority("MEDIUM");
      setDueDate("");
      setCategory("General");
      setExpanded(false);
      onAdd();
    } catch (err) {
      console.error("Failed to create task:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-2xl transition-all">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="w-full flex items-center gap-3 px-5 py-4 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold">Add a new task or note…</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">New Task</h3>
          </div>

          {/* Title */}
          <input
            autoFocus
            type="text"
            required
            minLength={2}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title (e.g. Call electrician for room 203)"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900"
          />

          {/* Notes */}
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes (optional)…"
            rows={2}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 resize-none"
          />

          {/* Row: Priority / Category / Due Date */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Flag className="w-3 h-3" /> Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="HIGH">🔴 High</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="LOW">⚪ Low</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3 h-3" /> Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <CalendarDays className="w-3 h-3" /> Due
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-extrabold rounded-xl transition-all disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              Add Task
            </button>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ─── Task Card ──────────────────────────────────────────────── */

interface TaskCardProps {
  task: OwnerTask;
  index: number;
  onUpdate: () => void;
}

function TaskCard({ task, index, onUpdate }: TaskCardProps) {
  const [updating, setUpdating] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const p = PRIORITY_CONFIG[task.priority];
  const s = STATUS_CONFIG[task.status];
  const dueDateLabel = formatDueDate(task.dueDate);
  const isOverdue = task.status !== "DONE" && isDueDateOverdue(task.dueDate);

  const handleToggleDone = async () => {
    setUpdating(true);
    const newStatus: TaskStatus = task.status === "DONE" ? "PENDING" : "DONE";
    try {
      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task.id, status: newStatus }),
      });
      onUpdate();
    } catch (err) {
      console.error("Failed to toggle task:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    setUpdating(true);
    try {
      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task.id, status: newStatus }),
      });
      onUpdate();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this task?")) return;
    setUpdating(true);
    try {
      await fetch(`/api/tasks?id=${task.id}`, { method: "DELETE" });
      onUpdate();
    } catch (err) {
      console.error("Failed to delete task:", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div
      className={`${index % 2 === 0 ? "card-shadow" : "card-shadow-black"} rounded-2xl overflow-hidden transition-all duration-200 ${
        task.status === "DONE"
          ? "opacity-70"
          : isOverdue
          ? "border-rose-900 shadow-rose-900/20"
          : ""
      } hover:-translate-y-0.5`}
    >
      {/* Priority bar */}
      <div className={`h-0.5 w-full ${p.dot}`} />

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={handleToggleDone}
            disabled={updating}
            className="mt-0.5 shrink-0 cursor-pointer transition-transform active:scale-90"
          >
            {updating ? (
              <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
            ) : task.status === "DONE" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300 hover:text-slate-500" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p
                className={`text-sm font-bold leading-snug ${
                  task.status === "DONE"
                    ? "line-through opacity-50"
                    : "text-inherit"
                }`}
              >
                {task.title}
              </p>
              <button
                onClick={handleDelete}
                className="shrink-0 p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Meta row */}
            <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
              {/* Priority badge */}
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.color} ${p.bg} ${p.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
                {p.label}
              </span>

              {/* Category */}
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                <Tag className="w-2.5 h-2.5" />
                {task.category}
              </span>

              {/* Due date */}
              {dueDateLabel && (
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isOverdue
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : dueDateLabel.includes("today")
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {isOverdue ? (
                    <AlertTriangle className="w-2.5 h-2.5" />
                  ) : (
                    <CalendarDays className="w-2.5 h-2.5" />
                  )}
                  {dueDateLabel}
                </span>
              )}

              {/* Created */}
              <span className="text-[10px] opacity-60 flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" />
                {timeAgo(task.createdAt)}
              </span>
            </div>

            {/* Notes snippet */}
            {task.notes && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-left w-full cursor-pointer"
              >
                <p
                  className={`text-[11px] opacity-70 leading-relaxed ${
                    expanded ? "" : "line-clamp-1"
                  }`}
                >
                  {task.notes}
                </p>
                {task.notes.length > 60 && (
                  <span className="text-[10px] opacity-50 font-semibold flex items-center gap-0.5 mt-0.5">
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`}
                    />
                    {expanded ? "Show less" : "Show more"}
                  </span>
                )}
              </button>
            )}

            {/* Status changer */}
            <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100">
              {(["PENDING", "IN_PROGRESS", "DONE"] as TaskStatus[]).map((st) => {
                const sc = STATUS_CONFIG[st];
                const isActive = task.status === st;
                return (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    disabled={isActive || updating}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      isActive
                        ? `${sc.bg} ${sc.color} border ${sc.border}`
                        : "bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    } disabled:cursor-default`}
                  >
                    {sc.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sticky Notes Area ──────────────────────────────────────── */

function StickyNotesWidget() {
  const [noteText, setNoteText] = useState(
    "💡 Remember to follow up on the water heater replacement quote.\n\n📌 New tenant move-in scheduled for Room 102 next Monday — prepare the checklist.\n\n🔧 Get AC service done before summer peak."
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    // In production: POST to a notes endpoint
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <StickyNote className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-amber-900">Quick Notes</h3>
            <p className="text-[11px] text-amber-700">Personal reminders &amp; scratch pad</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            saved
              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
              : "bg-amber-200 text-amber-900 hover:bg-amber-300"
          }`}
        >
          {saved ? "✓ Saved!" : "Save Notes"}
        </button>
      </div>
      <textarea
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        rows={5}
        placeholder="Jot down reminders, tenant notes, vendor contacts…"
        className="w-full bg-white/70 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-950 placeholder-amber-400/70 focus:outline-none focus:ring-2 focus:ring-amber-400/30 resize-none leading-relaxed"
      />
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */

export default function TasksPage() {
  const [tasks, setTasks] = useState<OwnerTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "ALL">("ALL");
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "ALL">("ALL");

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = tasks.filter((t) => {
    const statusOk = filterStatus === "ALL" || t.status === filterStatus;
    const priorityOk = filterPriority === "ALL" || t.priority === filterPriority;
    return statusOk && priorityOk;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "PENDING").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    done: tasks.filter((t) => t.status === "DONE").length,
    overdue: tasks.filter((t) => t.status !== "DONE" && isDueDateOverdue(t.dueDate)).length,
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Owner Task Board
              </h1>
              <p className="text-sm text-slate-500">
                Personal notes, chores &amp; property management tasks
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {stats.overdue > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              {stats.overdue} Overdue
            </span>
          )}
          <button
            onClick={fetchTasks}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Stats Row ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Tasks",
            value: stats.total,
            icon: ClipboardList,
            color: "text-slate-700",
            bg: "bg-slate-50 border-slate-200",
          },
          {
            label: "To Do",
            value: stats.pending,
            icon: Circle,
            color: "text-slate-700",
            bg: "bg-slate-50 border-slate-200",
          },
          {
            label: "In Progress",
            value: stats.inProgress,
            icon: Clock,
            color: "text-blue-700",
            bg: "bg-blue-50 border-blue-200",
          },
          {
            label: "Completed",
            value: stats.done,
            icon: CheckSquare,
            color: "text-emerald-700",
            bg: "bg-emerald-50 border-emerald-200",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`border rounded-2xl p-4 flex items-center gap-3 ${stat.bg}`}
          >
            <div className={`${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-xl font-extrabold tabular-nums ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-[11px] font-semibold text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Two-Column Layout ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1">Filter:</span>

            {/* Status filter */}
            {(["ALL", "PENDING", "IN_PROGRESS", "DONE"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === st
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st === "ALL"
                  ? "All"
                  : st === "IN_PROGRESS"
                  ? "In Progress"
                  : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}

            <div className="w-px h-4 bg-slate-200 mx-1" />

            {/* Priority filter */}
            {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((pr) => (
              <button
                key={pr}
                onClick={() => setFilterPriority(pr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterPriority === pr
                    ? pr === "ALL"
                      ? "bg-slate-900 text-white"
                      : pr === "HIGH"
                      ? "bg-rose-600 text-white"
                      : pr === "MEDIUM"
                      ? "bg-amber-500 text-white"
                      : "bg-slate-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {pr === "ALL" ? "All" : pr.charAt(0) + pr.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Add Task Form */}
          <AddTaskForm onAdd={fetchTasks} />

          {/* Task List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-900">All clear!</p>
              <p className="text-xs text-slate-500 mt-1">
                No tasks match the current filter.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} onUpdate={fetchTasks} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Notes + Summary */}
        <div className="space-y-4">
          {/* Sticky Notes */}
          <StickyNotesWidget />

          {/* Priority Breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900">Task Breakdown</h3>
            {(["HIGH", "MEDIUM", "LOW"] as TaskPriority[]).map((pr) => {
              const count = tasks.filter(
                (t) => t.priority === pr && t.status !== "DONE"
              ).length;
              const cfg = PRIORITY_CONFIG[pr];
              return (
                <div key={pr} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                    <span className="text-xs font-semibold text-slate-700">
                      {cfg.label} Priority
                    </span>
                  </div>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border}`}
                  >
                    {count} open
                  </span>
                </div>
              );
            })}

            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Completion Rate</span>
                <span className="text-xs font-extrabold text-slate-900">
                  {stats.total > 0
                    ? Math.round((stats.done / stats.total) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      stats.total > 0
                        ? Math.round((stats.done / stats.total) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
