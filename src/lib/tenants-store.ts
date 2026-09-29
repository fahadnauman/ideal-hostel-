import type { Tenant, PaymentRecord, PaymentSubmission } from "@/types";

/* ─── Initial Seed Tenants ───────────────────────────────────── */

const initialSeedTenants: Tenant[] = [
  {
    id: "tenant-101",
    bedId: "bed-g01-1",
    name: "Ravi Kumar",
    phone: "+91 98765 43210",
    email: "ravi.kumar@gmail.com",
    roomNumber: "G01",
    bedNumber: 1,
    floorName: "Ground Floor",
    checkInDate: "2025-03-15",
    leaseEndDate: "2026-03-14",
    advanceDeposit: 8000,
    monthlyRent: 6500,
    rentDueDate: 1,
    paymentStatus: "UNPAID",
    emergencyContactName: "Suresh Kumar",
    emergencyContactRelation: "Father",
    emergencyContactPhone: "+91 98111 22334",
    status: "ACTIVE",
  },
  {
    id: "tenant-102",
    bedId: "bed-g02-1",
    name: "Sneha Reddy",
    phone: "+91 87654 32109",
    email: "sneha.r@outlook.com",
    roomNumber: "G02",
    bedNumber: 1,
    floorName: "Ground Floor",
    checkInDate: "2025-06-01",
    leaseEndDate: "2026-05-31",
    advanceDeposit: 10000,
    monthlyRent: 7000,
    rentDueDate: 5,
    paymentStatus: "PAID",
    emergencyContactName: "Dr. Sunita Reddy",
    emergencyContactRelation: "Mother",
    emergencyContactPhone: "+91 87000 99881",
    status: "ACTIVE",
  },
  {
    id: "tenant-103",
    bedId: "bed-g02-2",
    name: "Amit Sharma",
    phone: "+91 76543 21098",
    email: "amit.sharma99@gmail.com",
    roomNumber: "G02",
    bedNumber: 2,
    floorName: "Ground Floor",
    checkInDate: "2025-01-10",
    leaseEndDate: "2026-01-09",
    advanceDeposit: 5000,
    monthlyRent: 5500,
    rentDueDate: 10,
    paymentStatus: "OVERDUE",
    emergencyContactName: "Rajeev Sharma",
    emergencyContactRelation: "Brother",
    emergencyContactPhone: "+91 76222 33445",
    status: "ACTIVE",
  },
  {
    id: "tenant-104",
    bedId: "bed-g03-1",
    name: "Priya Nair",
    phone: "+91 65432 10987",
    email: "priya.nair@yahoo.com",
    roomNumber: "G03",
    bedNumber: 1,
    floorName: "Ground Floor",
    checkInDate: "2025-08-20",
    leaseEndDate: "2026-02-19",
    advanceDeposit: 7000,
    monthlyRent: 6000,
    rentDueDate: 1,
    paymentStatus: "PAID",
    emergencyContactName: "Mohan Nair",
    emergencyContactRelation: "Father",
    emergencyContactPhone: "+91 65999 88776",
    status: "ACTIVE",
  },
  {
    id: "tenant-105",
    bedId: "bed-g03-2",
    name: "Karan Mehta",
    phone: "+91 54321 09876",
    email: "karan.m@gmail.com",
    roomNumber: "G03",
    bedNumber: 2,
    floorName: "Ground Floor",
    checkInDate: "2025-04-01",
    leaseEndDate: "2026-09-30",
    advanceDeposit: 12000,
    monthlyRent: 7500,
    rentDueDate: 1,
    paymentStatus: "UNPAID",
    emergencyContactName: "Vinod Mehta",
    emergencyContactRelation: "Father",
    emergencyContactPhone: "+91 54111 44556",
    status: "ACTIVE",
  },
  {
    id: "tenant-106",
    bedId: "bed-101-1",
    name: "Divya Joshi",
    phone: "+91 43210 98765",
    email: "divya.j@gmail.com",
    roomNumber: "101",
    bedNumber: 1,
    floorName: "First Floor",
    checkInDate: "2026-01-01",
    leaseEndDate: "2026-12-31",
    advanceDeposit: 9000,
    monthlyRent: 6800,
    rentDueDate: 1,
    paymentStatus: "PAID",
    emergencyContactName: "Anita Joshi",
    emergencyContactRelation: "Mother",
    emergencyContactPhone: "+91 43000 11223",
    status: "ACTIVE",
  },
  {
    id: "tenant-107",
    bedId: "bed-101-3",
    name: "Rohit Verma",
    phone: "+91 32109 87654",
    email: "rohit.verma@techcorp.in",
    roomNumber: "101",
    bedNumber: 3,
    floorName: "First Floor",
    checkInDate: "2025-11-15",
    leaseEndDate: "2026-11-14",
    advanceDeposit: 6000,
    monthlyRent: 5800,
    rentDueDate: 15,
    paymentStatus: "PARTIAL",
    emergencyContactName: "Kailash Verma",
    emergencyContactRelation: "Uncle",
    emergencyContactPhone: "+91 32999 00112",
    status: "ACTIVE",
  },
  {
    id: "tenant-108",
    bedId: "bed-102-1",
    name: "Ananya Das",
    phone: "+91 21098 76543",
    email: "ananya.das@icloud.com",
    roomNumber: "102",
    bedNumber: 1,
    floorName: "First Floor",
    checkInDate: "2025-07-01",
    leaseEndDate: "2026-06-30",
    advanceDeposit: 10000,
    monthlyRent: 7200,
    rentDueDate: 1,
    paymentStatus: "PAID",
    emergencyContactName: "Subhash Das",
    emergencyContactRelation: "Father",
    emergencyContactPhone: "+91 21444 77889",
    status: "ACTIVE",
  },
];

