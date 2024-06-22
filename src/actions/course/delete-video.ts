'use server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { deleteFolder } from '@/lib/media/delete-file';
import { getLessonById } from '@/lib/course/course-helper';
import { getTranslations } from 'next-intl/server';

const deleteVideo = async (videoId: string) => {
  const user = await currentUser();
  const t = await getTranslations('VideoData.deletion');

  if (!user) {
    return { error: t('notAuthorized') };
  }

  const video = await db.media.findUnique({ where: { id: videoId } });

  if (!video || !video.lessonId) {
    return { error: t('videoNotFound') };
  }

  if (video.userId !== user.id) {
    return { error: t('notAuthorized') };
  }

  try {
    await db.media.delete({ where: { id: video.id } });
    deleteFolder(video.url);

    const updatedLesson = await getLessonById(video.lessonId);

    return { success: t('success'), updatedLesson };
  } catch (error) {
    return { error: t('genericError') };
  }
};

export default deleteVideo;
