const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL || "postgresql://USER:PASSWORD@localhost:5432/pghq_standard?schema=public" });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Properties:', await prisma.property.count());
  console.log('Floors:', await prisma.floor.count());
  
  // Try to create a task for R01
  try {
    const room = await prisma.room.findFirst({
        where: { roomNumber: { equals: "R01", mode: "insensitive" } }
    });
    console.log("Found room:", room);
    
    if (!room) {
        let floor = await prisma.floor.findFirst();
        console.log("Found floor:", floor);
        if (!floor) {
          const property = await prisma.property.findFirst();
          console.log("Found property:", property);
          if (property) {
             floor = await prisma.floor.create({ data: { propertyId: property.id, floorNumber: 1, name: "Ground Floor" } });
          }
        }
        if (floor) {
          const newRoom = await prisma.room.create({ data: { floorId: floor.id, roomNumber: "R01" } });
          console.log("Created room:", newRoom);
        } else {
          console.log("Error: System has no property/floor setup.");
        }
    }
  } catch (e) {
    console.error("Error testing room creation:", e.message);
  }
}

main().finally(() => prisma.$disconnect());
