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
tenants["ten-seed-1"] = {
    id: "ten-seed-1",
    name: "Shiraz Aymen M K",
    phone: "9778207433",
    roomNumber: "R01",
    parentName: "Naafal Babu M K",
    parentPhone: "9539696608",
    courseName: "B-Tech ECE",
    dateOfBirth: "2001-01-25",
    checkInDate: "2026-07-20",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500, bedId: "", email: null, leaseEndDate: null, rentDueDate: 5
  };
tenants["ten-seed-2"] = {
    id: "ten-seed-2",
    name: "Abad Ahmed K",
    phone: "7012469796",
    roomNumber: "R01",
    parentName: "Shamsudheen K",
    parentPhone: "9447350680",
    courseName: "EL",
    dateOfBirth: "2007-11-05",
    checkInDate: "2026-07-21",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500, bedId: "", email: null, leaseEndDate: null, rentDueDate: 5
  };
tenants["ten-seed-3"] = {
    id: "ten-seed-3",
    name: "Sivadath P M",
    phone: "7907241668",
    roomNumber: "R02",
    parentName: "Manoj P V",
    parentPhone: "9388695067",
    courseName: "B.Tech Electrical and Electronics Engineering",
    dateOfBirth: "2007-10-12",
    checkInDate: "2026-07-20",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500, bedId: "", email: null, leaseEndDate: null, rentDueDate: 5
  };
tenants["ten-seed-4"] = {
    id: "ten-seed-4",
    name: "Adarsh K S",
    phone: "7909221164",
    roomNumber: "R02",
    parentName: "Sudheesh Kumar K A",
    parentPhone: "8086265578",
    courseName: "ECE",
    dateOfBirth: "2007-07-03",
    checkInDate: "2026-07-21",
    advanceDeposit: 1000,
    paymentStatus: "PAID",
    monthlyRent: 4500, bedId: "", email: null, leaseEndDate: null, rentDueDate: 5
  };
tenants["ten-seed-5"] = {
    id: "ten-seed-5",
    name: "Sinan Saeed",
    phone: "8089433415",
    roomNumber: "R03",
    parentName: "Saidalavi",
    parentPhone: "9567703415",
    courseName: "Industrial Engineering",
    dateOfBirth: "2006-09-01",
    checkInDate: "2026-07-20",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500, bedId: "", email: null, leaseEndDate: null, rentDueDate: 5
  };
tenants["ten-seed-6"] = {
    id: "ten-seed-6",
    name: "Fadhlu Rahman N K",
    phone: "7736267850",
    roomNumber: "R03",
    parentName: "Hamza N K",
    parentPhone: "9947635070",
    courseName: "IE",
    dateOfBirth: "2007-03-07",
    checkInDate: "2026-07-20",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500, bedId: "", email: null, leaseEndDate: null, rentDueDate: 5
  };
tenants["ten-seed-7"] = {
    id: "ten-seed-7",
    name: "Mohammed Rafid M P",
    phone: "9778259117",
    roomNumber: "R03",
    parentName: "Muhammed Rafeecque M P",
    parentPhone: "7736227585",
    courseName: "Industrial Engineering (IE)",
    dateOfBirth: "2007-05-11",
    checkInDate: "2026-07-20",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500, bedId: "", email: null, leaseEndDate: null, rentDueDate: 5
  };
tenants["ten-seed-8"] = {
    id: "ten-seed-8",
    name: "Ahsan Ameer C K",
    phone: "8281640093",
    roomNumber: "R04",
    parentName: "Muhammed Ameer C K",
    parentPhone: "9497647506",
    courseName: "B.Tech Civil Engineering",
    dateOfBirth: "2007-04-23",
    checkInDate: "2026-08-10",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500, bedId: "", email: null, leaseEndDate: null, rentDueDate: 5
  };
tenants["ten-seed-9"] = {
    id: "ten-seed-9",
    name: "Saday Jayaraj R",
    phone: "9946781729",
    roomNumber: "R05",
    parentName: "Jayaraj K",
    parentPhone: "9495581191",
    courseName: "Computer Science & Engineering",
    dateOfBirth: "2006-06-07",
    checkInDate: "2026-07-20",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500, bedId: "", email: null, leaseEndDate: null, rentDueDate: 5
  };

tenants["ten-seed-1"] = {
    id: "ten-seed-1",
    name: "Shiraz Aymen M K",
    phone: "9778207433",
    roomNumber: "R01",
    parentName: "Naafal Babu M K",
    parentPhone: "9539696608",
    courseName: "B-Tech ECE",
    dateOfBirth: "2001-01-25",
    checkInDate: "2026-07-20",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500,
    bedId: "",
    email: null,
    leaseEndDate: null,
    rentDueDate: 5
  };
tenants["ten-seed-2"] = {
    id: "ten-seed-2",
    name: "Abad Ahmed K",
    phone: "7012469796",
    roomNumber: "R01",
    parentName: "Shamsudheen K",
    parentPhone: "9447350680",
    courseName: "EL",
    dateOfBirth: "2007-11-05",
    checkInDate: "2026-07-21",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500,
    bedId: "",
    email: null,
    leaseEndDate: null,
    rentDueDate: 5
  };
