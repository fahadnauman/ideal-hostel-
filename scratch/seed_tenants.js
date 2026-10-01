const fs = require('fs');
const path = require('path');

const newTenants = [
  {
    "name": "Shiraz Aymen M K",
    "phone": "9778207433",
    "roomNumber": "R01",
    "parentName": "Naafal Babu M K",
    "parentPhone": "9539696608",
    "courseName": "B-Tech ECE",
    "dateOfBirth": "2001-01-25",
    "checkInDate": "2026-07-20",
    "advanceDeposit": 5000,
    "paymentStatus": "PAID"
  },
  {
    "name": "Abad Ahmed K",
    "phone": "7012469796",
    "roomNumber": "R01",
    "parentName": "Shamsudheen K",
    "parentPhone": "9447350680",
    "courseName": "EL",
    "dateOfBirth": "2007-11-05",
    "checkInDate": "2026-07-21",
    "advanceDeposit": 5000,
    "paymentStatus": "PAID"
  },
  {
    "name": "Sivadath P M",
    "phone": "7907241668",
    "roomNumber": "R02",
    "parentName": "Manoj P V",
    "parentPhone": "9388695067",
    "courseName": "B.Tech Electrical and Electronics Engineering",
    "dateOfBirth": "2007-10-12",
    "checkInDate": "2026-07-20",
    "advanceDeposit": 5000,
    "paymentStatus": "PAID"
  },
  {
    "name": "Adarsh K S",
    "phone": "7909221164",
    "roomNumber": "R02",
    "parentName": "Sudheesh Kumar K A",
    "parentPhone": "8086265578",
    "courseName": "ECE",
    "dateOfBirth": "2007-07-03",
    "checkInDate": "2026-07-21",
    "advanceDeposit": 1000,
    "paymentStatus": "PAID"
  },
  {
    "name": "Sinan Saeed",
    "phone": "8089433415",
    "roomNumber": "R03",
    "parentName": "Saidalavi",
    "parentPhone": "9567703415",
    "courseName": "Industrial Engineering",
    "dateOfBirth": "2006-09-01",
    "checkInDate": "2026-07-20",
    "advanceDeposit": 5000,
    "paymentStatus": "PAID"
  },
  {
    "name": "Fadhlu Rahman N K",
    "phone": "7736267850",
    "roomNumber": "R03",
    "parentName": "Hamza N K",
    "parentPhone": "9947635070",
    "courseName": "IE",
    "dateOfBirth": "2007-03-07",
    "checkInDate": "2026-07-20",
    "advanceDeposit": 5000,
    "paymentStatus": "PAID"
  },
  {
    "name": "Mohammed Rafid M P",
    "phone": "9778259117",
    "roomNumber": "R03",
    "parentName": "Muhammed Rafeecque M P",
    "parentPhone": "7736227585",
    "courseName": "Industrial Engineering (IE)",
    "dateOfBirth": "2007-05-11",
    "checkInDate": "2026-07-20",
    "advanceDeposit": 5000,
    "paymentStatus": "PAID"
  },
  {
    "name": "Ahsan Ameer C K",
    "phone": "8281640093",
    "roomNumber": "R04",
    "parentName": "Muhammed Ameer C K",
    "parentPhone": "9497647506",
    "courseName": "B.Tech Civil Engineering",
    "dateOfBirth": "2007-04-23",
    "checkInDate": "2026-08-10",
    "advanceDeposit": 5000,
    "paymentStatus": "PAID"
  },
  {
    "name": "Saday Jayaraj R",
    "phone": "9946781729",
    "roomNumber": "R05",
    "parentName": "Jayaraj K",
    "parentPhone": "9495581191",
    "courseName": "Computer Science & Engineering",
    "dateOfBirth": "2006-06-07",
    "checkInDate": "2026-07-20",
    "advanceDeposit": 5000,
    "paymentStatus": "PAID"
  }
];

let tenantSeedStr = '';
let tenantStoreSeedStr = 'const initialSeedTenants: Tenant[] = [\n';

