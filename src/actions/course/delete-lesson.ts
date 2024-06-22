'use server';

import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { deleteFolder } from '@/lib/media/delete-file';
import { revalidatePath } from 'next/cache';
import { getTranslations } from 'next-intl/server';

const DeleteLesson = async (lessonId: string, pathname: string) => {
  const t = await getTranslations('CourseOutlinePage');
  const existingLesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { section: { include: { course: true } }, video: true },
  });

  if (!existingLesson) {
    return { error: t('errors.lessonNotFound') };
  }

  const user = await currentUser();

  if (!user || user.id !== existingLesson.section.course.creatorId) {
    return { error: t('errors.notAuthorized') };
  }

  try {
    if (existingLesson.video) {
      if (existingLesson.video.url) {
        deleteFolder(existingLesson.video.url);
      }
    }
    await db.lesson.delete({
      where: { id: lessonId },
    });
    revalidatePath(pathname);
    return { success: t('lessonDeleted') };
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return { error: t('errors.lessonDeletionError') };
  }
};

export default DeleteLesson;
