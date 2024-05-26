import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import { PUBLIC_DIRECTORY } from '@/lib/media/storage';
import { getLessonById, getSectionById } from '../course/course-helper';
import { currentUser } from '../auth';

interface UploadVideoProps {
    lessonId: string;
    sectionId: string;
    video: File;
}

export const uploadVideo = async ({ lessonId, sectionId, video }: UploadVideoProps) => {

    const section = await getSectionById(sectionId)

    if (!section) {
        throw new Error('Section not found!')
    }

    const user = await currentUser()

    if (!user || user.id !== section.course.creatorId) {
        return { error: "Вы не авторизованы" };
    }

    const currentLesson = await getLessonById(lessonId)

    if (!currentLesson) {
        throw new Error('Lesson not found!')
    }
    
    // Check if the old video file exists before attempting to delete it
    if (currentLesson.videoId) {
        const oldMedia = await db.media.findUnique({ where: { id: currentLesson.videoId } });
        if (oldMedia) {
            const oldFilePath = path.join(PUBLIC_DIRECTORY, oldMedia.url);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
            await db.media.delete({ where: { id: currentLesson.videoId } });
        }
    }

    // Save the new video file
    const fileExtension = path.extname(video.name);
    const media = await db.media.create({
        data: {
            title: video.name,
            url: '',
            type: 'VIDEO',
            size: video.size,
            lesson: { connect: { id: lessonId } },
            userId: user.id
        },
    });

    const fileName = `${media.id}${fileExtension}`;
    const newFilePath = `/media/lessons/videos/${fileName}`;
    const fullNewFilePath = path.join(PUBLIC_DIRECTORY, newFilePath);

    fs.mkdirSync(path.dirname(fullNewFilePath), { recursive: true });
    const videoData = await video.arrayBuffer();
    fs.writeFileSync(fullNewFilePath, Buffer.from(videoData));

    await db.media.update({
        where: { id: media.id },
        data: { url: newFilePath },
    });

    const updatedLesson = await db.lesson.update({
        where: { id: lessonId },
        data: { videoId: media.id },
        include: { video: true }
    });

    return { data: updatedLesson };
};