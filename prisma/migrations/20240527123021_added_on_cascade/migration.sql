-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_imageId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_videoId_fkey";

-- DropIndex
DROP INDEX "Lesson_slug_key";

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
