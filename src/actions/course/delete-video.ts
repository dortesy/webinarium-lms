"use server"
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import { PUBLIC_DIRECTORY } from '@/lib/media/storage';
import { currentUser } from '@/lib/auth';
import { deleteFile } from '@/lib/media/delete-file';

const deleteVideo = async (videoId: string) => {
    const user = await currentUser();

    if (!user) {
        return { error: "Вы не авторизованы" };
    }

    const video = await db.media.findUnique({ where: { id: videoId } });

    if (!video) {
        return { error: 'Видео не найдено' };
    }

    const lesson = await db.lesson.findFirst({ where: { videoId: videoId } });

    if (!lesson || video.userId !== user.id) {
        return { error: "Вы не авторизованы" };
    }

    deleteFile(video.url);

    await db.media.delete({ where: { id: videoId } });
    const updatedLesson = await db.lesson.update({
        where: { id: lesson.id },
        data: { videoId: null },
        include: { video: true }
    });

    return { success: 'Видео удалено', updatedLesson };
};

export default deleteVideo;