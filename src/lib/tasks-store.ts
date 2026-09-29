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

const initialSeedTasks: OwnerTask[] = [
  {
    id: "OT-1001",
    title: "Collect rent from Room 102 tenant",
    notes: "Amit has promised payment by end of month. Follow up if not received by 5th.",
    priority: "HIGH",
    status: "PENDING",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    category: "Finance",
    completedAt: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "OT-1002",
    title: "Call electrician for Room 203 sparking socket",
    notes: "Rohit reported socket sparking — urgent safety concern. Contact Sharma Electricals.",
    priority: "HIGH",
    status: "IN_PROGRESS",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    category: "Maintenance",
    completedAt: null,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "OT-1003",
    title: "Renew water tank AMC contract",
    notes: "Contract expires next month. Get quotes from 2 vendors before renewing.",
    priority: "MEDIUM",
    status: "PENDING",
    dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    category: "Admin",
    completedAt: null,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "OT-1004",
    title: "Deep clean common kitchen — before weekend",
    notes: "Arrange cleaning crew. Check if supplies (phenyl, scrubs) are in stock.",
    priority: "MEDIUM",
    status: "PENDING",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    category: "Housekeeping",
    completedAt: null,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "OT-1005",
    title: "Update PG directory brochure with new photos",
    notes: "Took new room photos last week. Ask designer to update listing on NoBroker & MagicBricks.",
    priority: "LOW",
    status: "DONE",
    dueDate: null,
    category: "Marketing",
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

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
