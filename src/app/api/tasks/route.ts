import { NextRequest, NextResponse } from "next/server";
import {
  getAllOwnerTasks,
  createOwnerTask,
  updateOwnerTask,
  deleteOwnerTask,
} from "@/lib/tasks-store";
import type { TaskPriority, TaskStatus } from "@/lib/tasks-store";

export async function GET() {
  const tasks = getAllOwnerTasks();
  return NextResponse.json({ tasks }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, notes, priority, dueDate, category } = body;

    if (!title || typeof title !== "string" || title.trim().length < 2) {
      return NextResponse.json(
        { error: "Title must be at least 2 characters." },
        { status: 400 }
      );
    }

    const task = createOwnerTask({
      title: title.trim(),
      notes: notes || "",
      priority: (priority as TaskPriority) || "MEDIUM",
      dueDate: dueDate || null,
      category: category || "General",
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Task id is required." }, { status: 400 });
    }

    const validUpdates: {
      title?: string;
      notes?: string;
      priority?: TaskPriority;
      status?: TaskStatus;
      dueDate?: string | null;
      category?: string;
    } = {};

    if (updates.title !== undefined) validUpdates.title = String(updates.title).trim();
    if (updates.notes !== undefined) validUpdates.notes = String(updates.notes);
    if (updates.priority !== undefined) validUpdates.priority = updates.priority as TaskPriority;
    if (updates.status !== undefined) validUpdates.status = updates.status as TaskStatus;
    if (updates.dueDate !== undefined) validUpdates.dueDate = updates.dueDate;
    if (updates.category !== undefined) validUpdates.category = String(updates.category);

    const task = updateOwnerTask(id, validUpdates);
    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    return NextResponse.json({ task }, { status: 200 });
  } catch (err) {
    console.error("PATCH /api/tasks error:", err);
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Task id is required." }, { status: 400 });
    }
    const deleted = deleteOwnerTask(id);
    if (!deleted) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/tasks error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
