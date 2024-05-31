// firstName    String?
// lastName     String?
// bio          String?
// profileImage String?
// telegram     String?
// phone        String?

import { createFileSizeValidator, validateFileType } from "@/lib/validation/validation";
import { useTranslations } from "next-intl";
import * as z from "zod";
import { MAX_FILE_SIZE } from "./courses/course.schema";

export const UserProfileSchema = (t: ReturnType<typeof useTranslations<'ProfileForm'>>) => z.object({
    id: z.string(),
    firstName: z.string().max(100, { message: t('errors.maxFirstName') }).optional(),
    lastName: z.string().max(100, { message: t('errors.maxLastName') }).optional(),
    bio: z.string().max(1000, { message: t('errors.maxBio') }).optional(),
    image: z.string().optional(),
    file: z
    .instanceof(File)
    .refine(createFileSizeValidator(MAX_FILE_SIZE), t('image.size', {size: MAX_FILE_SIZE / 1024 / 1024}))
    .refine(validateFileType, t('image.type'))
    .optional(),
    telegram: z.string().max(50, { message: t('errors.maxTelegram') }).optional(),
    phone: z.string().max(15, { message: t('errors.maxPhone') }).optional(),
    website: z.string().max(255, { message: t('errors.invalidUrl') }).optional(),
    instagram: z.string().max(50, { message: t('errors.maxInstagram') }).optional(),
    facebook: z.string().max(50, { message: t('errors.maxFacebook') }).optional(),
    youtube: z.string().max(50, { message: t('errors.maxYoutube') }).optional(),
});
    

export type UserProfileSchemaType  = z.infer<ReturnType<typeof UserProfileSchema>>;