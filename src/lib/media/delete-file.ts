import fs from 'fs';
import path from 'path';
import { PUBLIC_DIRECTORY } from '@/lib/media/storage';

export const deleteFile = (filePath: string) => {
    const fullPath = path.join(PUBLIC_DIRECTORY, filePath);
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
    }
};