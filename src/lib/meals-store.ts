import type { MealRecord, MealType, MealStatus } from "@/types";

const todayStr = new Date().toISOString().split("T")[0];

const initialMealRecords: MealRecord[] = [
  { id: "meal-1", date: todayStr, tenantId: "tenant-101", tenantName: "Ravi Kumar", roomNumber: "G01", mealType: "BREAKFAST", status: "OPTED_IN" },
  { id: "meal-2", date: todayStr, tenantId: "tenant-101", tenantName: "Ravi Kumar", roomNumber: "G01", mealType: "LUNCH", status: "SKIPPED" },
  { id: "meal-3", date: todayStr, tenantId: "tenant-101", tenantName: "Ravi Kumar", roomNumber: "G01", mealType: "DINNER", status: "OPTED_IN" },
  { id: "meal-4", date: todayStr, tenantId: "tenant-102", tenantName: "Sneha Reddy", roomNumber: "G02", mealType: "BREAKFAST", status: "OPTED_IN" },
  { id: "meal-5", date: todayStr, tenantId: "tenant-102", tenantName: "Sneha Reddy", roomNumber: "G02", mealType: "LUNCH", status: "OPTED_IN" },
  { id: "meal-6", date: todayStr, tenantId: "tenant-102", tenantName: "Sneha Reddy", roomNumber: "G02", mealType: "DINNER", status: "OPTED_IN" },
  { id: "meal-7", date: todayStr, tenantId: "tenant-103", tenantName: "Amit Sharma", roomNumber: "G02", mealType: "BREAKFAST", status: "SKIPPED" },
  { id: "meal-8", date: todayStr, tenantId: "tenant-103", tenantName: "Amit Sharma", roomNumber: "G02", mealType: "LUNCH", status: "OPTED_IN" },
  { id: "meal-9", date: todayStr, tenantId: "tenant-103", tenantName: "Amit Sharma", roomNumber: "G02", mealType: "DINNER", status: "SKIPPED" },
  { id: "meal-10", date: todayStr, tenantId: "tenant-104", tenantName: "Priya Nair", roomNumber: "G03", mealType: "BREAKFAST", status: "OPTED_IN" },
  { id: "meal-11", date: todayStr, tenantId: "tenant-104", tenantName: "Priya Nair", roomNumber: "G03", mealType: "LUNCH", status: "OPTED_IN" },
  { id: "meal-12", date: todayStr, tenantId: "tenant-104", tenantName: "Priya Nair", roomNumber: "G03", mealType: "DINNER", status: "OPTED_IN" },
];

declare global {
  var __pghq_meal_records: MealRecord[] | undefined;
}

if (!globalThis.__pghq_meal_records) {
  globalThis.__pghq_meal_records = [...initialMealRecords];
}

export function getAllMealRecords(): MealRecord[] {
  return [...(globalThis.__pghq_meal_records ?? [])];
}

export function getMealsForDate(dateStr: string): MealRecord[] {
  return (globalThis.__pghq_meal_records ?? []).filter((r) => r.date === dateStr);
}

export function getMealRecord(dateStr: string, roomNumber: string, mealType: MealType): MealRecord | undefined {
  return (globalThis.__pghq_meal_records ?? []).find(
    (r) => r.date === dateStr && r.roomNumber.toUpperCase() === roomNumber.toUpperCase() && r.mealType === mealType
  );
}

export function toggleMealStatus(params: {
  date?: string;
  roomNumber: string;
  tenantName: string;
  mealType: MealType;
  status: MealStatus;
}): MealRecord {
  if (!globalThis.__pghq_meal_records) {
    globalThis.__pghq_meal_records = [];
  }

  const date = params.date || new Date().toISOString().split("T")[0];
  const index = globalThis.__pghq_meal_records.findIndex(
    (r) => r.date === date && r.roomNumber.toUpperCase() === params.roomNumber.toUpperCase() && r.mealType === params.mealType
  );

  if (index !== -1) {
    globalThis.__pghq_meal_records[index] = {
      ...globalThis.__pghq_meal_records[index],
      status: params.status,
      tenantName: params.tenantName || globalThis.__pghq_meal_records[index].tenantName,
    };
    return globalThis.__pghq_meal_records[index];
  } else {
    const newRecord: MealRecord = {
      id: `meal-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      date,
      tenantId: `tenant-${params.roomNumber.toLowerCase()}`,
      tenantName: params.tenantName || `Room ${params.roomNumber} Resident`,
      roomNumber: params.roomNumber.toUpperCase(),
      mealType: params.mealType,
      status: params.status,
    };
    globalThis.__pghq_meal_records.push(newRecord);
    return newRecord;
  }
}
