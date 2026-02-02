// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

// Template data from your CSV
const bookTemplates = [
  {
    title: "Don't Turn Around",
    author: "Jessica Barry",
    slug: "dont-turn-around",
    isbn: "9780062874856",
    description:
      "Two strangers, dangerous secrets. Their only chance is each other in this high-stakes thriller.",
    coverImageUrl:
      "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/hostedimages/1429298161i/14567325._SY540_.jpg",
    rating: 4.1,
    totalCopies: 40,
    availableCopies: 15,
    borrowCount: 50,
    departmentId: "0721257f-9add-44f2-bd7e-4a4cb2d3d529",
    coverColor: "#012B48",
  },
  {
    title: "Origin",
    author: "Dan Brown",
    slug: "origin",
    isbn: "9780593078754",
    description:
      "Robert Langdon, Harvard professor of symbology, arrives at the ultramodern Guggenheim Museum Bilbao.",
    coverImageUrl:
      "https://res.cloudinary.com/dt7w60zoz/image/upload/v1769783689/b9f575d7291ed26c3e0ba2f18c194d7db01b883a_s2elih.png",
    rating: 4.5,
    totalCopies: 100,
    availableCopies: 42,
    borrowCount: 46,
    departmentId: "0721257f-9add-44f2-bd7e-4a4cb2d3d529",
    coverColor: "#C73D3A",
  },
  {
    title: "The Fury",
    author: "Alex Michaelides",
    slug: "the-fury",
    isbn: "9781250341310",
    description:
      "A masterfully paced, stylishly written thriller from the author of The Silent Patient.",
    coverImageUrl:
      "https://res.cloudinary.com/dt7w60zoz/image/upload/v1769783652/8e1a9d4b39d35f9e212c14ed1e1069fd10c4e77b_tnrm0e.png",
    rating: 4.2,
    totalCopies: 50,
    availableCopies: 12,
    borrowCount: 20,
    departmentId: "0721257f-9add-44f2-bd7e-4a4cb2d3d529",
    coverColor: "#020202",
  },
  {
    title: "Gerald's Game",
    author: "Stephen King",
    slug: "geralds-game",
    isbn: "9781501143823",
    description:
      "A woman's game of seduction with her husband goes horribly wrong when she is left handcuffed.",
    coverImageUrl:
      "https://res.cloudinary.com/dt7w60zoz/image/upload/v1769783645/3cabe4a098bb6c35e893e88ff9f6636aa09fae37_nntd6g.png",
    rating: 4.7,
    totalCopies: 25,
    availableCopies: 8,
    borrowCount: 33,
    departmentId: "0721257f-9add-44f2-bd7e-4a4cb2d3d529",
    coverColor: "#936F4A",
  },
];

// Additional variations for realistic data
const suffixes = [
  "II",
  "III",
  "The Sequel",
  "Reloaded",
  "Remastered",
  "Edition",
  "Collection",
  "Series",
  "Chronicles",
  "Saga",
];
const prefixTitles = [
  "The Lost",
  "Dark",
  "Secret",
  "Hidden",
  "Silent",
  "Midnight",
  "Final",
  "Last",
  "First",
  "Eternal",
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Check if we already have books
  const existingCount = await prisma.book.count();
  if (existingCount > 10) {
    console.log(
      `⚠️  Database already has ${existingCount} books. Skipping seed to avoid duplicates.`,
    );
    console.log(
      "   Run 'npx prisma db seed --force' to override (or delete existing books first).",
    );
    return;
  }

  const booksToCreate = [];

  // Generate 20 variations of each template (80 total books)
  for (let i = 0; i < 20; i++) {
    for (const template of bookTemplates) {
      // Create variations
      const isBase = i === 0;
      const title = isBase
        ? template.title
        : `${prefixTitles[i % prefixTitles.length]} ${template.title} ${suffixes[i % suffixes.length]}`;

      const slug = isBase ? template.slug : `${template.slug}-${i + 1}`;

      const isbn = isBase
        ? template.isbn
        : `${template.isbn.slice(0, -2)}${String(i).padStart(2, "0")}`;

      // Vary borrowCount for realistic pagination (some popular, some not)
      const borrowCountVariation = Math.floor(Math.random() * 100);

      booksToCreate.push({
        id: randomUUID(),
        title,
        author: template.author,
        slug,
        isbn,
        description: template.description,
        coverImageUrl: template.coverImageUrl,
        coverColor: template.coverColor,
        videoUrl: null,
        rating: template.rating,
        totalCopies: template.totalCopies + Math.floor(Math.random() * 20),
        availableCopies: template.availableCopies,
        borrowCount: template.borrowCount + borrowCountVariation,
        departmentId: template.departmentId,
        createdAt: new Date(Date.now() - Math.random() * 10000000000), // Random dates
        updatedAt: new Date(),
      });
    }
  }

  // Insert in batches to avoid overwhelming the DB
  const batchSize = 20;
  for (let i = 0; i < booksToCreate.length; i += batchSize) {
    const batch = booksToCreate.slice(i, i + batchSize);
    await prisma.book.createMany({
      data: batch,
      skipDuplicates: true,
    });
    console.log(
      `✅ Created batch ${i / batchSize + 1}/${Math.ceil(booksToCreate.length / batchSize)}`,
    );
  }

  console.log(`🎉 Successfully seeded ${booksToCreate.length} books!`);

  // Assign random categories to books for filter testing
  const categories = await prisma.category.findMany();
  if (categories.length > 0) {
    console.log("🔗 Assigning categories to books...");
    const allBooks = await prisma.book.findMany({ select: { id: true } });

    for (const book of allBooks) {
      // Assign 1-2 random categories per book
      const numCategories = Math.floor(Math.random() * 2) + 1;
      const shuffled = categories.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, numCategories);

      for (const cat of selected) {
        await prisma.bookCategory.upsert({
          where: {
            bookId_categoryId: {
              bookId: book.id,
              categoryId: cat.id,
            },
          },
          update: {},
          create: {
            bookId: book.id,
            categoryId: cat.id,
          },
        });
      }
    }
    console.log("✅ Categories assigned!");
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
