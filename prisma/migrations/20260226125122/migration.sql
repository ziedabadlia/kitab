-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_studentId_fkey";

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
