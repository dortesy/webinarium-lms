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


export const EditCourseSchema = (t: ReturnType<typeof useTranslations<'EditCourseForm'>>) => z.object({
        id: z.string(),
        title: z.string().min(6, {message: t('errors.minTitle')}).max(200, {  message: t('errors.maxTitle'),}),
        description: z.string().max(4000, {message: t('errors.description')}).optional().default(''),
        categoryId: z.string().optional().default(''),
        price: z.number().min(0).optional(),
        duration: z.number().int().min(0).optional(),
        level: z.enum(CourseLevelEnum),
        language: z.enum(CourseLanguageEnum).optional(),
        file: z
            .instanceof(File)
            .refine(createFileSizeValidator(MAX_FILE_SIZE), t('image.size', {size: MAX_FILE_SIZE / 1024 / 1024}))
            .refine(validateFileType, t('image.type'))
            .optional(),
        published: z.boolean().default(false).optional(),
        creatorId: z.string(),
        imageId: z.string().optional()
});



export const SectionSchema =  (t: ReturnType<typeof useTranslations<'CourseOutlinePage'>>) => z.object({
        id: z.string().optional(),
        title: z.string().min(6, {message: t('errors.minSectionTitle')}).max(200, {  message: t('errors.maxSectionTitle'),}),
        description: z.string().max(300, {message: t('errors.maxDescription')}).optional(),
        courseId: z.string().optional(),
});

export const LessonSchema = (t: ReturnType<typeof useTranslations<'CourseOutlinePage'>>) => z.object({
        id: z.string().optional(),
        title: z.string().min(6, { message: t('errors.minSectionTitle') }).max(200, { message: t('errors.maxLessonTitle') }),
        description: z.string().max(300, { message: t('errors.maxDescription') }).optional(),
        sectionId: z.string().optional(),
    });



export type SectionSchemaType  = z.infer<ReturnType<typeof SectionSchema>>;
export type CreateCourseSchemaType  = z.infer<ReturnType<typeof CreateCourseSchema>>;
export type EditCourseSchemaType  = z.infer<ReturnType<typeof EditCourseSchema>>;
export type LessonSchemaType  = z.infer<ReturnType<typeof LessonSchema>>;

