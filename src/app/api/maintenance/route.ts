import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { MaintenanceStatus } from "@prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as MaintenanceStatus | null;
    const room = searchParams.get("room");

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (room) {
      where.OR = [
        { roomId: room },
        { room: { roomNumber: { equals: room, mode: "insensitive" } } }
      ];
    }

    const tasksDb = await prisma.maintenanceTask.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { room: true },
    });

    const tasks = tasksDb.map(t => ({
      ...t,
      roomNumber: t.room?.roomNumber || "Unknown",
      tenantPhone: null,
    }));

    const allTasks = await prisma.maintenanceTask.findMany({ select: { status: true } });

    return NextResponse.json({
      success: true,
      tasks,
      total: tasks.length,
      counts: {
        total: allTasks.length,
        pending: allTasks.filter((t) => t.status === "PENDING").length,
        inProgress: allTasks.filter((t) => t.status === "IN_PROGRESS").length,
        resolved: allTasks.filter((t) => t.status === "RESOLVED").length,
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
    const { roomNumber, category, description, photoUrl, tenantName, roomId } = body;

    if (!roomNumber || !description) {
      return NextResponse.json(
        { success: false, error: "Room number and issue description are required" },
        { status: 400 }
      );
    }

    let finalRoomId = roomId;

    if (!finalRoomId && roomNumber) {
      const dbRoom = await prisma.room.findFirst({
        where: { roomNumber: { equals: String(roomNumber).trim(), mode: "insensitive" } }
      });
      if (dbRoom) {
        finalRoomId = dbRoom.id;
      } else {
        let floor = await prisma.floor.findFirst();
        if (!floor) {
          const property = await prisma.property.findFirst();
          if (property) {
             floor = await prisma.floor.create({ data: { propertyId: property.id, floorNumber: 1, name: "Ground Floor" } });
          }
        }
        if (floor) {
          const newRoom = await prisma.room.create({ data: { floorId: floor.id, roomNumber: String(roomNumber).trim().toUpperCase() } });
          finalRoomId = newRoom.id;
        } else {
          return NextResponse.json({ success: false, error: "System has no property/floor setup." }, { status: 400 });
        }
      }
    }

    const validCategories = [
      "PLUMBING",
      "ELECTRICAL",
      "AC_VENTILATION",
      "CARPENTRY",
      "CLEANING",
      "OTHER",
    ];

    const taskCategory = validCategories.includes(category) ? category : "OTHER";

    const newTaskDb = await prisma.maintenanceTask.create({
      data: {
        roomId: finalRoomId,
        category: taskCategory,
        description: String(description).trim(),
        photoUrl: photoUrl || null,
        tenantName: tenantName ? String(tenantName).trim() : null,
        status: "PENDING",
      },
      include: { room: true },
    });

    const newTask = {
      ...newTaskDb,
      roomNumber: newTaskDb.room?.roomNumber || "Unknown",
      tenantPhone: null,
    };

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

    const validStatuses = ["PENDING", "IN_PROGRESS", "RESOLVED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value" },
        { status: 400 }
      );
    }

    const updatedDb = await prisma.maintenanceTask.update({
      where: { id },
      data: { status: status as MaintenanceStatus },
      include: { room: true },
    });

    const updated = {
      ...updatedDb,
      roomNumber: updatedDb.room?.roomNumber || "Unknown",
      tenantPhone: null,
    };

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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, roomNumber, category, description, tenantName } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Task ID is required" },
        { status: 400 }
      );
    }

    const dataToUpdate: any = {};
    if (category) dataToUpdate.category = category;
    if (description) dataToUpdate.description = description;
    if (tenantName !== undefined) dataToUpdate.tenantName = tenantName;

    if (roomNumber) {
      const dbRoom = await prisma.room.findFirst({
        where: { roomNumber: { equals: String(roomNumber).trim(), mode: "insensitive" } }
      });
      if (dbRoom) {
        dataToUpdate.roomId = dbRoom.id;
      }
    }

    const updatedDb = await prisma.maintenanceTask.update({
      where: { id },
      data: dataToUpdate,
      include: { room: true },
    });

    const updated = {
      ...updatedDb,
      roomNumber: updatedDb.room?.roomNumber || "Unknown",
      tenantPhone: null,
    };

    return NextResponse.json({
      success: true,
      message: `Task updated successfully`,
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

    await prisma.maintenanceTask.delete({
      where: { id }
    });

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
