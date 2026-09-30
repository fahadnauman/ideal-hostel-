import { NextRequest, NextResponse } from "next/server";
import { mockRoomsByFloor } from "@/data/mock-rooms";
import {
  getAllTenants,
  getTenantById,
  updateTenant,
  addTenant,
  getTenantPaymentHistory,
  addPaymentRecord,
  createPaymentSubmission,
  getAllPaymentSubmissions,
} from "@/lib/tenants-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const status = searchParams.get("status"); // "PAID", "DUES", "OVERDUE", "ALL"
    const search = searchParams.get("search");
    const room = searchParams.get("room");
    const submissions = searchParams.get("submissions");

    if (submissions === "true") {
      return NextResponse.json({
        success: true,
        submissions: getAllPaymentSubmissions(),
      });
    }

    if (id) {
      const tenant = getTenantById(id);
      if (!tenant) {
        return NextResponse.json({ success: false, error: "Tenant not found" }, { status: 404 });
      }
      const history = getTenantPaymentHistory(id);
      return NextResponse.json({
        success: true,
        tenant,
        paymentHistory: history,
      });
    }

    let tenants = getAllTenants();

    if (room) {
      tenants = tenants.filter((t) => t.roomNumber?.toUpperCase() === room.toUpperCase());
    }

    if (status && status !== "ALL") {
      if (status === "DUES") {
        tenants = tenants.filter(
          (t) => t.paymentStatus === "UNPAID" || t.paymentStatus === "OVERDUE" || t.paymentStatus === "PARTIAL"
        );
      } else {
        tenants = tenants.filter((t) => t.paymentStatus === status);
      }
    }

    if (search) {
      const query = search.toLowerCase();
      tenants = tenants.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.phone.toLowerCase().includes(query) ||
          t.roomNumber?.toLowerCase().includes(query) ||
          (t.emergencyContactName && t.emergencyContactName.toLowerCase().includes(query))
      );
    }

    return NextResponse.json({
      success: true,
      tenants,
      total: tenants.length,
      counts: {
        total: getAllTenants().length,
        paid: getAllTenants().filter((t) => t.paymentStatus === "PAID").length,
        dues: getAllTenants().filter(
          (t) => t.paymentStatus === "UNPAID" || t.paymentStatus === "OVERDUE" || t.paymentStatus === "PARTIAL"
        ).length,
      },
    });
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tenants" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Tenant ID is required for update" },
        { status: 400 }
      );
    }

    const updated = updateTenant(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Tenant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tenant details updated successfully",
      tenant: updated,
    });
  } catch (error) {
    console.error("Error updating tenant:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update tenant" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Add a new tenant
    if (action === "add_tenant") {
      const { 
        name, phone, roomNumber, bedId, monthlyRent, advanceDeposit, checkInDate,
        dateOfBirth, whatsappNumber, permanentAddress, courseName, branch, yearOfStudy,
        parentName, parentOccupation, parentPhone, paymentMethod 
      } = body;
      const tenant = addTenant({
        name,
        phone,
        roomNumber,
        bedId,
        monthlyRent: Number(monthlyRent),
        advanceDeposit: Number(advanceDeposit),
        checkInDate,
        dateOfBirth,
        whatsappNumber,
        permanentAddress,
        courseName,
        branch,
        yearOfStudy,
        parentName,
        parentOccupation,
        parentPhone,
        paymentMethod,
        paymentStatus: "PAID",
        status: "ACTIVE",
        rentDueDate: 5,
        email: null,
        leaseEndDate: null,
        emergencyContactName: parentName || "",
        emergencyContactPhone: parentPhone || "",
        emergencyContactRelation: parentName ? "Parent" : "",
      });

      // Map the tenant to the global bed state so it persists in the UI
      // Use map to ensure we don't accidentally overwrite or mutate the whole array incorrectly
      for (const floor of Object.values(mockRoomsByFloor)) {
        const roomIndex = floor.findIndex(r => r.beds.some(b => b.id === bedId));
        if (roomIndex !== -1) {
          const room = floor[roomIndex];
          room.beds = room.beds.map(b => 
            b.id === bedId 
              ? { ...b, tenant, status: "OCCUPIED" } 
              : b
          );
          break;
        }
      }

      return NextResponse.json({ success: true, tenant });
    }

    // Record verified payment
    if (action === "record_payment") {
      const { tenantId, tenantName, roomNumber, bedNumber, amount, month, paymentMode, transactionRef } = body;
      const record = addPaymentRecord({
        tenantId,
        tenantName,
        roomNumber,
        bedNumber: bedNumber || 1,
        amount: Number(amount),
        month: month || "Sep 2026",
        status: "PAID",
        paidOn: new Date().toISOString().split("T")[0],
        paymentMode: paymentMode || "UPI",
        transactionRef: transactionRef || null,
      });

      return NextResponse.json({
        success: true,
        message: "Payment recorded successfully",
        payment: record,
      });
    }

    // Submit payment proof from tenant portal
    if (action === "submit_proof") {
      const { tenantName, roomNumber, amount, transactionId, screenshotUrl, paymentMode, notes } = body;
      const submission = createPaymentSubmission({
        tenantName: String(tenantName).trim(),
        roomNumber: String(roomNumber).trim().toUpperCase(),
        amount: Number(amount),
        transactionId: String(transactionId).trim(),
        screenshotUrl: screenshotUrl || null,
        paymentMode: paymentMode || "GPAY_UPI",
        notes: notes || undefined,
      });

      return NextResponse.json({
        success: true,
        message: "Payment reference submitted successfully",
        submission,
      });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Error processing tenant action:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
