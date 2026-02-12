import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Use a fixed ID if you want to keep it consistent across resets
const ADMIN_ID = "00000000-0000-0000-0000-000000000001";

async function main() {
  console.log("🚀 Starting seed process...");

  const adminEmail = "admin@kitab.com";
  const hashedPassword = await bcrypt.hash("Admin123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      id: ADMIN_ID,
      fullName: "System Admin",
      email: adminEmail,
      hashedPassword: hashedPassword,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });

  console.log(`✅ Admin user created/verified: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
