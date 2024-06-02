// src/jobs/processors.ts
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import {PUBLIC_DIRECTORY} from "@/lib/media/storage";

const generateThumbnailSprites = async (
    filePath: string,
    outputDir: string,
    interval: number = 5
) => {
    const totalDurationInSeconds = await new Promise<number>((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) reject(err);
            else resolve(metadata.format.duration);
        });
    });

    const numThumbnails = Math.floor(totalDurationInSeconds / interval);
    const spritesNeeded = Math.ceil(numThumbnails / 25);

    for (let i = 0; i < spritesNeeded; i++) {
        const spritePath = path.join(outputDir, `thumbnail-sprite-${i}.jpg`);

        // Calculate start and end times for this sprite's thumbnails
        const startTime = i * interval * 25; // 25 thumbnails per sprite
        const endTime = Math.min(startTime + interval * 25, totalDurationInSeconds);

        await new Promise<void>((resolve, reject) => {
            ffmpeg(filePath)
                .setStartTime(startTime) // Start from the calculated time
                .setDuration(endTime - startTime) // Set duration for this sprite
                .complexFilter([
                    `fps=1/${interval},scale=160:90,tile=5x5`
                ])
                .output(spritePath)
                .on('end', resolve)
                .on('error', (err, stdout, stderr) => {
                    console.error('FFmpeg Error:', err.message);
                    console.error('FFmpeg Stdout:', stdout);
                    console.error('FFmpeg Stderr:', stderr);
                    reject(err);
                })
                .run();
        });
    }
};



export const transcodeVideo = async (filePath: string, mediaId: string) => {
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
        data: { url: hlsUrl, isReady: true },
    });
};
