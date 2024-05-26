"use server"
import { Course as PrismaCourse } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import { PUBLIC_DIRECTORY } from '@/lib/media/storage';

export const UploadImage = async (course: PrismaCourse, file: File) => {
    const fileExtension = path.extname(file.name);

    const media = await db.media.create({
        data: {
            title: file.name,
            url: '', // We'll update the URL later
            type: 'IMAGE',
            size: file.size,
            course: {
                connect: {
                    id: course.id,
                },
            },
            user: {
                connect: {
                    id: course.creatorId,
                },
            },
        },
    });

    const fileName = `${media.id}${fileExtension}`;
    const filePath = `/media/course/images/${fileName}`;
    const fullFilePath = path.join(PUBLIC_DIRECTORY, filePath);

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(fullFilePath), { recursive: true });

    const imageData = await file.arrayBuffer();
    fs.appendFileSync(fullFilePath, Buffer.from(imageData));

    await db.media.update({
        where: { id: media.id },
        data: { url: filePath },
    });
}