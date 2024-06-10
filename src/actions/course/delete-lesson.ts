'use server';

import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { deleteFolder } from '@/lib/media/delete-file';

const DeleteLesson = async (lessonId: string) => {
  const existingLesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { section: { include: { course: true } }, video: true },
  });

  if (!existingLesson) {
    return { error: 'Урок не найден' };
  }

  const user = await currentUser();

  if (!user || user.id !== existingLesson.section.course.creatorId) {
    return { error: 'Вы не авторизованы' };
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
    return { success: 'Урок удален' };
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return { error: 'Произошла ошибка при удалении урока' };
  }
};

export default DeleteLesson;

