import { NextRequest, NextResponse } from "next/server";
import {
  getAllTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
} from "@/lib/maintenance-store";
import type { MaintenanceCategory, MaintenanceStatus } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as MaintenanceStatus | null;
    const room = searchParams.get("room");

    let tasks = getAllTasks();

    if (status) {
      tasks = tasks.filter((t) => t.status === status);
    }
    if (room) {
      tasks = tasks.filter(
        (t) =>
          t.roomNumber.toLowerCase() === room.toLowerCase() ||
          t.roomId.toLowerCase() === room.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      tasks,
      total: tasks.length,
      counts: {
        total: getAllTasks().length,
        pending: getAllTasks().filter((t) => t.status === "PENDING").length,
        inProgress: getAllTasks().filter((t) => t.status === "IN_PROGRESS").length,
        resolved: getAllTasks().filter((t) => t.status === "RESOLVED").length,
      },
    });
  } catch (error) {
    console.error("Error fetching maintenance tasks:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch maintenance tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomNumber, category, description, photoUrl, tenantName, tenantPhone, roomId } = body;

    if (!roomNumber || !description) {
      return NextResponse.json(
        { success: false, error: "Room number and issue description are required" },
        { status: 400 }
      );
    }

    const validCategories: MaintenanceCategory[] = [
      "PLUMBING",
      "ELECTRICAL",
      "AC_VENTILATION",
      "CARPENTRY",
      "CLEANING",
      "OTHER",
    ];

    const taskCategory: MaintenanceCategory = validCategories.includes(category)
      ? category
      : "OTHER";

    const newTask = createTask({
      roomNumber: String(roomNumber).trim().toUpperCase(),
      roomId: roomId ? String(roomId).trim() : undefined,
      category: taskCategory,
      description: String(description).trim(),
      photoUrl: photoUrl || null,
      tenantName: tenantName ? String(tenantName).trim() : null,
      tenantPhone: tenantPhone ? String(tenantPhone).trim() : null,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Maintenance request created successfully",
        task: newTask,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating maintenance task:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create maintenance task" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Task ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses: MaintenanceStatus[] = ["PENDING", "IN_PROGRESS", "RESOLVED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value" },
        { status: 400 }
      );
    }

    const updated = updateTaskStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Task status updated to ${status}`,
      task: updated,
    });
  } catch (error) {
    console.error("Error updating maintenance task:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update maintenance task" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Task ID is required" },
        { status: 400 }
      );
    }

    const deleted = deleteTask(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Task not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Maintenance task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting maintenance task:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete maintenance task" },
      { status: 500 }
    );
  }
}
