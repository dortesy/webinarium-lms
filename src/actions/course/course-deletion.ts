'use server';

import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { getTranslations } from 'next-intl/server';

export const CourseDeletion = async (id: string) => {
  const user = await currentUser();
  const t = await getTranslations('CourseDeletion');

  if (!user) {
    return { error: t('notAuthorized') };
  }

  const courseExists = await db.course.findFirst({
    where: {
      id: id,
      creatorId: user.id,
    },
  });

  if (!courseExists) {
    return {
      error: t('notFound'),
    };
  }

  //TODO
  // Right now it deletes entities only from database
  // We need to add features to delete files too
  // Currently we have two types of files: Course Cover and Lessons Video
  // Course cover - single jpg file
  // Lessons Video - stores in a folder [lesson id] with chunks and thumbnails
  // Need to implement a feature that will delete sigle files and folder with videos.
  try {
    await db.course.delete({
      where: {
        id: id,
      },
    });

    return { success: t('success') };
  } catch (error) {
    console.error('Error deleting course:', error);
    return { error: t('error') };
  }
};
