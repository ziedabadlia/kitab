// prisma/seed.ts
// Run with: npx prisma db push --force-reset && npx tsx prisma/seed.ts

import {
  PrismaClient,
  BorrowingStatus,
  UserStatus,
  Role,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

// ── Helpers ───────────────────────────────────────────────────────────────────

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

const randomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// ── Seed Data ─────────────────────────────────────────────────────────────────

const DEPARTMENTS = [
  {
    name: "Computer Science",
    slug: "computer-science",
    description: "Programming, algorithms, AI and software engineering",
  },
  {
    name: "Literature",
    slug: "literature",
    description: "Classic and contemporary literary works",
  },
  {
    name: "History",
    slug: "history",
    description: "World history and historical analysis",
  },
  {
    name: "Philosophy",
    slug: "philosophy",
    description: "Ethics, metaphysics and critical thinking",
  },
  {
    name: "Science",
    slug: "science",
    description: "Natural sciences, physics, chemistry and biology",
  },
  {
    name: "Business",
    slug: "business",
    description: "Economics, management and entrepreneurship",
  },
  {
    name: "Psychology",
    slug: "psychology",
    description: "Human behavior, cognitive science and mental health",
  },
  {
    name: "Mathematics",
    slug: "mathematics",
    description: "Pure and applied mathematics",
  },
];

const CATEGORIES = [
  { name: "Fiction", slug: "fiction" },
  { name: "Non-Fiction", slug: "non-fiction" },
  { name: "Science Fiction", slug: "science-fiction" },
  { name: "Fantasy", slug: "fantasy" },
  { name: "Biography", slug: "biography" },
  { name: "Self-Help", slug: "self-help" },
  { name: "Technology", slug: "technology" },
  { name: "History", slug: "history" },
  { name: "Philosophy", slug: "philosophy" },
  { name: "Psychology", slug: "psychology" },
  { name: "Business", slug: "business" },
  { name: "Classic", slug: "classic" },
  { name: "Thriller", slug: "thriller" },
  { name: "Mystery", slug: "mystery" },
  { name: "Romance", slug: "romance" },
  { name: "Mathematics", slug: "mathematics" },
];

// Real book covers from Open Library covers API
const BOOKS = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description:
      "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times noted gin was the national drink and sex the national obsession.",
    coverImageUrl: "https://covers.openlibrary.org/b/id/8432847-L.jpg",
    coverColor: "#1a3a5c",
    department: "Literature",
    categories: ["Fiction", "Classic"],
    totalCopies: 5,
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description:
      "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. Told through the eyes of Scout Finch, you learn about her father Atticus Finch, an attorney who hopelessly strives to prove the innocence of a Black man unjustly accused of a terrible crime.",
    coverImageUrl: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
    coverColor: "#2c1810",
    department: "Literature",
    categories: ["Fiction", "Classic"],
    totalCopies: 4,
  },
  {
    title: "1984",
    author: "George Orwell",
    description:
      "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real.",
    coverImageUrl: "https://covers.openlibrary.org/b/id/8575708-L.jpg",
    coverColor: "#8b0000",
    department: "Literature",
    categories: ["Fiction", "Science Fiction", "Classic"],
    totalCopies: 6,
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    description:
      "Aldous Huxley's profoundly important classic of world literature, in which a vast World State controls the population through a scientifically engineered caste system.",
    coverImageUrl: "https://covers.openlibrary.org/b/id/9276431-L.jpg",
    coverColor: "#1c3d2e",
    department: "Literature",
    categories: ["Fiction", "Science Fiction"],
    totalCopies: 3,
  },
  {
    title: "The Hitchhiker's Guide to the Galaxy",
    author: "Douglas Adams",
    description:
      "Seconds before the Earth is demolished for a galactic freeway, Arthur Dent is plucked off the planet by his friend Ford Prefect, a researcher for the revised edition of The Hitchhiker's Guide to the Galaxy.",
    coverImageUrl: "https://covers.openlibrary.org/b/id/8739161-L.jpg",
    coverColor: "#003366",
    department: "Literature",
    categories: ["Fiction", "Science Fiction"],
    totalCopies: 4,
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    description:
      "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.",
    coverImageUrl: "https://covers.openlibrary.org/b/id/8621222-L.jpg",
    coverColor: "#1a1a2e",
    department: "Computer Science",
    categories: ["Technology", "Non-Fiction"],
    totalCopies: 5,
  },
  {
    title: "The Pragmatic Programmer",
    author: "David Thomas & Andrew Hunt",
    description:
      "Straight from the programming trenches, The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process.",
    coverImageUrl: "https://covers.openlibrary.org/b/id/9251906-L.jpg",
    coverColor: "#2d1b69",
    department: "Computer Science",
    categories: ["Technology", "Non-Fiction"],
    totalCopies: 4,
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    description:
      "One hundred thousand years ago, at least six human species inhabited the earth. Today there is just one. Us. How did our species succeed in the battle for dominance?",
    coverImageUrl: "https://covers.openlibrary.org/b/id/8739932-L.jpg",
    coverColor: "#c8860a",
    department: "History",
    categories: ["History", "Non-Fiction"],
    totalCopies: 6,
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    description:
      "In the highly anticipated Thinking, Fast and Slow, Kahneman takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think.",
    coverImageUrl: "https://covers.openlibrary.org/b/id/8742350-L.jpg",
    coverColor: "#1a237e",
    department: "Psychology",
    categories: ["Psychology", "Non-Fiction"],
    totalCopies: 4,
  },
  {
    title: "The Art of War",
    author: "Sun Tzu",
    description:
      "The Art of War is an ancient Chinese military treatise dating from the Late Spring and Autumn Period. The work, which is attributed to the ancient Chinese military strategist Sun Tzu.",
    coverImageUrl: "https://covers.openlibrary.org/b/id/8432598-L.jpg",
    coverColor: "#8b2500",
    department: "History",
    categories: ["History", "Philosophy", "Non-Fiction"],
    totalCopies: 3,
  },
  {
    title: "Zero to One",
    author: "Peter Thiel",
    description:
      "The great secret of our time is that there are still uncharted frontiers to explore and new inventions to create. In Zero to One, legendary entrepreneur and investor Peter Thiel shows how we can find singular ways to create those new things.",
    coverImageUrl: "https://covers.openlibrary.org/b/id/8753851-L.jpg",
    coverColor: "#000000",
    department: "Business",
    categories: ["Business", "Non-Fiction"],
    totalCopies: 5,
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    description:
      "No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits.",
    coverImageUrl: "https://covers.openlibrary.org/b/id/10527843-L.jpg",
    coverColor: "#1a1a1a",
    department: "Psychology",
    categories: ["Self-Help", "Psychology", "Non-Fiction"],
    totalCopies: 7,
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    description:
      "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. His quest will lead him to riches far different and far more satisfying than he ever imagined.",
    coverImageUrl: "https://covers.openlibrary.org/b/id/8228694-L.jpg",
    coverColor: "#d4af37",
    department: "Literature",
    categories: ["Fiction", "Philosophy"],
    totalCopies: 5,
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    description:
      "Was there a beginning of time? Could time run backwards? Is the universe infinite or does it have boundaries? These are just some of the questions considered in an internationally acclaimed masterpiece by one of the world's greatest thinkers.",
    coverImageUrl: "https://covers.openlibrary.org/b/id/8432603-L.jpg",
    coverColor: "#000033",
    department: "Science",
    categories: ["Science Fiction", "Non-Fiction"],
    totalCopies: 3,
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    description:
      "Doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people.",
    coverImageUrl: "https://covers.openlibrary.org/b/id/10527844-L.jpg",
    coverColor: "#2c3e50",
    department: "Business",
    categories: ["Business", "Psychology", "Non-Fiction"],
    totalCopies: 5,
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    description:
      "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the spice melange.",
    coverImageUrl: "https://covers.openlibrary.org/b/id/8739161-L.jpg",
    coverColor: "#c8860a",
    department: "Literature",
    categories: ["Fiction", "Science Fiction", "Fantasy"],
    totalCopies: 4,
  },
  {
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    description:
      "Some books on algorithms are rigorous but incomplete; others cover masses of material but lack rigor. Introduction to Algorithms uniquely combines rigor and comprehensiveness.",
    coverImageUrl: "https://covers.openlibrary.org/b/id/8739162-L.jpg",
    coverColor: "#1a1a2e",
    department: "Computer Science",
    categories: ["Technology", "Mathematics", "Non-Fiction"],
    totalCopies: 6,
  },
  {
    title: "Man's Search for Meaning",
    author: "Viktor E. Frankl",
    description:
      "A prominent Viennese psychiatrist before the war, Viktor Frankl was uniquely able to observe the way that both he and others in Auschwitz coped with the experience.",
    coverImageUrl: "https://covers.openlibrary.org/b/id/8432601-L.jpg",
    coverColor: "#3d3d3d",
    department: "Philosophy",
    categories: ["Philosophy", "Biography", "Non-Fiction"],
    totalCopies: 4,
  },
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    description:
      "Most startups fail. But many of those failures are preventable. The Lean Startup is a new approach being adopted across the globe, changing the way companies are built and new products are launched.",
    coverImageUrl: "https://covers.openlibrary.org/b/id/8753850-L.jpg",
    coverColor: "#cc0000",
    department: "Business",
    categories: ["Business", "Non-Fiction"],
    totalCopies: 4,
  },
  {
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    description:
      "Raskolnikov, a destitute and desperate former student, wanders through the slums of St Petersburg and commits a random murder without remorse or regret. He imagines himself to be a great man, a Napoleon.",
    coverImageUrl: "https://covers.openlibrary.org/b/id/8228696-L.jpg",
    coverColor: "#4a0000",
    department: "Literature",
    categories: ["Fiction", "Classic", "Mystery"],
    totalCopies: 3,
  },
];

