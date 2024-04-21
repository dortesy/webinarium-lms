export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function createFileSizeValidator(maxSize: number) {
    return function validateFileSize(file: File | undefined) {
        return file ? file.size <= maxSize : true;
    };
}

export function validateFileType(file: File | undefined) {
    return file ? ACCEPTED_IMAGE_TYPES.includes(file.type) : true;
}