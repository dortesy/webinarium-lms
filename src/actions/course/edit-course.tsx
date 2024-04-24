'use server'
import {EditCourseSchemaType, EditCourseSchema} from "@/schemas/courses/course.schema";
import { db } from "@/lib/db";
import slugify from "slugify";
import {currentUser} from "@/lib/auth";
import {getTranslations} from "next-intl/server";
import {CourseLanguage, CourseLevel} from "@/lib/enums/course";
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import fs from "fs";
import {COURSE_IMAGE_DIRECTORY} from "@/lib/media/storage";
import path from "path";
import { Course as PrismaCourse } from '@prisma/client';

const UploadImage = async (course: PrismaCourse, file: File) => {
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
    const filePath = `/media/course/img/${fileName}`;
    const fullFilePath = path.join(COURSE_IMAGE_DIRECTORY, filePath);

    const imageData = await file.arrayBuffer();
    fs.appendFileSync(fullFilePath, Buffer.from(imageData));

    await db.media.update({
        where: { id: media.id },
        data: { url: filePath },
    });



}

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
            include: {image: true},
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

        if(!imageId && validatedImage) {
            await UploadImage(course, validatedImage)
        }

        if(!imageId && !validatedImage && course.imageId) {
            await db.media.delete({
                where: {
                    id: course.imageId
                }
            })
        }

        return { success: 'Изменения сохранены', course: course};
    }
    catch (error) {
        console.error("Error updating course:", error);
        return { error: 'Произошла ошибка при обновлении курса' };
    }


}