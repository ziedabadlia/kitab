// prisma/seed.ts
// Run with: npx prisma db push --force-reset && npx tsx prisma/seed.ts

import { db } from "@/lib/db";

async function main() {
  console.log("📌 Adding borrowing record...");

  const borrowing = await db.borrowing.create({
    data: {
      studentId: "f39fe05f-002e-4b08-901e-e62a3b2621c9",
      bookId: "0622fd31-c392-4e71-9c53-2d6b2d4b5d8c",
      status: "PENDING",
    },
  });

  console.log("✅ Done:", borrowing.id);
}

main()
  .catch((e) => {
    console.error("❌ Failed:", e.message);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
console.log("─────────────────────────────────────────");

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
