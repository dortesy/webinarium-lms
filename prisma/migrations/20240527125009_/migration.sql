-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_videoId_fkey";

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
