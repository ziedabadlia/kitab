-- AlterTable
ALTER TABLE "borrowings" ALTER COLUMN "borrowed_at" DROP NOT NULL,
ALTER COLUMN "due_date" DROP NOT NULL;
