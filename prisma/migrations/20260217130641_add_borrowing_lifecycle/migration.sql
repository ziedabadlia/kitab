/*
  Warnings:

  - The values [ACTIVE] on the enum `BorrowingStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BorrowingStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'BORROWED', 'RETURNED', 'REJECTED', 'CANCELLED', 'OVERDUE', 'LOST');
ALTER TABLE "public"."borrowings" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "borrowings" ALTER COLUMN "status" TYPE "BorrowingStatus_new" USING ("status"::text::"BorrowingStatus_new");
ALTER TYPE "BorrowingStatus" RENAME TO "BorrowingStatus_old";
ALTER TYPE "BorrowingStatus_new" RENAME TO "BorrowingStatus";
DROP TYPE "public"."BorrowingStatus_old";
ALTER TABLE "borrowings" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "borrowings" ALTER COLUMN "status" SET DEFAULT 'PENDING';
