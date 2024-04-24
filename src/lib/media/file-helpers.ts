"use server"
import {db} from "@/lib/db";
import path from "path";
import fs from "fs";
import {COURSE_IMAGE_DIRECTORY} from "@/lib/media/storage";

// export async function getBlob (url: string) {
//
//     const filePath = path.join(COURSE_IMAGE_DIRECTORY, url);
//     const imageData = fs.readFileSync(filePath);
//
//     // Set the appropriate response headers
//     res.setHeader('Content-Type', 'image/png'); // Adjust the content type based on your image format
//     res.setHeader('Content-Disposition', `attachment; filename="${path.basename(media.url)}"`);
//
//     // Send the image buffer as the response
//     res.send(imageBuffer);
//
//     return {
//         title: media.title,
//         type: media.type,
//         url: `data:image/${fileExtension};base64,${imageData.toString('base64')}`,
//
//     }
//
// }