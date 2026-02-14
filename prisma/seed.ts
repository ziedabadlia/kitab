import { PrismaClient, UserStatus } from "@prisma/client";
import bcrypt, { hash } from "bcryptjs"; // If you're using bcrypt, otherwise use a dummy string

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding 30 users...");

  // Optional: Clean up existing data to start fresh
  await prisma.borrowing.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();

  const password = await hash("password123", 10);

  const firstNames = [
    "James",
    "Mary",
    "Robert",
    "Patricia",
    "John",
    "Jennifer",
    "Michael",
    "Linda",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
  ];

  for (let i = 1; i <= 30; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const fullName = `${firstName} ${lastName} ${i}`; // Added index to make names unique
    const email = `student${i}@university.edu`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const studentId = (24000 + i).toString();

    await prisma.user.create({
      data: {
        fullName,
        email,
        hashedPassword,
        role: "STUDENT",
        // Every 3rd user gets a random profile picture from Unsplash for testing
        profilePictureUrl:
          i % 3 === 0 ? `https://i.pravatar.cc/150?u=${email}` : null,
        student: {
          create: {
            studentIdNumber: studentId,
            universityIdCardUrl: `https://placehold.co/600x400/253585/white?text=ID+Card+${studentId}`,
            status: UserStatus.ACCEPTED,
            universityName: "University III",
          },
        },
      },
    });
  }

  console.log("✅ Seeded 30 users successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
