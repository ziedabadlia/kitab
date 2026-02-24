import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@kitab.edu";
  const hashedPassword = await hash("admin2026", 12);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        fullName: "System Admin",
        email: adminEmail,
        hashedPassword: hashedPassword,
        role: Role.ADMIN,
        emailVerified: new Date(),
      },
    });
    console.log(`✅ Admin user created: ${admin.email}`);
  } else {
    console.log("ℹ️ Admin user already exists.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
