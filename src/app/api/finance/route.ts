import { NextResponse } from "next/server";
import { mockRoomsByFloor, mockPaymentHistory } from "@/data/mock-rooms";

export async function GET() {
  const totalRevenue = mockPaymentHistory.filter(p => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0);
  const pendingDues = mockPaymentHistory.filter(p => p.status === "UNPAID" || p.status === "OVERDUE" || p.status === "PARTIAL").reduce((sum, p) => sum + p.amount, 0);
  
  let totalAdvance = 0;
  Object.values(mockRoomsByFloor).forEach(rooms => {
    rooms.forEach(room => {
      room.beds.forEach(bed => {
        if (bed.tenant) totalAdvance += bed.tenant.advanceDeposit;
      });
    });
  });

  return NextResponse.json({
    success: true,
    totalRevenue,
    pendingDues,
    totalAdvance,
    history: mockPaymentHistory
  });
}
