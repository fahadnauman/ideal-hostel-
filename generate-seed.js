const fs = require('fs');

const tenants = [
  { name: "HAISHAM MUHAMMED N", phone: "8089791560", parentName: "MUHAMMED N", parentPhone: "8086156030", occupation: "Teacher", courseName: "B.Tech EC", dateOfBirth: "2008-03-26", checkInDate: "2026-07-21", roomNumber: "208", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "MOHAMMED ZAYAN T", phone: "9061952940", parentName: "Shamsiya P M", parentPhone: "8606262940", occupation: "doctor", courseName: "ECE", dateOfBirth: "2008-03-08", checkInDate: "2026-07-21", roomNumber: "210", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "AMAN HANEES MOHAMMED", phone: "7558966320", parentName: "HANEES MOHAMMED", parentPhone: "9539466320", permanentAddress: "THALAKKASSERY PO, PALAKKAD", occupation: "BANK EMPLOYEE", courseName: "BTECH INDUSTRIAL ENG", dateOfBirth: "2008-04-01", checkInDate: "2026-07-20", roomNumber: "210", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "FUAD K", phone: "9562426903", parentName: "Hilaludheen K", parentPhone: "9745150224", permanentAddress: "A Mukkam", occupation: "Business", courseName: "Electrical & Electronics", dateOfBirth: "2007-07-27", checkInDate: "2026-07-23", roomNumber: "205", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "Muhammad Rayyan", phone: "6282931593", parentName: "Shafeek", parentPhone: "6282623863", permanentAddress: "Oachira PO", courseName: "EC", dateOfBirth: "2006-07-05", checkInDate: "2026-07-21", roomNumber: "205", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "ALTHAF MUHAMMAD S", phone: "9495626682", parentName: "Ansiya A", parentPhone: "9447179668", permanentAddress: "Muhsina Mahal, Kottukadu", occupation: "Homemaker", courseName: "ECE", dateOfBirth: "2006-11-14", checkInDate: "2026-07-21", roomNumber: "206", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "AMEEN IQBAL A B", phone: "9656266972", parentName: "IQBAL ALIAMBATH", parentPhone: "9349896200", permanentAddress: "MAVIKAYI 670622", courseName: "EC", dateOfBirth: "2006-11-07", checkInDate: "2026-07-21", roomNumber: "206", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "Anjoe Mejo", phone: "9995802281", parentName: "Mejo MF", parentPhone: "9995802281", occupation: "Teacher", courseName: "EL", dateOfBirth: "2008-02-13", checkInDate: "2026-07-21", roomNumber: "207", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "AASHIK MOHAMMED", phone: "8891695217", parentName: "NAVAZ PK", parentPhone: "7356995217", occupation: "Ex-Servicemen", courseName: "ECE", dateOfBirth: "2007-12-24", checkInDate: "2026-07-21", roomNumber: "207", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "Ridwan A K", phone: "8606061480", parentName: "Mohamad A K", parentPhone: "9895231212", permanentAddress: "Pulikkal, Malappuram", courseName: "ECE", dateOfBirth: "2006-11-08", checkInDate: "2026-07-24", roomNumber: "202", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "RON EMMANUEL JOSHY", phone: "9746554213", parentName: "JOSHY MANUEL", parentPhone: "9447914213", permanentAddress: "Ernakulam", occupation: "Chartered Accountant", courseName: "Mechanical Engineering", dateOfBirth: "2008-07-30", checkInDate: "2026-08-13", roomNumber: "103", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "ADAM BIN ZAMEER", phone: "8921498204", parentName: "Zameer K H", parentPhone: "8921498204", permanentAddress: "Kayamkulam", occupation: "Assistant Professor", courseName: "B.tech CE", dateOfBirth: "2007-01-29", checkInDate: "2026-07-20", roomNumber: "104", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "Ahmed Sahil S", phone: "8078148894", parentName: "Sherief Kutty M", parentPhone: "9744130746", permanentAddress: "Kollam", occupation: "Teacher", courseName: "EEE", dateOfBirth: "2007-03-16", checkInDate: "2026-07-21", roomNumber: "201", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "Shiraz Aymen MK", phone: "9118207433", parentName: "Naofal Babu MK", parentPhone: "9539696608", occupation: "SVO", courseName: "B-Tech ECE", dateOfBirth: "2007-01-25", checkInDate: "2026-07-21", roomNumber: "B01", advanceDeposit: 5000, paymentMethod: "Cash" },
  { name: "ABAD AHMED K", phone: "7012469796", parentName: "SHAMSUDHEEN K", parentPhone: "9447350680", occupation: "Private Job", courseName: "EL", dateOfBirth: "2007-11-05", checkInDate: "2026-07-21", roomNumber: "B01", advanceDeposit: 5000, paymentMethod: "Cash" },
  { name: "Sivadath P.M", phone: "7907241668", parentName: "Manoj P.V", parentPhone: "9388695067", occupation: "Temple priest", courseName: "BTECH ELECTRICAL AND ELECTRONICS", dateOfBirth: "2007-10-12", checkInDate: "2026-07-21", roomNumber: "B02", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "Adarsh K.S", phone: "7909221164", parentName: "SUDHEESH KUMAR K A", parentPhone: "8086265578", occupation: "Oil&Gas Fabrication", courseName: "ECE", dateOfBirth: "2007-07-03", checkInDate: "2026-07-21", roomNumber: "B02", advanceDeposit: 1000, paymentMethod: "UPI" },
  { name: "Fadhlu Rahman Nk", phone: "7736267850", parentName: "Hamza Nk", parentPhone: "9947635070", occupation: "Retired Teacher", courseName: "IE", dateOfBirth: "2007-03-07", checkInDate: "2026-07-20", roomNumber: "B02", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "Mohammed Rafid mp", phone: "9778259117", parentName: "Muhammed Rafeeque mp", parentPhone: "7736227585", occupation: "Gulf", courseName: "Industrial (IE)", dateOfBirth: "2007-05-11", checkInDate: "2026-07-20", roomNumber: "B03", advanceDeposit: 5000, paymentMethod: "Cash" },
  { name: "Sinan Saeed", phone: "8089433415", parentName: "Saidalavi", parentPhone: "9567703415", occupation: "Driver", courseName: "Industrial engneering", dateOfBirth: "2006-09-01", checkInDate: "2026-07-20", roomNumber: "B03", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "Ahsan Ameer C.K", phone: "8281640093", parentName: "Muhammed Ameer C.K", parentPhone: "9497647506", occupation: "Teacher", courseName: "B.Tech, Civil Engineering", dateOfBirth: "2007-04-23", checkInDate: "2026-08-10", roomNumber: "B04", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "Muhammed Ameen P", phone: "9074159429", parentName: "Abdul Jaleel P", parentPhone: "974477488", occupation: "Shop", courseName: "Electronics & Communication engineering", dateOfBirth: "2007-09-28", checkInDate: "2026-07-21", roomNumber: "101", advanceDeposit: 4000, paymentMethod: "UPI" },
  { name: "Saday Jayaraj R", phone: "9946781729", parentName: "Jayaraj K", parentPhone: "9495581191", occupation: "Govt Service", courseName: "Computer Science & Engineering", dateOfBirth: "2006-06-07", checkInDate: "2026-07-21", roomNumber: "B05", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "Muhammed Vishan", phone: "7306318623", parentName: "Sameera", parentPhone: "9562193541", occupation: "Housewife", courseName: "EEE", dateOfBirth: "2006-05-25", checkInDate: "2026-07-20", roomNumber: "101", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "Govind Siva A", phone: "7306003914", parentName: "Aneesh Kumar S", parentPhone: "9446121348", occupation: "Personal Security Officer", courseName: "B Tech - Industrial Engineering", dateOfBirth: "2007-01-04", checkInDate: "2026-08-13", roomNumber: "209", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "ESHANKRISHNAN C.M", phone: "7012792692", parentName: "MANOJ CHANDRAN", parentPhone: "9447530577", courseName: "EC", dateOfBirth: "2007-07-14", checkInDate: "2026-07-21", roomNumber: "209", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "Adeeb Abdullah Noushad TV", phone: "8593838006", parentName: "NOUSHAD TV", parentPhone: "8157854800", courseName: "ECE", dateOfBirth: "2006-09-17", checkInDate: "2026-07-21", roomNumber: "208", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "MUHAMMAD HAMDHAN", phone: "9037350284", parentName: "HAFISNLYASIN", courseName: "EEE", dateOfBirth: "2008-10-06", checkInDate: "2026-07-21", roomNumber: "203", advanceDeposit: 5000, paymentMethod: "Cash" },
  { name: "ABHINAND KRISHNA S A", phone: "9207744999", parentName: "ANAND ARAVIND", parentPhone: "9447082277", occupation: "BUSINESS", courseName: "CIVIL DEPARTMENT", dateOfBirth: "2006-06-29", checkInDate: "2026-07-16", roomNumber: "201", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "ESHAN AHMED", phone: "9544788658", parentName: "Firoz Babu", parentPhone: "9739498080", occupation: "Self Employed", courseName: "BTech, AE&I", dateOfBirth: "2008-03-31", checkInDate: "2026-07-20", roomNumber: "202", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "SREEHARI S", phone: "8921527415", parentName: "Santhosh Kumar", parentPhone: "9496328680", courseName: "EEE", dateOfBirth: "2007-06-12", checkInDate: "2026-07-20", roomNumber: "101", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "Shakir Chalilakath", phone: "9745705432", parentName: "CA SAFEEQUE", parentPhone: "9847619616", occupation: "Teacher", courseName: "ECE", dateOfBirth: "2008-03-05", checkInDate: "2026-07-22", roomNumber: "103", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "AMAN MOHAMMED KK", phone: "9961115385", parentName: "Shamsudheen kk", parentPhone: "8943988885", occupation: "Business", courseName: "Applied Electronics", dateOfBirth: "2007-04-02", checkInDate: "2026-07-21", roomNumber: "103", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "Swalah CP", phone: "9846149078", parentName: "Abdul Vahab CP", parentPhone: "8547172070", occupation: "Teacher", courseName: "BTech CSE", dateOfBirth: "2007-09-14", checkInDate: "2026-07-22", roomNumber: "104", advanceDeposit: 5000, paymentMethod: "UPI" },
  { name: "NASIH USMAN", phone: "9400758823", parentName: "USMAN KU", parentPhone: "9847190111", occupation: "Retired", courseName: "B-Tech, EEE", dateOfBirth: "2008-04-09", checkInDate: "2026-07-20", roomNumber: "104", advanceDeposit: 5000, paymentMethod: "UPI" }
];

