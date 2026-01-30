import { PrismaClient, Role, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting comprehensive library seeding...");

  const generalDept = await prisma.department.upsert({
    where: { slug: "general-literature" },
    update: {},
    create: {
      name: "General Literature",
      slug: "general-literature",
    },
  });

  const categories = [
    "Thriller",
    "Psychological Thriller",
    "Horror",
    "Suspense",
  ];
  const categoryMap: Record<string, any> = {};

  for (const catName of categories) {
    const cat = await prisma.category.upsert({
      where: { name: catName },
      update: {},
      create: {
        name: catName,
        slug: catName.toLowerCase().replace(/ /g, "-"),
      },
    });
    categoryMap[catName] = cat;
  }

  const booksData = [
    {
      title: "Origin",
      author: "Dan Brown",
      slug: "origin",
      isbn: "9780593078754",
      description:
        "Robert Langdon, Harvard professor of symbology, arrives at the ultramodern Guggenheim Museum Bilbao.",
      coverImageUrl: "https://m.media-amazon.com/images/I/8166InDRS7L.jpg",
      rating: 4.5,
      totalCopies: 100,
      availableCopies: 42,
      cat: "Thriller",
    },
    {
      title: "The Fury",
      author: "Alex Michaelides",
      slug: "the-fury",
      isbn: "9781250341310",
      description:
        "A masterfully paced, stylishly written thriller from the author of The Silent Patient.",
      coverImageUrl: "https://m.media-amazon.com/images/I/81S8l-l8VvL.jpg",
      rating: 4.2,
      totalCopies: 50,
      availableCopies: 12,
      cat: "Psychological Thriller",
    },
    {
      title: "Gerald's Game",
      author: "Stephen King",
      slug: "geralds-game",
      isbn: "9781501143823",
      description:
        "A woman's game of seduction with her husband goes horribly wrong when she is left handcuffed.",
      coverImageUrl: "https://m.media-amazon.com/images/I/81A7bN4C4+L.jpg",
      rating: 4.7,
      totalCopies: 25,
      availableCopies: 8,
      cat: "Horror",
    },
    {
      title: "Don't Turn Around",
      author: "Jessica Barry",
      slug: "dont-turn-around",
      isbn: "9780062874856",
      description:
        "Two strangers, dangerous secrets. Their only chance is each other in this high-stakes thriller.",
      coverImageUrl: "https://m.media-amazon.com/images/I/81U2fBvS9VL.jpg",
      rating: 4.1,
      totalCopies: 40,
      availableCopies: 15,
      cat: "Suspense",
    },
  ];

  for (const book of booksData) {
    const { cat, ...rest } = book;
    await prisma.book.upsert({
      where: { slug: book.slug },
      update: {},
      create: {
        ...rest,
        departmentId: generalDept.id,
        categories: {
          create: [{ categoryId: categoryMap[cat].id }],
        },
      },
    });
  }

  console.log(
    "✅ Database successfully populated with 4 books and a verified student.",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
