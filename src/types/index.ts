/* ─── Enums (mirroring Prisma) ───────────────────────────── */

export type BedStatus = "AVAILABLE" | "OCCUPIED" | "DUE" | "ENDING_SOON";

export type PaymentStatus = "PAID" | "UNPAID" | "PARTIAL" | "OVERDUE";

export type RoomType = "SINGLE" | "DOUBLE" | "TRIPLE" | "QUAD" | "DORMITORY";

export type MaintenanceStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED";

export type MaintenanceCategory =
  | "PLUMBING"
  | "ELECTRICAL"
  | "AC_VENTILATION"
  | "CARPENTRY"
  | "CLEANING"
  | "OTHER";

/* ─── Maintenance ────────────────────────────────────────── */

export interface MaintenanceTask {
  id: string;
  roomId: string;
  roomNumber: string;
  category: MaintenanceCategory;
  description: string;
  photoUrl?: string | null;
  status: MaintenanceStatus;
  tenantName?: string | null;
  tenantPhone?: string | null;
  createdAt: string;
  updatedAt: string;
}

/* ─── Models ─────────────────────────────────────────────── */

export interface Floor {
  id: string;
  propertyId: string;
  floorNumber: number;
  name: string | null;
}

export interface Room {
  id: string;
  floorId: string;
  roomNumber: string;
  roomType: RoomType;
  beds: Bed[];
}

export interface Bed {
  id: string;
  roomId: string;
  bedNumber: number;
  status: BedStatus;
  tenant: Tenant | null;
}

export interface Tenant {
  id: string;
  bedId: string;
  name: string;
  phone: string;
  email: string | null;
  checkInDate: string;
  leaseEndDate: string | null;
  advanceDeposit: number;
  monthlyRent: number;
  rentDueDate: number;
  paymentStatus: PaymentStatus;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  emergencyContactRelation?: string | null;
  dateOfBirth?: string | null;
  whatsappNumber?: string | null;
  permanentAddress?: string | null;
  courseName?: string | null;
  branch?: string | null;
  yearOfStudy?: string | null;
  parentName?: string | null;
  parentOccupation?: string | null;
  parentPhone?: string | null;
  paymentMethod?: "CASH" | "UPI" | null;
  roomNumber?: string;
  bedNumber?: number;
  floorName?: string;
  status?: "ACTIVE" | "NOTICE" | "VACATED";
}

export type PaymentMode = "CASH" | "UPI" | "BANK_TRANSFER" | null;

export interface PaymentRecord {
  id: string;
  tenantId: string;
  tenantName: string;
  roomNumber: string;
  bedNumber: number;
  month: string;
  amount: number;
  status: PaymentStatus;
  paidOn: string | null;
  paymentMode: PaymentMode;
  transactionRef?: string | null;
}

/* ─── Meals ──────────────────────────────────────────────── */

export type MealType = "BREAKFAST" | "LUNCH" | "DINNER";
export type MealStatus = "OPTED_IN" | "SKIPPED";

export interface MealRecord {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  tenantId: string;
  tenantName: string;
  roomNumber: string;
  mealType: MealType;
  status: MealStatus;
}

/* ─── Owner Settings ─────────────────────────────────────── */

export interface OwnerSettings {
  propertyName: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  upiId: string;
  merchantName: string;
  qrImageUrl?: string | null;
  paymentInstructions?: string;
  breakfastWindow: string;
  lunchWindow: string;
  dinnerWindow: string;
  updatedAt: string;
}

/* ─── Payment Proof Submission ───────────────────────────── */

export interface PaymentSubmission {
  id: string;
  tenantId?: string;
  tenantName: string;
  roomNumber: string;
  bedNumber?: number;
  amount: number;
  transactionId: string;
  screenshotUrl?: string | null;
  paymentMode: string;
  notes?: string;
  status: "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED";
  submittedAt: string;
}

/* ─── Owner Productivity Tasks ───────────────────────────────── */

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
