import * as z from "zod";

export const CreateCourseSchema = z.object({
        title: z.string().min(6, {  message: "Название курса должно быть не менее 6 символов",}),
});


export const EditCourseSchema = z.object({
        title: z.string().min(6).max(100).optional(),
        description: z.string().max(1000).optional(),
        categoryId: z.string().optional(),
        price: z.number().min(0).optional(),
        duration: z.number().int().min(0).optional(),
        level: z.string().optional(),
        language: z.string().optional(),
        imageId: z.string().optional(),
        status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});