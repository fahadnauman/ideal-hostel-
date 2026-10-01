const fs = require('fs');

function fixFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  code = code.replace(/monthlyRent: 4500\n/g, 'monthlyRent: 4500,\n    bedId: "",\n    email: null,\n    leaseEndDate: null,\n    rentDueDate: 5\n');
  code = code.replace(/monthlyRent: 4500\r\n/g, 'monthlyRent: 4500,\r\n    bedId: "",\r\n    email: null,\r\n    leaseEndDate: null,\r\n    rentDueDate: 5\r\n');
  fs.writeFileSync(filePath, code);
}

fixFile('src/data/mock-rooms.ts');
fixFile('src/lib/tenants-store.ts');