newTenants.forEach((t, index) => {
  const id = `ten-seed-${index+1}`;
  tenantSeedStr += `tenants["${id}"] = {
    id: "${id}",
    name: "${t.name}",
    phone: "${t.phone}",
    roomNumber: "${t.roomNumber}",
    parentName: "${t.parentName}",
    parentPhone: "${t.parentPhone}",
    courseName: "${t.courseName}",
    dateOfBirth: "${t.dateOfBirth}",
    checkInDate: "${t.checkInDate}",
    advanceDeposit: ${t.advanceDeposit},
    paymentStatus: "${t.paymentStatus}",
    monthlyRent: 4500, bedId: "", email: null, leaseEndDate: null, rentDueDate: 5
  };\n`;
  
  tenantStoreSeedStr += `  {
    id: "${id}",
    name: "${t.name}",
    phone: "${t.phone}",
    roomNumber: "${t.roomNumber}",
    parentName: "${t.parentName}",
    parentPhone: "${t.parentPhone}",
    courseName: "${t.courseName}",
    dateOfBirth: "${t.dateOfBirth}",
    checkInDate: "${t.checkInDate}",
    advanceDeposit: ${t.advanceDeposit},
    paymentStatus: "${t.paymentStatus}",
    monthlyRent: 4500, bedId: "", email: null, leaseEndDate: null, rentDueDate: 5
  },\n`;
});

tenantStoreSeedStr += '];';

// 1. UPDATE mock-rooms.ts
let mockRooms = fs.readFileSync('src/data/mock-rooms.ts', 'utf8');

// Insert tenants seed
mockRooms = mockRooms.replace(/const tenants: Record<string, Tenant> = \{\};/, `const tenants: Record<string, Tenant> = {};\n${tenantSeedStr}`);

// Update R01
mockRooms = mockRooms.replace(
  /room\("floor-b", "R01", "DOUBLE", \[\[1, "AVAILABLE"\], \[2, "AVAILABLE"\]\]\),/,
  `room("floor-b", "R01", "DOUBLE", [[1, "OCCUPIED", "ten-seed-1"], [2, "OCCUPIED", "ten-seed-2"]]),`
);
// Update R02
mockRooms = mockRooms.replace(
  /room\("floor-b", "R02", "DOUBLE", \[\[1, "AVAILABLE"\], \[2, "AVAILABLE"\]\]\),/,
  `room("floor-b", "R02", "DOUBLE", [[1, "OCCUPIED", "ten-seed-3"], [2, "OCCUPIED", "ten-seed-4"]]),`
);
// Update R03 (Change to TRIPLE)
mockRooms = mockRooms.replace(
  /room\("floor-b", "R03", "DOUBLE", \[\[1, "AVAILABLE"\], \[2, "AVAILABLE"\]\]\),/,
  `room("floor-b", "R03", "TRIPLE", [[1, "OCCUPIED", "ten-seed-5"], [2, "OCCUPIED", "ten-seed-6"], [3, "OCCUPIED", "ten-seed-7"]]),`
);
// Update R04
mockRooms = mockRooms.replace(
  /room\("floor-b", "R04", "SINGLE", \[\[1, "AVAILABLE"\]\]\),/,
  `room("floor-b", "R04", "SINGLE", [[1, "OCCUPIED", "ten-seed-8"]]),`
);
// Update R05
mockRooms = mockRooms.replace(
  /room\("floor-b", "R05", "TRIPLE", \[\[1, "AVAILABLE"\], \[2, "AVAILABLE"\], \[3, "AVAILABLE"\]\]\),/,
  `room("floor-b", "R05", "TRIPLE", [[1, "OCCUPIED", "ten-seed-9"], [2, "AVAILABLE"], [3, "AVAILABLE"]]),`
);

fs.writeFileSync('src/data/mock-rooms.ts', mockRooms);

// 2. UPDATE tenants-store.ts
let tenantStore = fs.readFileSync('src/lib/tenants-store.ts', 'utf8');
tenantStore = tenantStore.replace(/const initialSeedTenants: Tenant\[\] = \[\];/, tenantStoreSeedStr);
fs.writeFileSync('src/lib/tenants-store.ts', tenantStore);
