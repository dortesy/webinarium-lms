'use server';

import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { getLessonById, getSectionById } from '@/lib/course/course-helper';
import { revalidatePath } from 'next/cache';
import { getTranslations } from 'next-intl/server';

const EditLessonPosition = async (
  lessonId: string,
  position: number,
  pathname: string,
) => {
  const existingLesson = await getLessonById(lessonId);
  const t = await getTranslations('CourseOutlinePage');
  if (!existingLesson) {
    return { error: t('errors.lessonNotFound') };
  }

  const section = await getSectionById(existingLesson.sectionId);

  if (!section) {
    return { error: t('errors.sectionNotFound') };
  }

  const user = await currentUser();

  if (!user || user.id !== section.course.creatorId) {
    return { error: t('errors.notAuthorized') };
  }

  try {
    await db.lesson.update({
      where: { id: lessonId },
      data: { position: position },
    });

    const lessons = await db.lesson.findMany({
      where: { sectionId: section.id },
      orderBy: { position: 'asc' },
      include: { video: true },
    });

    revalidatePath(pathname);
    return { success: t('lessonMoved'), lessons: lessons };
  } catch (error) {
    console.error('Error updating lesson position:', error);
    return { error: t('errors.lessonMovingError') };
  }
};

export default EditLessonPosition;
