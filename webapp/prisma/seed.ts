import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create Super Admin
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@shift.com" },
    update: {},
    create: {
      email: "admin@shift.com",
      password: hashedPassword,
      name: "Super Admin",
      role: "SUPER_ADMIN",
    },
  });
  console.log("✅ Created Super Admin:", superAdmin.email);

  // Create Default Shipment Statuses
  const statuses = [
    { name: "Ordered", order: 1, isTransit: false, notifyEmail: true, color: "#FFD628" },
    { name: "In Saudi / Deba", order: 2, isTransit: true, notifyEmail: false, color: "#3B82F6" },
    { name: "Markeb to Safaga", order: 3, isTransit: true, notifyEmail: false, color: "#3B82F6" },
    { name: "Arriving Soon", order: 4, isTransit: true, notifyEmail: true, color: "#F59E0B" },
    { name: "Delivered", order: 5, isTransit: false, notifyEmail: true, color: "#10B981" },
  ];

  for (const status of statuses) {
    await prisma.shipmentStatus.upsert({
      where: { name: status.name },
      update: status,
      create: status,
    });
  }
  console.log("✅ Created default statuses");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
