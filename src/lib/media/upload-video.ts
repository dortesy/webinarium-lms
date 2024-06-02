import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import { PUBLIC_DIRECTORY } from '@/lib/media/storage';
import { getLessonById, getSectionById } from '../course/course-helper';
import { currentUser } from '../auth';
import ffmpeg from 'fluent-ffmpeg';
import {glob} from "glob";

interface UploadVideoProps {
    lessonId: string;
    sectionId: string;
    video: File;
}

export const uploadVideo = async ({ lessonId, sectionId, video }: UploadVideoProps) => {
    const section = await getSectionById(sectionId);

    if (!section) {
        throw new Error('Section not found!');
    }

    const user = await currentUser();

    if (!user || user.id !== section.course.creatorId) {
        return { error: "Вы не авторизованы" };
    }

    const currentLesson = await getLessonById(lessonId);

    if (!currentLesson) {
        throw new Error('Lesson not found!');
    }

    // Check if the old video file exists before attempting to delete it
    if (currentLesson.video) {
        const oldMedia = await db.media.findUnique({ where: { id: currentLesson.video.id } });
        if (oldMedia) {
            const oldFilePath = path.join(PUBLIC_DIRECTORY, oldMedia.url);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
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
            user: { connect: { id: user.id } },
        },
    });

    const fileName = `${media.id}${fileExtension}`;
    const newFilePath = `/media/lessons/videos/${fileName}`;
    const fullNewFilePath = path.join(PUBLIC_DIRECTORY, newFilePath);

    fs.mkdirSync(path.dirname(fullNewFilePath), { recursive: true });
    const videoData = await video.arrayBuffer();
    fs.writeFileSync(fullNewFilePath, Buffer.from(videoData));

    // Update the media URL in the database
    await db.media.update({
        where: { id: media.id },
        data: { url: newFilePath },
    });

    console.log('Videopath', fullNewFilePath)
    // Transcode the video into multiple resolutions and HLS format
    await transcodeVideo(fullNewFilePath, media.id);

    const updatedLesson = await db.lesson.update({
        where: { id: lessonId },
        data: { video: { connect: { id: media.id } } },
        include: { video: true }
    });

    return { data: updatedLesson };
};

const generateThumbnailSprites = async (filePath: string, outputDir: string, framesInterval: number = 300) => {
    const totalFrames = await new Promise<number>((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) reject(err);
            else resolve(metadata.streams[0].nb_frames);
        });
    });

    const totalThumbnails = Math.ceil(totalFrames / framesInterval);
    const spritesNeeded = Math.ceil(totalThumbnails / 25);

    for (let i = 0; i < spritesNeeded; i++) {
        const startThumbnail = i * 25;
        const endThumbnail = Math.min((i + 1) * 25, totalThumbnails);
        const thumbnailCount = endThumbnail - startThumbnail;

        const spritePath = path.join(outputDir, `thumbnail-sprite-${i}.jpg`);

        await new Promise<void>((resolve, reject) => {
            ffmpeg(filePath)
                .complexFilter([
                    `select='not(mod(n,${framesInterval}))',scale=160:90,tile=${thumbnailCount}x1`
                ])
                .output(spritePath)
                .on('end', resolve)
                .on('error', reject)
                .run();
        });
    }
};



const transcodeVideo = async (filePath: string, mediaId: string) => {
    const outputDir = path.join(PUBLIC_DIRECTORY, 'media/lessons/videos', mediaId);
    fs.mkdirSync(outputDir, { recursive: true });

    const resolutions = [
        { name: '360p', width: 640, height: 360, bitrate: '800k' },
        { name: '720p', width: 1280, height: 720, bitrate: '2800k' },
        { name: '1080p', width: 1920, height: 1080, bitrate: '5000k' },
    ];

    const masterPlaylistContent = ['#EXTM3U', '#EXT-X-VERSION:3'];

    for (const res of resolutions) {
        const resOutputDir = path.join(outputDir, res.name);
        fs.mkdirSync(resOutputDir, { recursive: true });

        const segmentFilename = path.join(resOutputDir, 'fileSequence%d.ts');
        const playlistFilename = path.join(resOutputDir, `${res.name}.m3u8`);
        const bandwidth = (parseInt(res.bitrate.slice(0, -1)) * 1000) as number;

        masterPlaylistContent.push(
            `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${res.width}x${res.height}`,
            `${res.name}/${res.name}.m3u8`
        );

        await new Promise<void>((resolve, reject) => {
            ffmpeg(filePath)
                .addOptions([
                    '-preset fast',
                    '-g 48',
                    '-sc_threshold 0',
                    '-c:a aac',
                    '-ar 48000',
                    '-c:v h264',
                    '-profile:v main',
                    '-crf 20',
                    `-maxrate ${res.bitrate}`,
                    '-bufsize 1835k',
                    '-hls_time 10',
                    '-hls_list_size 0',
                    '-f hls',
                    `-hls_segment_filename ${segmentFilename}`,
                    `-vf scale=w=${res.width}:h=${res.height}`
                ])
                .output(playlistFilename)
                .on('start', (commandLine) => {
                    console.log('Spawned Ffmpeg with command: ' + commandLine);
                })
                .on('end', () => {
                    console.log(`Transcoding to ${res.name} finished`);
                    resolve();
                })
                .on('error', (err, stdout, stderr) => {
                    console.error('Error during transcoding:', err);
                    console.error('stdout:', stdout);
                    console.error('stderr:', stderr);
                    reject(err);
                })
                .run();
        });
    }


    fs.writeFileSync(path.join(outputDir, 'master.m3u8'), masterPlaylistContent.join('\n'));

    await generateThumbnailSprites(filePath, outputDir);


    const hlsUrl = `/media/lessons/videos/${mediaId}/master.m3u8`;
    await db.media.update({
        where: { id: mediaId },
        data: { url: hlsUrl },
    });
};
