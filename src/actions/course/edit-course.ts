'use server'
import {EditCourseSchemaType, EditCourseSchema} from "@/schemas/courses/course.schema";
import { db } from "@/lib/db";
import slugify from "slugify";
import {currentUser} from "@/lib/auth";
import {getTranslations} from "next-intl/server";
import {CourseLanguage, CourseLevel} from "@/lib/enums/course";
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { UploadImage } from "@/lib/media/upload-image";
import { deleteFile } from "@/lib/media/delete-file";



export const EditCourse = async (values: EditCourseSchemaType, formData: FormData) => {
    const t = await getTranslations("EditCourseForm")
    const editCourseSchema = EditCourseSchema(t);
    const validatedFields = editCourseSchema.safeParse(values);

    if (!validatedFields.success) {
        return validatedFields.error.errors;
    }

    const {id, title, description, categoryId, creatorId, imageId, language, level , published, price, duration } = values;
    const user = await currentUser()

    if (!user || user.id !== creatorId) {
        return { error: "Вы не авторизованы" };
    }

    if (!title) {
        return { error: "Course title is required" };
    }

    const slug = slugify(title, { lower: true });

    const existingCourse = await db.course.findFirst({
        where: {
            slug: slug,
            creatorId: user.id,
        },
    });

    if (existingCourse && existingCourse.id !== id) {
        return { error: 'Курс с таким названием уже существует' };
    }

    const window = new JSDOM('').window;
    const sanitizedDescription = DOMPurify(window).sanitize(description ?? '');


    try {
        const course = await db.course.update({
            where: {
                id: id,
            },
            data: {
                title: title.trim(),
                slug: slug,
                description: sanitizedDescription,
                category: {
                    ...(categoryId
                        ? {
                            connect: {
                                id: categoryId,
                            },
                        }
                        : {}),
                },
                level: level as CourseLevel,
                language: language as CourseLanguage,
            },
        });

        const validatedImage = formData.get('image') ? editCourseSchema.shape.file.parse(formData.get('image')) as File : null;


        if (validatedImage && validatedImage.size > 0) {
            await UploadImage(course, validatedImage);
        }
        if (!validatedImage && imageId) {

            const deletedMedia = await db.media.delete({
                where: {
                    id: imageId,
                },
            });

            deleteFile(deletedMedia.url)

        }



        const newCourse = await db.course.findFirst({
            where: {
                id: id
            },
            include: {
                category: true,
                image: true
            }
        })

        return { success: 'Изменения сохранены', course: newCourse};
    }
    catch (error) {
        console.error("Error updating course:", error);
        return { error: 'Произошла ошибка при обновлении курса' };
    }


}