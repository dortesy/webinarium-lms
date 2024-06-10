'use server';
import https from 'https';
import { Course as PrismaCourse, User } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import { PUBLIC_DIRECTORY, profileFolderPath } from '@/lib/media/storage';

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
};

export const UploadImageToProfile = async (userId: string, file: File) => {
  const fileExtension = path.extname(file.name);
  const fileName = `${userId}${fileExtension}`;
  const filePath = profileFolderPath.concat(fileName);
  const fullFilePath = path.join(PUBLIC_DIRECTORY, filePath);

  fs.mkdirSync(path.dirname(fullFilePath), { recursive: true });
  const imageData = await file.arrayBuffer();
  fs.appendFileSync(fullFilePath, Buffer.from(imageData));

  return filePath;
};

export const UploadImageFromURLToProfile = async (
  userId: string,
  imageUrl: string,
) => {
  return new Promise<string>((resolve, reject) => {
    // Get the file extension from the URL
    const fileExtension = '.jpg';
    const fileName = `${userId}${fileExtension}`;
    const filePath = profileFolderPath.concat(fileName);
    const fullFilePath = path.join(PUBLIC_DIRECTORY, filePath);

    // Make sure the directory exists
    fs.mkdirSync(path.dirname(fullFilePath), { recursive: true });

    // Fetch the image data from the URL
    https
      .get(imageUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(
              `Failed to get image. Status code: ${response.statusCode}`,
            ),
          );
          return;
        }

        // Stream the response data to a file
        const fileStream = fs.createWriteStream(fullFilePath);
        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          resolve(filePath);
        });

        fileStream.on('error', (error) => {
          fs.unlink(fullFilePath, () => reject(error)); // Clean up if there's an error
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};
