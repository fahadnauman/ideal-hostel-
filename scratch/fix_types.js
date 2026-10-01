const fs = require('fs');

let code = fs.readFileSync('scratch/seed_tenants.js', 'utf8');
code = code.replace(/monthlyRent: 4500/g, 'monthlyRent: 4500, bedId: "", email: null, leaseEndDate: null, rentDueDate: 5');
fs.writeFileSync('scratch/seed_tenants.js', code);
