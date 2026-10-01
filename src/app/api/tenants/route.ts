import { NextRequest, NextResponse } from "next/server";
import { mockRoomsByFloor } from "@/data/mock-rooms";
import {
  getAllTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
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

    // Bulk import tenants
    if (action === "bulk_import") {
      const { tenants } = body; // Array of tenant objects
      if (!Array.isArray(tenants)) {
        return NextResponse.json({ success: false, error: "Invalid payload, expected array of tenants" }, { status: 400 });
      }

      const importedTenants = [];
      let successCount = 0;

      for (const tData of tenants) {
        const { 
          name, phone, roomNumber, bedId, monthlyRent, advanceDeposit, checkInDate,
          dateOfBirth, whatsappNumber, permanentAddress, courseName, branch, yearOfStudy,
          parentName, parentOccupation, parentPhone, paymentMethod 
        } = tData;

        let targetBedId = bedId;

        // If no bedId is provided, try to find an available bed in the specified roomNumber
        if (!targetBedId && roomNumber) {
          for (const floorRooms of Object.values(mockRoomsByFloor)) {
            const room = floorRooms.find(r => r.roomNumber.toUpperCase() === roomNumber.toUpperCase());
            if (room) {
              const availableBed = room.beds.find(b => b.status === "AVAILABLE");
              if (availableBed) {
                targetBedId = availableBed.id;
              }
            }
            if (targetBedId) break;
          }
        }

        // If still no bedId, find ANY available bed
        if (!targetBedId) {
          for (const floorRooms of Object.values(mockRoomsByFloor)) {
            for (const room of floorRooms) {
              const availableBed = room.beds.find(b => b.status === "AVAILABLE");
              if (availableBed) {
                targetBedId = availableBed.id;
                break;
              }
            }
            if (targetBedId) break;
          }
        }

        if (!targetBedId) continue; // Skip if hostel is completely full

        const tenant = addTenant({
          name: name || "Unknown",
          phone: phone || "",
          roomNumber: roomNumber || "",
          bedId: targetBedId,
          monthlyRent: Number(monthlyRent) || 0,
          advanceDeposit: Number(advanceDeposit) || 0,
          checkInDate: checkInDate || new Date().toISOString().split("T")[0],
          dateOfBirth: dateOfBirth || "",
          whatsappNumber: whatsappNumber || "",
          permanentAddress: permanentAddress || "",
          courseName: courseName || "",
          branch: branch || "",
          yearOfStudy: yearOfStudy || "",
          parentName: parentName || "",
          parentOccupation: parentOccupation || "",
          parentPhone: parentPhone || "",
          paymentMethod: paymentMethod || "UPI",
          paymentStatus: "PAID",
          status: "ACTIVE",
          rentDueDate: 5,
          email: null,
          leaseEndDate: null,
          emergencyContactName: parentName || "",
          emergencyContactPhone: parentPhone || "",
          emergencyContactRelation: parentName ? "Parent" : "",
        });

        importedTenants.push(tenant);

        // Map the tenant to the global bed state
        for (const [floorKey, floorRooms] of Object.entries(mockRoomsByFloor)) {
          if (floorRooms.some(r => r.beds.some(b => b.id === targetBedId))) {
            mockRoomsByFloor[floorKey] = floorRooms.map(room => {
              if (room.beds.some(b => b.id === targetBedId)) {
                return {
                  ...room,
                  beds: room.beds.map(b => 
                    b.id === targetBedId 
                      ? { ...b, tenant, status: "OCCUPIED" } 
                      : b
                  )
                };
              }
              return room;
            });
            break;
          }
        }
        successCount++;
      }

      return NextResponse.json({ success: true, count: successCount, tenants: importedTenants });
    }

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
      for (const [floorKey, floorRooms] of Object.entries(mockRoomsByFloor)) {
        if (floorRooms.some(r => r.beds.some(b => b.id === bedId))) {
          mockRoomsByFloor[floorKey] = floorRooms.map(room => {
            if (room.beds.some(b => b.id === bedId)) {
              return {
                ...room,
                beds: room.beds.map(b => 
                  b.id === bedId 
                    ? { ...b, tenant, status: "OCCUPIED" } 
                    : b
                )
              };
            }
            return room;
          });
          break;
        }
      }

      return NextResponse.json({ success: true, tenant });
    }

    // Update an existing tenant
    if (action === "update_tenant") {
      const { 
        tenantId, bedId,
        name, phone, monthlyRent, advanceDeposit, checkInDate,
        dateOfBirth, whatsappNumber, permanentAddress, courseName, branch, yearOfStudy,
        parentName, parentOccupation, parentPhone, paymentMethod 
      } = body;

      const tenant = updateTenant(tenantId, {
        name,
        phone,
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
        emergencyContactName: parentName || "",
        emergencyContactPhone: parentPhone || "",
        emergencyContactRelation: parentName ? "Parent" : "",
      });

      if (!tenant) return NextResponse.json({ success: false, error: "Tenant not found" }, { status: 404 });

      // Map the tenant to the global bed state so it persists in the UI
      for (const [floorKey, floorRooms] of Object.entries(mockRoomsByFloor)) {
        if (floorRooms.some(r => r.beds.some(b => b.id === bedId))) {
          mockRoomsByFloor[floorKey] = floorRooms.map(room => {
            if (room.beds.some(b => b.id === bedId)) {
              return {
                ...room,
                beds: room.beds.map(b => 
                  b.id === bedId 
                    ? { ...b, tenant } 
                    : b
                )
              };
            }
            return room;
          });
          break;
        }
      }

      return NextResponse.json({ success: true, tenant });
    }

    // Terminate a tenant
    if (action === "terminate_tenant") {
      const { tenantId, bedId } = body;
      const tenant = updateTenant(tenantId, { status: "VACATED" });

      if (!tenant) return NextResponse.json({ success: false, error: "Tenant not found" }, { status: 404 });

      // Unlink the tenant from the bed
      for (const [floorKey, floorRooms] of Object.entries(mockRoomsByFloor)) {
        if (floorRooms.some(r => r.beds.some(b => b.id === bedId))) {
          mockRoomsByFloor[floorKey] = floorRooms.map(room => {
            if (room.beds.some(b => b.id === bedId)) {
              return {
                ...room,
                beds: room.beds.map(b => 
                  b.id === bedId 
                    ? { ...b, tenant: null, status: "AVAILABLE" } 
                    : b
                )
              };
            }
            return room;
          });
          break;
        }
      }
      return NextResponse.json({ success: true });
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });

    const tenant = getTenantById(id);
    if (!tenant) return NextResponse.json({ success: false, error: "Tenant not found" }, { status: 404 });

    const bedId = tenant.bedId;
    const deleted = deleteTenant(id);

    if (deleted && bedId) {
      // Unlink the tenant from the bed
      for (const [floorKey, floorRooms] of Object.entries(mockRoomsByFloor)) {
        if (floorRooms.some(r => r.beds.some(b => b.id === bedId))) {
          mockRoomsByFloor[floorKey] = floorRooms.map(room => {
            if (room.beds.some(b => b.id === bedId)) {
              return {
                ...room,
                beds: room.beds.map(b => 
                  b.id === bedId 
                    ? { ...b, tenant: null, status: "AVAILABLE" } 
                    : b
                )
              };
            }
            return room;
          });
          break;
        }
      }
    }

    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error("Error deleting tenant:", error);
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
  }
}

