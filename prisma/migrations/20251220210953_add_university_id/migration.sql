/*
  Warnings:

  - You are about to drop the column `university_id_number` on the `students` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[student_id_number]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `student_id_number` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "students_university_id_number_idx";

-- DropIndex
DROP INDEX "students_university_id_number_key";

-- AlterTable
ALTER TABLE "students" DROP COLUMN "university_id_number",
ADD COLUMN     "student_id_number" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "students_student_id_number_key" ON "students"("student_id_number");

-- CreateIndex
CREATE INDEX "students_student_id_number_idx" ON "students"("student_id_number");
