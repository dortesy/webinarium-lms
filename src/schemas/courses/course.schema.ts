import * as z from "zod";
import {
        CourseLanguageEnum,
        CourseLevelEnum,
        CourseStatusEnum
} from "@/lib/enums/course";
import {createFileSizeValidator, validateFileType} from "@/lib/validation/validation";
import {useTranslations} from "next-intl";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const CreateCourseSchema = (t: ReturnType<typeof useTranslations<'CreateCourseForm'>>) => z.object({
        title: z.string().min(6, {  message: t('errors.title'),}),
});

export type CreateCourseSchemaType  = z.infer<ReturnType<typeof CreateCourseSchema>>;


export const EditCourseSchema = (t: ReturnType<typeof useTranslations<'EditCourseForm'>>) => z.object({
        title: z.string().min(6).max(100).optional(),
        description: z.string().max(1000).optional(),
        categoryId: z.string().optional(),
        price: z.number().min(0).optional(),
        duration: z.number().int().min(0).optional(),
        level: z.enum(CourseLevelEnum).optional(),
        language: z.enum(CourseLanguageEnum).optional(),
        image: z
            .instanceof(File)
            .refine(createFileSizeValidator(MAX_FILE_SIZE), t('image.size', {size: MAX_FILE_SIZE / 1024 / 1024}))
            .refine(validateFileType, t('image.type'))
            .optional(),
        published: z.boolean().default(false).optional()
});