import { NextRequest, NextResponse } from "next/server";
import { getOwnerSettings, updateOwnerSettings } from "@/lib/settings-store";

export async function GET() {
  try {
    const settings = getOwnerSettings();
    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch owner settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = updateOwnerSettings(body);
    return NextResponse.json({
      success: true,
      message: "Owner settings updated successfully",
      settings: updated,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update owner settings" },
      { status: 500 }
    );
  }
}
