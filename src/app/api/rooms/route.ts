import { NextRequest, NextResponse } from "next/server";
import { mockRoomsByFloor } from "@/data/mock-rooms";
import { Room } from "@/types";

function getRoomType(bedsCount: number) {
  if (bedsCount === 1) return "SINGLE";
  if (bedsCount === 2) return "DOUBLE";
  if (bedsCount === 3) return "TRIPLE";
  if (bedsCount === 4) return "QUAD";
  return "DORMITORY";
}

export async function GET() {
  return NextResponse.json({ success: true, rooms: mockRoomsByFloor });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, roomId, floorId, newRoomNumber, actionType, bedId } = body;

    const floor = mockRoomsByFloor[floorId];
    if (!floor) return NextResponse.json({ success: false, error: "Floor not found" }, { status: 404 });

    const roomIndex = floor.findIndex(r => r.id === roomId);
    if (roomIndex === -1) return NextResponse.json({ success: false, error: "Room not found" }, { status: 404 });

    const room = floor[roomIndex];

    if (action === "update_room") {
      // Update room number
      if (newRoomNumber) {
        room.roomNumber = newRoomNumber;
      }
      
      // Bed modifications
      if (actionType === "add_bed") {
        const nextBedNum = room.beds.length > 0 ? Math.max(...room.beds.map(b => b.bedNumber)) + 1 : 1;
        room.beds.push({
          id: `bed-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          roomId: room.id,
          bedNumber: nextBedNum,
          status: "AVAILABLE",
          tenant: null
        });
      } else if (actionType === "remove_bed" && bedId) {
        const bedIndex = room.beds.findIndex(b => b.id === bedId);
        if (bedIndex !== -1) {
          const bed = room.beds[bedIndex];
          if (bed.tenant) {
            return NextResponse.json({ success: false, error: "Cannot delete an occupied bed" }, { status: 400 });
          }
          room.beds.splice(bedIndex, 1);
        }
      }

      room.roomType = getRoomType(room.beds.length);

      return NextResponse.json({ success: true, room });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to process request" }, { status: 500 });
  }
}
