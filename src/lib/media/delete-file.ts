import fs from 'fs';
import path from 'path';
import { PUBLIC_DIRECTORY } from '@/lib/media/storage';

export const deleteFile = (filePath: string) => {
    // Get the parent directory of the provided file path
    const directoryPath = path.join(PUBLIC_DIRECTORY, path.dirname(filePath));

    if (fs.existsSync(directoryPath)) {
        fs.rmSync(directoryPath, { recursive: true, force: true });
    }
};