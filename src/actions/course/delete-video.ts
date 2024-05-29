"use server"
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import { PUBLIC_DIRECTORY } from '@/lib/media/storage';
import { currentUser } from '@/lib/auth';
import { deleteFile } from '@/lib/media/delete-file';
import { getLessonById } from '@/lib/course/course-helper';

const deleteVideo = async (videoId: string) => {
    const user = await currentUser();

    if (!user) {
        return { error: "Вы не авторизованы" };
    }

    const video = await db.media.findUnique({ where: { id: videoId } });

    if (!video || !video.lessonId) {
        return { error: 'Видео не найдено' };
    }


    if (video.userId !== user.id) {
        return { error: "Вы не авторизованы" };
    }

    try {
        await db.media.delete({ where: { id: video.id } });
        deleteFile(video.url);

        const updatedLesson = await getLessonById(video.lessonId);

        if(updatedLesson) {
            return { success: 'Видео удалено', updatedLesson };
        }

        return { error: 'Урок не найден' };

    } catch (error) {
        return { error: "Ошибка удаления видео" };
    }
};

export default deleteVideo;