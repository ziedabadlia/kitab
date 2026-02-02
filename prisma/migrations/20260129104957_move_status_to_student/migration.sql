/*
  Warnings:

  - You are about to drop the column `status` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_status_idx";

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'SUSPENDED';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "status";