/* ─── Initial Seed Ledger History ────────────────────────────── */

const initialSeedLedger: PaymentRecord[] = [
  {
    id: "pay-101-1",
    tenantId: "tenant-101",
    tenantName: "Ravi Kumar",
    roomNumber: "G01",
    bedNumber: 1,
    month: "Sep 2026",
    amount: 6500,
    status: "UNPAID",
    paidOn: null,
    paymentMode: null,
    transactionRef: null,
  },
  {
    id: "pay-101-2",
    tenantId: "tenant-101",
    tenantName: "Ravi Kumar",
    roomNumber: "G01",
    bedNumber: 1,
    month: "Aug 2026",
    amount: 6500,
    status: "PAID",
    paidOn: "2026-08-02",
    paymentMode: "UPI",
    transactionRef: "UPI/3245678912/OKHDFC",
  },
  {
    id: "pay-101-3",
    tenantId: "tenant-101",
    tenantName: "Ravi Kumar",
    roomNumber: "G01",
    bedNumber: 1,
    month: "Jul 2026",
    amount: 6500,
    status: "PAID",
    paidOn: "2026-07-01",
    paymentMode: "BANK_TRANSFER",
    transactionRef: "NEFT/HDFC00012/IMPS",
  },
  {
    id: "pay-102-1",
    tenantId: "tenant-102",
    tenantName: "Sneha Reddy",
    roomNumber: "G02",
    bedNumber: 1,
    month: "Sep 2026",
    amount: 7000,
    status: "PAID",
    paidOn: "2026-09-04",
    paymentMode: "CASH",
    transactionRef: "REC#9921",
  },
  {
    id: "pay-102-2",
    tenantId: "tenant-102",
    tenantName: "Sneha Reddy",
    roomNumber: "G02",
    bedNumber: 1,
    month: "Aug 2026",
    amount: 7000,
    status: "PAID",
    paidOn: "2026-08-04",
    paymentMode: "UPI",
    transactionRef: "UPI/889211029/GPay",
  },
  {
    id: "pay-103-1",
    tenantId: "tenant-103",
    tenantName: "Amit Sharma",
    roomNumber: "G02",
    bedNumber: 2,
    month: "Sep 2026",
    amount: 5500,
    status: "OVERDUE",
    paidOn: null,
    paymentMode: null,
    transactionRef: null,
  },
  {
    id: "pay-103-2",
    tenantId: "tenant-103",
    tenantName: "Amit Sharma",
    roomNumber: "G02",
    bedNumber: 2,
    month: "Aug 2026",
    amount: 3000,
    status: "PARTIAL",
    paidOn: "2026-08-10",
    paymentMode: "UPI",
    transactionRef: "UPI/771122091/PhonePe",
  },
  {
    id: "pay-104-1",
    tenantId: "tenant-104",
    tenantName: "Priya Nair",
    roomNumber: "G03",
    bedNumber: 1,
    month: "Sep 2026",
    amount: 6000,
    status: "PAID",
    paidOn: "2026-09-01",
    paymentMode: "UPI",
    transactionRef: "UPI/554433221/Paytm",
  },
  {
    id: "pay-105-1",
    tenantId: "tenant-105",
    tenantName: "Karan Mehta",
    roomNumber: "G03",
    bedNumber: 2,
    month: "Sep 2026",
    amount: 7500,
    status: "UNPAID",
    paidOn: null,
    paymentMode: null,
    transactionRef: null,
  },
  {
    id: "pay-106-1",
    tenantId: "tenant-106",
    tenantName: "Divya Joshi",
    roomNumber: "101",
    bedNumber: 1,
    month: "Sep 2026",
    amount: 6800,
    status: "PAID",
    paidOn: "2026-09-01",
    paymentMode: "UPI",
    transactionRef: "UPI/332211990/BHIM",
  },
  {
    id: "pay-107-1",
    tenantId: "tenant-107",
    tenantName: "Rohit Verma",
    roomNumber: "101",
    bedNumber: 3,
    month: "Sep 2026",
    amount: 3000,
    status: "PARTIAL",
    paidOn: "2026-09-15",
    paymentMode: "UPI",
    transactionRef: "UPI/129988776/GPay",
  },
  {
    id: "pay-108-1",
    tenantId: "tenant-108",
    tenantName: "Ananya Das",
    roomNumber: "102",
    bedNumber: 1,
    month: "Sep 2026",
    amount: 7200,
    status: "PAID",
    paidOn: "2026-09-02",
    paymentMode: "BANK_TRANSFER",
    transactionRef: "IMPS/ICICI99212",
  },
];

/* ─── Initial Seed Payment Submissions ───────────────────────── */

const initialSeedSubmissions: PaymentSubmission[] = [
  {
    id: "sub-9001",
    tenantId: "tenant-101",
    tenantName: "Ravi Kumar",
    roomNumber: "G01",
    bedNumber: 1,
    amount: 6500,
    transactionId: "UPI/428910023419",
    paymentMode: "GPAY_UPI",
    notes: "September Rent paid via Google Pay",
    status: "PENDING_VERIFICATION",
    submittedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(), // 35m ago
  },
];

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
