import type { Tenant, PaymentRecord, PaymentSubmission } from "@/types";

/* ─── Initial Seed Tenants ───────────────────────────────────── */

const initialSeedTenants: Tenant[] = [];

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
