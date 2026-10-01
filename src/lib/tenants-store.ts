import type { Tenant, PaymentRecord, PaymentSubmission } from "@/types";

/* ─── Initial Seed Tenants ───────────────────────────────────── */

const initialSeedTenants: Tenant[] = [
  {
    id: "ten-seed-1",
    name: "Shiraz Aymen M K",
    phone: "9778207433",
    roomNumber: "R01",
    parentName: "Naafal Babu M K",
    parentPhone: "9539696608",
    courseName: "B-Tech ECE",
    dateOfBirth: "2001-01-25",
    checkInDate: "2026-07-20",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500,
    bedId: "",
    email: null,
    leaseEndDate: null,
    rentDueDate: 5
  },
  {
    id: "ten-seed-2",
    name: "Abad Ahmed K",
    phone: "7012469796",
    roomNumber: "R01",
    parentName: "Shamsudheen K",
    parentPhone: "9447350680",
    courseName: "EL",
    dateOfBirth: "2007-11-05",
    checkInDate: "2026-07-21",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500,
    bedId: "",
    email: null,
    leaseEndDate: null,
    rentDueDate: 5
  },
  {
    id: "ten-seed-3",
    name: "Sivadath P M",
    phone: "7907241668",
    roomNumber: "R02",
    parentName: "Manoj P V",
    parentPhone: "9388695067",
    courseName: "B.Tech Electrical and Electronics Engineering",
    dateOfBirth: "2007-10-12",
    checkInDate: "2026-07-20",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500,
    bedId: "",
    email: null,
    leaseEndDate: null,
    rentDueDate: 5
  },
  {
    id: "ten-seed-4",
    name: "Adarsh K S",
    phone: "7909221164",
    roomNumber: "R02",
    parentName: "Sudheesh Kumar K A",
    parentPhone: "8086265578",
    courseName: "ECE",
    dateOfBirth: "2007-07-03",
    checkInDate: "2026-07-21",
    advanceDeposit: 1000,
    paymentStatus: "PAID",
    monthlyRent: 4500,
    bedId: "",
    email: null,
    leaseEndDate: null,
    rentDueDate: 5
  },
  {
    id: "ten-seed-5",
    name: "Sinan Saeed",
    phone: "8089433415",
    roomNumber: "R03",
    parentName: "Saidalavi",
    parentPhone: "9567703415",
    courseName: "Industrial Engineering",
    dateOfBirth: "2006-09-01",
    checkInDate: "2026-07-20",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500,
    bedId: "",
    email: null,
    leaseEndDate: null,
    rentDueDate: 5
  },
  {
    id: "ten-seed-6",
    name: "Fadhlu Rahman N K",
    phone: "7736267850",
    roomNumber: "R03",
    parentName: "Hamza N K",
    parentPhone: "9947635070",
    courseName: "IE",
    dateOfBirth: "2007-03-07",
    checkInDate: "2026-07-20",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500,
    bedId: "",
    email: null,
    leaseEndDate: null,
    rentDueDate: 5
  },
  {
    id: "ten-seed-7",
    name: "Mohammed Rafid M P",
    phone: "9778259117",
    roomNumber: "R03",
    parentName: "Muhammed Rafeecque M P",
    parentPhone: "7736227585",
    courseName: "Industrial Engineering (IE)",
    dateOfBirth: "2007-05-11",
    checkInDate: "2026-07-20",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500,
    bedId: "",
    email: null,
    leaseEndDate: null,
    rentDueDate: 5
  },
  {
    id: "ten-seed-8",
    name: "Ahsan Ameer C K",
    phone: "8281640093",
    roomNumber: "R04",
    parentName: "Muhammed Ameer C K",
    parentPhone: "9497647506",
    courseName: "B.Tech Civil Engineering",
    dateOfBirth: "2007-04-23",
    checkInDate: "2026-08-10",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500,
    bedId: "",
    email: null,
    leaseEndDate: null,
    rentDueDate: 5
  },
  {
    id: "ten-seed-9",
    name: "Saday Jayaraj R",
    phone: "9946781729",
    roomNumber: "R05",
    parentName: "Jayaraj K",
    parentPhone: "9495581191",
    courseName: "Computer Science & Engineering",
    dateOfBirth: "2006-06-07",
    checkInDate: "2026-07-20",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500,
    bedId: "",
    email: null,
    leaseEndDate: null,
    rentDueDate: 5
  },
];

