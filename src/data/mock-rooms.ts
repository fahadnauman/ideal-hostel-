import type {
  Floor,
  Room,
  Bed,
  Tenant,
  PaymentRecord,
} from "@/types";

/* ─── Helpers ────────────────────────────────────────────── */

let _id = 0;
const id = () => `mock-${++_id}`;

/* ─── Tenants ────────────────────────────────────────────── */

const tenants: Record<string, Tenant> = {};

/* ─── Bed builder ────────────────────────────────────────── */

function bed(
  roomId: string,
  bedNumber: number,
  status: Bed["status"],
  tenantKey?: string
): Bed {
  const b: Bed = {
    id: id(),
    roomId,
    bedNumber,
    status,
    tenant: tenantKey ? { ...tenants[tenantKey] } : null,
  };
  if (b.tenant) b.tenant.bedId = b.id;
  return b;
}

/* ─── Rooms ──────────────────────────────────────────────── */

function room(
  floorId: string,
  roomNumber: string,
  roomType: Room["roomType"],
  beds: [number, Bed["status"], string?][]
): Room {
  const roomId = id();
  return {
    id: roomId,
    floorId,
    roomNumber,
    roomType,
    beds: beds.map(([bedNum, status, tenantKey]) =>
      bed(roomId, bedNum, status, tenantKey)
    ),
  };
}

/* ─── Floor Data ─────────────────────────────────────────── */

const PROPERTY_ID = "prop-ideal-001";

export const mockFloors: Floor[] = [
  { id: "floor-b", propertyId: PROPERTY_ID, floorNumber: 0, name: "Basement Floor" },
  { id: "floor-1", propertyId: PROPERTY_ID, floorNumber: 1, name: "First Floor" },
  { id: "floor-2", propertyId: PROPERTY_ID, floorNumber: 2, name: "Second Floor" },
];

export const mockRoomsByFloor: Record<string, Room[]> = {
  "floor-b": [
    room("floor-b", "B01", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-b", "B02", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-b", "B03", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-b", "B04", "SINGLE", [[1, "AVAILABLE"]]),
    room("floor-b", "B05", "TRIPLE", [[1, "AVAILABLE"], [2, "AVAILABLE"], [3, "AVAILABLE"]]),
  ],
  "floor-1": [
    room("floor-1", "101", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-1", "102", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-1", "103", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-1", "104", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-1", "105", "SINGLE", [[1, "AVAILABLE"]]),
  ],
  "floor-2": [
    room("floor-2", "201", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-2", "202", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-2", "203", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-2", "204", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-2", "205", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-2", "206", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-2", "207", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-2", "208", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-2", "209", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-2", "210", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
  ],
};

export const mockPaymentHistory: PaymentRecord[] = [];