const mockRoomsPath = 'src/data/mock-rooms.ts';
const mockRoomsCode = fs.readFileSync(mockRoomsPath, 'utf8');

const seedTenants = tenants.map((t, idx) => {
  return {
    id: "ten-" + Date.now() + "-" + idx,
    bedId: "WILL_BE_REPLACED",
    name: t.name,
    phone: t.phone,
    email: "",
    checkInDate: new Date(t.checkInDate).toISOString(),
    leaseEndDate: null,
    advanceDeposit: t.advanceDeposit,
    monthlyRent: 5000,
    rentDueDate: 1,
    paymentStatus: "PAID",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    emergencyContactName: t.parentName,
    emergencyContactPhone: t.parentPhone || "",
    roomNumber: t.roomNumber,
    paymentMethod: t.paymentMethod,
    courseName: t.courseName,
  };
});

let finalTenantsStore = fs.readFileSync('src/lib/tenants-store.ts', 'utf8');
finalTenantsStore = finalTenantsStore.replace(
  /const initialSeedTenants: Tenant\[\] = \[\];/,
  "const initialSeedTenants: Tenant[] = " + JSON.stringify(seedTenants, null, 2) + ";"
);

fs.writeFileSync('src/lib/tenants-store.ts', finalTenantsStore);

let newMockRoomsCode = mockRoomsCode;

// Simple replace logic:
seedTenants.forEach(tenant => {
  const roomIdentifier = '"' + tenant.roomNumber + '"';
  
  // We need to carefully replace the first "AVAILABLE" that comes after this roomIdentifier
  const roomIndex = newMockRoomsCode.indexOf(roomIdentifier);
  if (roomIndex !== -1) {
    const nextAvailableIndex = newMockRoomsCode.indexOf('"AVAILABLE"', roomIndex);
    if (nextAvailableIndex !== -1) {
      newMockRoomsCode = 
        newMockRoomsCode.slice(0, nextAvailableIndex) + 
        '"OCCUPIED", "' + tenant.id + '"' +
        newMockRoomsCode.slice(nextAvailableIndex + 11);
    }
  }
});

fs.writeFileSync('src/data/mock-rooms.ts', newMockRoomsCode);

console.log("Successfully seeded tenants store and mock rooms!");