const STUDENTS = [
  {
    fullName: "Marc Atenson",
    email: "marcatenson@gmail.com",
    studentIdNumber: "STU-2024-001",
    university: "MIT",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marc",
  },
  {
    fullName: "Susan Drake",
    email: "contact@susandrake.com",
    studentIdNumber: "STU-2024-002",
    university: "Stanford University",
    avatar: null,
  },
  {
    fullName: "Ronald Richards",
    email: "ronaldrichard@gmail.com",
    studentIdNumber: "STU-2024-003",
    university: "Harvard University",
    avatar: null,
  },
  {
    fullName: "Jane Cooper",
    email: "janecooper@proton.me",
    studentIdNumber: "STU-2024-004",
    university: "Yale University",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  },
  {
    fullName: "Ian Warren",
    email: "wadewarren@mail.co",
    studentIdNumber: "STU-2024-005",
    university: "Oxford University",
    avatar: null,
  },
  {
    fullName: "Darrell Steward",
    email: "darrellsteward@gmail.com",
    studentIdNumber: "STU-2024-006",
    university: "Cambridge University",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Darrell",
  },
  {
    fullName: "Esther Howard",
    email: "estherhoward@outlook.com",
    studentIdNumber: "STU-2024-007",
    university: "Columbia University",
    avatar: null,
  },
  {
    fullName: "Cameron Williamson",
    email: "cameron.w@university.edu",
    studentIdNumber: "STU-2024-008",
    university: "Princeton University",
    avatar: null,
  },
  {
    fullName: "Brooklyn Simmons",
    email: "brooklyn.s@gmail.com",
    studentIdNumber: "STU-2024-009",
    university: "Duke University",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Brooklyn",
  },
  {
    fullName: "Leslie Alexander",
    email: "leslie.alexander@mail.com",
    studentIdNumber: "STU-2024-010",
    university: "UCLA",
    avatar: null,
  },
  {
    fullName: "Darlene Robertson",
    email: "darlene.r@hotmail.com",
    studentIdNumber: "STU-2024-011",
    university: "University of Chicago",
    avatar: null,
  },
  {
    fullName: "Guy Hawkins",
    email: "guy.hawkins@gmail.com",
    studentIdNumber: "STU-2024-012",
    university: "Northwestern University",
    avatar: null,
  },
  {
    fullName: "Kristin Watson",
    email: "kristin.watson@yahoo.com",
    studentIdNumber: "STU-2024-013",
    university: "Johns Hopkins",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kristin",
  },
  {
    fullName: "Jacob Jones",
    email: "jacob.jones@proton.me",
    studentIdNumber: "STU-2024-014",
    university: "Caltech",
    avatar: null,
  },
  {
    fullName: "Kathryn Murphy",
    email: "kathryn.m@university.edu",
    studentIdNumber: "STU-2024-015",
    university: "Cornell University",
    avatar: null,
  },
  {
    fullName: "Theresa Webb",
    email: "theresa.webb@gmail.com",
    studentIdNumber: "STU-2024-016",
    university: "Brown University",
    avatar: null,
  },
  {
    fullName: "Albert Flores",
    email: "albert.flores@outlook.com",
    studentIdNumber: "STU-2024-017",
    university: "Dartmouth College",
    avatar: null,
  },
  {
    fullName: "Annette Black",
    email: "annette.black@mail.com",
    studentIdNumber: "STU-2024-018",
    university: "Vanderbilt University",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Annette",
  },
  {
    fullName: "Wade Warren",
    email: "wade.warren@gmail.com",
    studentIdNumber: "STU-2024-019",
    university: "Emory University",
    avatar: null,
  },
  {
    fullName: "Cody Fisher",
    email: "cody.fisher@university.edu",
    studentIdNumber: "STU-2024-020",
    university: "Georgetown University",
    avatar: null,
  },
  {
    fullName: "Savannah Nguyen",
    email: "savannah.n@hotmail.com",
    studentIdNumber: "STU-2024-021",
    university: "Tufts University",
    avatar: null,
  },
  {
    fullName: "Eleanor Pena",
    email: "eleanor.pena@gmail.com",
    studentIdNumber: "STU-2024-022",
    university: "Boston University",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eleanor",
  },
  {
    fullName: "Floyd Miles",
    email: "floyd.miles@mail.co",
    studentIdNumber: "STU-2024-023",
    university: "NYU",
    avatar: null,
  },
  {
    fullName: "Dianne Russell",
    email: "dianne.russell@gmail.com",
    studentIdNumber: "STU-2024-024",
    university: "USC",
    avatar: null,
  },
  {
    fullName: "Jerome Bell",
    email: "jerome.bell@proton.me",
    studentIdNumber: "STU-2024-025",
    university: "University of Michigan",
    avatar: null,
  },
];

