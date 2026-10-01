import type { MaintenanceTask, MaintenanceStatus, MaintenanceCategory } from "@/types";

/* ─── Initial Seed Maintenance Tasks ────────────────────────── */

const initialSeedTasks: MaintenanceTask[] = [];

/* ─── Global State for Development / Serverless Persistence ── */

declare global {
  var __pghq_maintenance_tasks: MaintenanceTask[] | undefined;
  var __pghq_task_counter: number | undefined;
}

if (!globalThis.__pghq_maintenance_tasks) {
  globalThis.__pghq_maintenance_tasks = [...initialSeedTasks];
  globalThis.__pghq_task_counter = 1006;
}

export function getAllTasks(): MaintenanceTask[] {
  return [...(globalThis.__pghq_maintenance_tasks ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getTaskById(id: string): MaintenanceTask | undefined {
  return (globalThis.__pghq_maintenance_tasks ?? []).find((t) => t.id === id);
}

export function createTask(params: {
  roomId?: string;
  roomNumber: string;
  category: MaintenanceCategory;
  description: string;
  photoUrl?: string | null;
  tenantName?: string | null;
  tenantPhone?: string | null;
}): MaintenanceTask {
  const counter = (globalThis.__pghq_task_counter ?? 1006) + 1;
  globalThis.__pghq_task_counter = counter;

  const now = new Date().toISOString();
  const newTask: MaintenanceTask = {
    id: `MT-${counter}`,
    roomId: params.roomId || `room-${params.roomNumber.toLowerCase()}`,
    roomNumber: params.roomNumber,
    category: params.category,
    description: params.description,
    photoUrl: params.photoUrl || null,
    status: "PENDING",
    tenantName: params.tenantName || null,
    tenantPhone: params.tenantPhone || null,
    createdAt: now,
    updatedAt: now,
  };

  if (!globalThis.__pghq_maintenance_tasks) {
    globalThis.__pghq_maintenance_tasks = [];
  }

  globalThis.__pghq_maintenance_tasks.unshift(newTask);
  return newTask;
}

export function updateTaskStatus(
  id: string,
  status: MaintenanceStatus
): MaintenanceTask | null {
  if (!globalThis.__pghq_maintenance_tasks) return null;
  const index = globalThis.__pghq_maintenance_tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const updated: MaintenanceTask = {
    ...globalThis.__pghq_maintenance_tasks[index],
    status,
    updatedAt: new Date().toISOString(),
  };

  globalThis.__pghq_maintenance_tasks[index] = updated;
  return updated;
}

export function updateTask(id: string, updates: Partial<MaintenanceTask>): MaintenanceTask | null {
  if (!globalThis.__pghq_maintenance_tasks) return null;
  const index = globalThis.__pghq_maintenance_tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const updated: MaintenanceTask = {
    ...globalThis.__pghq_maintenance_tasks[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  globalThis.__pghq_maintenance_tasks[index] = updated;
  return updated;
}

export function deleteTask(id: string): boolean {
  if (!globalThis.__pghq_maintenance_tasks) return false;
  const initialLen = globalThis.__pghq_maintenance_tasks.length;
  globalThis.__pghq_maintenance_tasks = globalThis.__pghq_maintenance_tasks.filter(
    (t) => t.id !== id
  );
  return globalThis.__pghq_maintenance_tasks.length < initialLen;
}
