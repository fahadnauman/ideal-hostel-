import { NextRequest, NextResponse } from "next/server";
import { getMealsForDate, toggleMealStatus, getAllMealRecords } from "@/lib/meals-store";
import type { MealType, MealStatus } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
    const room = searchParams.get("room");

    let records = getMealsForDate(date);
    if (room) {
      records = records.filter((r) => r.roomNumber.toUpperCase() === room.toUpperCase());
    }

    return NextResponse.json({
      success: true,
      date,
      records,
      headcounts: {
        breakfast: records.filter((r) => r.mealType === "BREAKFAST" && r.status === "OPTED_IN").length,
        lunch: records.filter((r) => r.mealType === "LUNCH" && r.status === "OPTED_IN").length,
        dinner: records.filter((r) => r.mealType === "DINNER" && r.status === "OPTED_IN").length,
        totalOptedIn: records.filter((r) => r.status === "OPTED_IN").length,
        totalSkipped: records.filter((r) => r.status === "SKIPPED").length,
      },
    });
  } catch (error) {
    console.error("Error fetching meals:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch meal records" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomNumber, tenantName, mealType, status, date } = body;

    if (!roomNumber || !mealType || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required meal parameters" },
        { status: 400 }
      );
    }

    const updated = toggleMealStatus({
      roomNumber: String(roomNumber).toUpperCase(),
      tenantName: tenantName || `Room ${roomNumber} Resident`,
      mealType: mealType as MealType,
      status: status as MealStatus,
      date,
    });

    return NextResponse.json({
      success: true,
      message: "Meal status updated successfully",
      record: updated,
    });
  } catch (error) {
    console.error("Error updating meal preference:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update meal preference" },
      { status: 500 }
    );
  }
}
