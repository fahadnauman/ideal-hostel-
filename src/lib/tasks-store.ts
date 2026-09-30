/* ─── Owner Productivity Task Store ─────────────────────────── */

export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "DONE";

export interface OwnerTask {
  id: string;
  title: string;
  notes: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  category: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const initialSeedTasks: OwnerTask[] = [];

/* ─── Global persistence (dev / serverless) ─────────────────── */

declare global {
  var __pghq_owner_tasks: OwnerTask[] | undefined;
  var __pghq_task_id_counter: number | undefined;
}

if (!globalThis.__pghq_owner_tasks) {
  globalThis.__pghq_owner_tasks = [...initialSeedTasks];
  globalThis.__pghq_task_id_counter = 1006;
}

export function getAllOwnerTasks(): OwnerTask[] {
  return [...(globalThis.__pghq_owner_tasks ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createOwnerTask(params: {
  title: string;
  notes?: string;
  priority?: TaskPriority;
  dueDate?: string | null;
  category?: string;
}): OwnerTask {
  const counter = (globalThis.__pghq_task_id_counter ?? 1006) + 1;
  globalThis.__pghq_task_id_counter = counter;
  const now = new Date().toISOString();
  const task: OwnerTask = {
    id: `OT-${counter}`,
    title: params.title,
    notes: params.notes || "",
    priority: params.priority || "MEDIUM",
    status: "PENDING",
    dueDate: params.dueDate || null,
    category: params.category || "General",
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  };
  if (!globalThis.__pghq_owner_tasks) globalThis.__pghq_owner_tasks = [];
  globalThis.__pghq_owner_tasks.unshift(task);
  return task;
}

export function updateOwnerTask(
  id: string,
  updates: Partial<Omit<OwnerTask, "id" | "createdAt">>
): OwnerTask | null {
  if (!globalThis.__pghq_owner_tasks) return null;
  const idx = globalThis.__pghq_owner_tasks.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  const updated: OwnerTask = {
    ...globalThis.__pghq_owner_tasks[idx],
    ...updates,
    updatedAt: now,
    completedAt:
      updates.status === "DONE"
        ? now
        : updates.status
        ? null
        : globalThis.__pghq_owner_tasks[idx].completedAt,
  };
  globalThis.__pghq_owner_tasks[idx] = updated;
  return updated;
}

export function deleteOwnerTask(id: string): boolean {
  if (!globalThis.__pghq_owner_tasks) return false;
  const len = globalThis.__pghq_owner_tasks.length;
  globalThis.__pghq_owner_tasks = globalThis.__pghq_owner_tasks.filter((t) => t.id !== id);
  return globalThis.__pghq_owner_tasks.length < len;
}
