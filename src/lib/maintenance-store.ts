import type { MaintenanceTask, MaintenanceStatus, MaintenanceCategory } from "@/types";

/* ─── Initial Seed Maintenance Tasks ────────────────────────── */

const initialSeedTasks: MaintenanceTask[] = [
  {
    id: "MT-1001",
    roomId: "floor-1-room-101",
    roomNumber: "101",
    category: "PLUMBING",
    description: "Washroom basin tap dripping continuously and floor drain is slightly clogged.",
    photoUrl: null,
    status: "PENDING",
    tenantName: "Divya Joshi",
    tenantPhone: "+91 43210 98765",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mins ago
    updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: "MT-1002",
    roomId: "floor-g-room-G02",
    roomNumber: "G02",
    category: "AC_VENTILATION",
    description: "AC unit blowing room temperature air instead of cooling; filter needs cleaning.",
    photoUrl: null,
    status: "PENDING",
    tenantName: "Sneha Reddy",
    tenantPhone: "+91 87654 32109",
    createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(), // 2.5 hrs ago
    updatedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "MT-1003",
    roomId: "floor-2-room-203",
    roomNumber: "203",
    category: "ELECTRICAL",
    description: "Bed 1 study lamp plug socket is sparking intermittently when laptop is connected.",
    photoUrl: null,
    status: "IN_PROGRESS",
    tenantName: "Rohit Verma",
    tenantPhone: "+91 32109 87654",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hrs ago
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "MT-1004",
    roomId: "floor-g-room-G01",
    roomNumber: "G01",
    category: "CARPENTRY",
    description: "Wardrobe magnetic latch broken; door remains open.",
    photoUrl: null,
    status: "RESOLVED",
    tenantName: "Ravi Kumar",
    tenantPhone: "+91 98765 43210",
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), // yesterday
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "MT-1005",
    roomId: "floor-1-room-103",
    roomNumber: "103",
    category: "CLEANING",
    description: "Balcony window sliding mesh requires deep wash and mosquito repellent net replacement.",
    photoUrl: null,
    status: "RESOLVED",
    tenantName: null,
    tenantPhone: null,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

/* ─── Global State for Development / Serverless Persistence ── */

declare global {
  // eslint-disable-next-line no-var
  var __pghq_maintenance_tasks: MaintenanceTask[] | undefined;
  // eslint-disable-next-line no-var
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

export function deleteTask(id: string): boolean {
  if (!globalThis.__pghq_maintenance_tasks) return false;
  const initialLen = globalThis.__pghq_maintenance_tasks.length;
  globalThis.__pghq_maintenance_tasks = globalThis.__pghq_maintenance_tasks.filter(
    (t) => t.id !== id
  );
  return globalThis.__pghq_maintenance_tasks.length < initialLen;
}