// ── Main seed ─────────────────────────────────────────────────────────────────

async function main() {
  console.log("🗑️  Clearing database...");
  await db.review.deleteMany();
  await db.borrowing.deleteMany();
  await db.bookCategory.deleteMany();
  await db.book.deleteMany();
  await db.category.deleteMany();
  await db.department.deleteMany();
  await db.notification.deleteMany();
  await db.student.deleteMany();
  await db.twoFactorConfirmation.deleteMany();
  await db.account.deleteMany();
  await db.user.deleteMany();
  console.log("✅ Database cleared\n");

  // ── Departments ─────────────────────────────────────────────────────────────
  console.log("📚 Seeding departments...");
  const deptMap: Record<string, string> = {};
  for (const dept of DEPARTMENTS) {
    const d = await db.department.create({ data: dept });
    deptMap[dept.name] = d.id;
  }
  console.log(`   ✓ ${DEPARTMENTS.length} departments\n`);

  // ── Categories ──────────────────────────────────────────────────────────────
  console.log("🏷️  Seeding categories...");
  const catMap: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    const c = await db.category.create({ data: cat });
    catMap[cat.name] = c.id;
  }
  console.log(`   ✓ ${CATEGORIES.length} categories\n`);

  // ── Books ───────────────────────────────────────────────────────────────────
  console.log("📖 Seeding books...");
  const bookIds: string[] = [];
  for (let i = 0; i < BOOKS.length; i++) {
    const b = BOOKS[i];
    const suffix = Math.random().toString(36).substring(2, 8);
    const book = await db.book.create({
      data: {
        title: b.title,
        author: b.author,
        description: b.description,
        coverImageUrl: b.coverImageUrl,
        coverColor: b.coverColor,
        slug: `${slugify(b.title)}-${suffix}`,
        totalCopies: b.totalCopies,
        availableCopies: b.totalCopies,
        departmentId: deptMap[b.department],
        // Spread createdAt over past 90 days for realistic dashboard data
        createdAt: randomDate(daysAgo(90), new Date()),
        categories: {
          create: b.categories
            .filter((catName) => catMap[catName] !== undefined)
            .map((catName) => ({
              category: { connect: { id: catMap[catName] } },
            })),
        },
      },
    });
    bookIds.push(book.id);
  }
  console.log(`   ✓ ${BOOKS.length} books\n`);

  // ── Admin user ──────────────────────────────────────────────────────────────
  console.log("👑 Seeding admin user...");
  const hashedPassword = await bcrypt.hash("Admin@12345", 12);
  await db.user.create({
    data: {
      fullName: "Admin User",
      email: "admin@kitab.com",
      hashedPassword,
      role: Role.ADMIN,
      profilePictureUrl:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    },
  });
  console.log("   ✓ admin@kitab.com / Admin@12345\n");

  // ── Students ─────────────────────────────────────────────────────────────────
  console.log("🎓 Seeding students...");
  const studentIds: string[] = [];
  for (const s of STUDENTS) {
    const pw = await bcrypt.hash("Student@12345", 12);
    const user = await db.user.create({
      data: {
        fullName: s.fullName,
        email: s.email,
        hashedPassword: pw,
        role: Role.STUDENT,
        profilePictureUrl: s.avatar,
        // Spread user creation over past 60 days
        createdAt: randomDate(daysAgo(60), new Date()),
        student: {
          create: {
            studentIdNumber: s.studentIdNumber,
            universityName: s.university,
            universityIdCardUrl: `https://placehold.co/600x400/1a3a5c/white?text=${encodeURIComponent(s.studentIdNumber)}`,
            status: UserStatus.SUSPENDED,
            createdAt: randomDate(daysAgo(60), new Date()),
          },
        },
      },
      include: { student: true },
    });
    if (user.student) studentIds.push(user.student.id);
  }
  console.log(
    `   ✓ ${STUDENTS.length} students (all SUSPENDED/pending approval)\n`,
  );

  // ── Borrowings ───────────────────────────────────────────────────────────────
  console.log("📋 Seeding borrowings...");

  const borrowStatuses: { status: BorrowingStatus; weight: number }[] = [
    { status: "PENDING", weight: 8 },
    { status: "ACCEPTED", weight: 5 },
    { status: "BORROWED", weight: 10 },
    { status: "RETURNED", weight: 8 },
    { status: "REJECTED", weight: 3 },
    { status: "OVERDUE", weight: 4 },
    { status: "CANCELLED", weight: 2 },
  ];

  const weightedPick = () => {
    const total = borrowStatuses.reduce((s, b) => s + b.weight, 0);
    let rand = Math.random() * total;
    for (const b of borrowStatuses) {
      rand -= b.weight;
      if (rand <= 0) return b.status;
    }
    return "PENDING" as BorrowingStatus;
  };

  let borrowCount = 0;
  // Each student gets 1-4 borrowings
  for (const studentId of studentIds) {
    const count = Math.floor(Math.random() * 4) + 1;
    const usedBooks = new Set<string>();

    for (let i = 0; i < count; i++) {
      let bookId = pick(bookIds);
      // Avoid duplicate student+book pairs
      while (usedBooks.has(bookId)) bookId = pick(bookIds);
      usedBooks.add(bookId);

      const status = weightedPick();
      const createdAt = randomDate(daysAgo(45), new Date());
      const borrowedAt = ["BORROWED", "RETURNED", "OVERDUE"].includes(status)
        ? randomDate(daysAgo(30), new Date())
        : null;
      const dueDate = borrowedAt
        ? new Date(borrowedAt.getTime() + 14 * 24 * 60 * 60 * 1000)
        : null;
      const returnedAt =
        status === "RETURNED"
          ? randomDate(borrowedAt!, dueDate ?? daysFromNow(7))
          : null;

      await db.borrowing.create({
        data: {
          studentId,
          bookId,
          status,
          createdAt,
          borrowedAt,
          dueDate,
          returnedAt,
        },
      });
      borrowCount++;
    }
  }
  console.log(`   ✓ ${borrowCount} borrowings\n`);

  // ── Notifications ─────────────────────────────────────────────────────────
  console.log("🔔 Seeding notifications...");
  const messages = [
    "Your borrow request has been approved.",
    "Your book is due in 3 days. Please return it on time.",
    "Your account is pending approval.",
    "A new book matching your interest has been added.",
    "Your borrowed book is overdue. Please return it immediately.",
    "Your borrow request has been rejected.",
    "Welcome to Kitab Library!",
  ];

  let notifCount = 0;
  for (const studentId of studentIds.slice(0, 15)) {
    const count = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < count; i++) {
      await db.notification.create({
        data: {
          studentId,
          message: pick(messages),
          isRead: Math.random() > 0.5,
          createdAt: randomDate(daysAgo(30), new Date()),
        },
      });
      notifCount++;
    }
  }
  console.log(`   ✓ ${notifCount} notifications\n`);

  console.log("🎉 Seed complete!");
  console.log("─────────────────────────────────────────");
  console.log(`   Admin:    admin@kitab.com / Admin@12345`);
  console.log(`   Students: <email> / Student@12345`);
  console.log("─────────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