tenants["ten-seed-3"] = {
    id: "ten-seed-3",
    name: "Sivadath P M",
    phone: "7907241668",
    roomNumber: "R02",
    parentName: "Manoj P V",
    parentPhone: "9388695067",
    courseName: "B.Tech Electrical and Electronics Engineering",
    dateOfBirth: "2007-10-12",
    checkInDate: "2026-07-20",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500,
    bedId: "",
    email: null,
    leaseEndDate: null,
    rentDueDate: 5
  };
tenants["ten-seed-4"] = {
    id: "ten-seed-4",
    name: "Adarsh K S",
    phone: "7909221164",
    roomNumber: "R02",
    parentName: "Sudheesh Kumar K A",
    parentPhone: "8086265578",
    courseName: "ECE",
    dateOfBirth: "2007-07-03",
    checkInDate: "2026-07-21",
    advanceDeposit: 1000,
    paymentStatus: "PAID",
    monthlyRent: 4500,
    bedId: "",
    email: null,
    leaseEndDate: null,
    rentDueDate: 5
  };
tenants["ten-seed-5"] = {
    id: "ten-seed-5",
    name: "Sinan Saeed",
    phone: "8089433415",
    roomNumber: "R03",
    parentName: "Saidalavi",
    parentPhone: "9567703415",
    courseName: "Industrial Engineering",
    dateOfBirth: "2006-09-01",
    checkInDate: "2026-07-20",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500,
    bedId: "",
    email: null,
    leaseEndDate: null,
    rentDueDate: 5
  };
tenants["ten-seed-6"] = {
    id: "ten-seed-6",
    name: "Fadhlu Rahman N K",
    phone: "7736267850",
    roomNumber: "R03",
    parentName: "Hamza N K",
    parentPhone: "9947635070",
    courseName: "IE",
    dateOfBirth: "2007-03-07",
    checkInDate: "2026-07-20",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500,
    bedId: "",
    email: null,
    leaseEndDate: null,
    rentDueDate: 5
  };
tenants["ten-seed-7"] = {
    id: "ten-seed-7",
    name: "Mohammed Rafid M P",
    phone: "9778259117",
    roomNumber: "R03",
    parentName: "Muhammed Rafeecque M P",
    parentPhone: "7736227585",
    courseName: "Industrial Engineering (IE)",
    dateOfBirth: "2007-05-11",
    checkInDate: "2026-07-20",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500,
    bedId: "",
    email: null,
    leaseEndDate: null,
    rentDueDate: 5
  };
tenants["ten-seed-8"] = {
    id: "ten-seed-8",
    name: "Ahsan Ameer C K",
    phone: "8281640093",
    roomNumber: "R04",
    parentName: "Muhammed Ameer C K",
    parentPhone: "9497647506",
    courseName: "B.Tech Civil Engineering",
    dateOfBirth: "2007-04-23",
    checkInDate: "2026-08-10",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500,
    bedId: "",
    email: null,
    leaseEndDate: null,
    rentDueDate: 5
  };
tenants["ten-seed-9"] = {
    id: "ten-seed-9",
    name: "Saday Jayaraj R",
    phone: "9946781729",
    roomNumber: "R05",
    parentName: "Jayaraj K",
    parentPhone: "9495581191",
    courseName: "Computer Science & Engineering",
    dateOfBirth: "2006-06-07",
    checkInDate: "2026-07-20",
    advanceDeposit: 5000,
    paymentStatus: "PAID",
    monthlyRent: 4500,
    bedId: "",
    email: null,
    leaseEndDate: null,
    rentDueDate: 5
  };


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

declare global {
  var __pghq_rooms: Record<string, Room[]> | undefined;
}

if (!globalThis.__pghq_rooms) {
  globalThis.__pghq_rooms = {
  "floor-b": [
    room("floor-b", "R01", "DOUBLE", [[1, "OCCUPIED", "ten-seed-1"], [2, "OCCUPIED", "ten-seed-2"]]),
    room("floor-b", "R02", "DOUBLE", [[1, "OCCUPIED", "ten-seed-3"], [2, "OCCUPIED", "ten-seed-4"]]),
    room("floor-b", "R03", "TRIPLE", [[1, "OCCUPIED", "ten-seed-5"], [2, "OCCUPIED", "ten-seed-6"], [3, "OCCUPIED", "ten-seed-7"]]),
    room("floor-b", "R04", "SINGLE", [[1, "OCCUPIED", "ten-seed-8"]]),
    room("floor-b", "R05", "TRIPLE", [[1, "OCCUPIED", "ten-seed-9"], [2, "AVAILABLE"], [3, "AVAILABLE"]]),
  ],
  "floor-1": [
    room("floor-1", "R06", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-1", "R07", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-1", "R08", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-1", "R09", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-1", "R10", "SINGLE", [[1, "AVAILABLE"]]),
  ],
  "floor-2": [
    room("floor-2", "R11", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-2", "R12", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-2", "R13", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-2", "R14", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-2", "R15", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-2", "R16", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-2", "R17", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-2", "R18", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-2", "R19", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
    room("floor-2", "R20", "DOUBLE", [[1, "AVAILABLE"], [2, "AVAILABLE"]]),
  ],
  };
}

export const mockRoomsByFloor = globalThis.__pghq_rooms;

export const mockPaymentHistory: PaymentRecord[] = [];
