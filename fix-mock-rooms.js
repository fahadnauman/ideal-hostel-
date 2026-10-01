const fs = require('fs');

let roomsStore = fs.readFileSync('src/data/mock-rooms.ts', 'utf8');

// replace empty tenants record with one that gets from initialSeedTenants
roomsStore = roomsStore.replace(
  /const tenants: Record<string, Tenant> = {};/,
  `import { getAllTenants } from "@/lib/tenants-store";
const tenants: Record<string, Tenant> = {};
const seed = getAllTenants();
seed.forEach(t => tenants[t.id] = t);`
);

fs.writeFileSync('src/data/mock-rooms.ts', roomsStore);

console.log("Fixed mock-rooms.ts to load tenants.");
