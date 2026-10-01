const fs = require('fs');

let store = fs.readFileSync('src/lib/tenants-store.ts', 'utf8');

// Remove createdAt and updatedAt from the seed objects
store = store.replace(/,\s*"createdAt":\s*"[^"]+"/g, '');
store = store.replace(/,\s*"updatedAt":\s*"[^"]+"/g, '');

// Fix "Cash" to "CASH"
store = store.replace(/"paymentMethod":\s*"Cash"/g, '"paymentMethod": "CASH"');

fs.writeFileSync('src/lib/tenants-store.ts', store);

console.log("Fixed tenants-store.ts types.");
