'use server';

import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { deleteFolder } from '@/lib/media/delete-file';
import { revalidatePath } from 'next/cache';
import { getTranslations } from 'next-intl/server';

const DeleteSection = async (sectionId: string, pathname: string) => {
  const t = await getTranslations('CourseOutlinePage');
  const existingSection = await db.section.findUnique({
    where: {
      id: sectionId,
    },
    include: {
      course: true,
      lessons: {
        include: {
          video: true,
        },
      },
    },
  });

  if (!existingSection) {
    return { error: t('errors.sectionNotFound') };
  }

  const user = await currentUser();

  if (!user || user.id !== existingSection.course.creatorId) {
    return { error: t('errors.notAuthorized') };
  }

  try {
    const lessons = existingSection.lessons;
    for (const lesson of lessons) {
      if (lesson.video) {
        deleteFolder(lesson.video.url);
      }
    }

    await db.section.delete({
      where: {
        id: sectionId,
      },
    });

    revalidatePath(pathname);
    return { success: t('sectionDeleted') };
  } catch (error) {
    console.error('Error deleting section:', error);
    return { error: t('errors.sectionDeletionError') };
  }
};

export default DeleteSection;