/* ─── Initial Seed Ledger History ────────────────────────────── */

const initialSeedLedger: PaymentRecord[] = [];

/* ─── Initial Seed Payment Submissions ───────────────────────── */

const initialSeedSubmissions: PaymentSubmission[] = [];

/* ─── Global State Definition ────────────────────────────────── */

declare global {
  var __pghq_tenants: Tenant[] | undefined;
  var __pghq_ledger: PaymentRecord[] | undefined;
  var __pghq_payment_submissions: PaymentSubmission[] | undefined;
}

if (!globalThis.__pghq_tenants) {
  globalThis.__pghq_tenants = [...initialSeedTenants];
}

if (!globalThis.__pghq_ledger) {
  globalThis.__pghq_ledger = [...initialSeedLedger];
}

if (!globalThis.__pghq_payment_submissions) {
  globalThis.__pghq_payment_submissions = [...initialSeedSubmissions];
}

/* ─── Query Functions ────────────────────────────────────────── */

export function getAllTenants(): Tenant[] {
  return [...(globalThis.__pghq_tenants ?? [])];
}

export function getTenantById(id: string): Tenant | undefined {
  return (globalThis.__pghq_tenants ?? []).find((t) => t.id === id);
}

export function getTenantsByRoom(roomNumber: string): Tenant[] {
  return (globalThis.__pghq_tenants ?? []).filter(
    (t) => t.roomNumber?.toUpperCase() === roomNumber.toUpperCase()
  );
}

export function updateTenant(id: string, updates: Partial<Tenant>): Tenant | null {
  if (!globalThis.__pghq_tenants) return null;
  const index = globalThis.__pghq_tenants.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const updated: Tenant = {
    ...globalThis.__pghq_tenants[index],
    ...updates,
  };
  globalThis.__pghq_tenants[index] = updated;
  return updated;
}

export function addTenant(tenant: Omit<Tenant, "id">): Tenant {
  if (!globalThis.__pghq_tenants) globalThis.__pghq_tenants = [];
  const newTenant: Tenant = {
    ...tenant,
    id: `ten-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  };
  globalThis.__pghq_tenants.unshift(newTenant);
  return newTenant;
}

export function deleteTenant(id: string): boolean {
  if (!globalThis.__pghq_tenants) return false;
  const initialLen = globalThis.__pghq_tenants.length;
  globalThis.__pghq_tenants = globalThis.__pghq_tenants.filter((t) => t.id !== id);
  return globalThis.__pghq_tenants.length < initialLen;
}

export function getTenantPaymentHistory(tenantId: string): PaymentRecord[] {
  return (globalThis.__pghq_ledger ?? [])
    .filter((p) => p.tenantId === tenantId)
    .sort((a, b) => b.month.localeCompare(a.month));
}

export function getAllLedgerRecords(): PaymentRecord[] {
  return [...(globalThis.__pghq_ledger ?? [])];
}

export function addPaymentRecord(record: Omit<PaymentRecord, "id">): PaymentRecord {
  if (!globalThis.__pghq_ledger) globalThis.__pghq_ledger = [];
  const newRecord: PaymentRecord = {
    ...record,
    id: `pay-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  };
  globalThis.__pghq_ledger.unshift(newRecord);

  // Update tenant's status to PAID if paid in full
  if (record.status === "PAID" && record.tenantId) {
    updateTenant(record.tenantId, { paymentStatus: "PAID" });
  }

  return newRecord;
}

export function createPaymentSubmission(
  submission: Omit<PaymentSubmission, "id" | "submittedAt" | "status">
): PaymentSubmission {
  if (!globalThis.__pghq_payment_submissions) {
    globalThis.__pghq_payment_submissions = [];
  }

  const newSub: PaymentSubmission = {
    ...submission,
    id: `SUB-${Date.now()}`,
    status: "PENDING_VERIFICATION",
    submittedAt: new Date().toISOString(),
  };

  globalThis.__pghq_payment_submissions.unshift(newSub);
  return newSub;
}

export function getAllPaymentSubmissions(): PaymentSubmission[] {
  return [...(globalThis.__pghq_payment_submissions ?? [])];
}
