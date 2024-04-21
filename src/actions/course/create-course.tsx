'use server'
import {CreateCourseSchema, CreateCourseSchemaType} from "@/schemas/courses/course.schema";
import { db } from "@/lib/db";
import slugify from "slugify";
import * as z from "zod";
import {currentUser} from "@/lib/auth";
import {getTranslations} from "next-intl/server";


export const CreateCourse = async (values: CreateCourseSchemaType) => {
    const t = await getTranslations("CreateCourseForm");
    const paramSchema = CreateCourseSchema(t);
    const validatedFields = paramSchema.safeParse(values);

    if (!validatedFields.success) {
        return validatedFields.error.errors;
    }

    const { title } = values;
    const user = await currentUser()

    if (!user) {
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

    if (existingCourse) {
        return { error: 'Курс с таким названием уже существует' };
    }



    try {
        const course = await db.course.create({
            data: {
                title: title.trim(),
                slug: slug,
                creator: { connect: { id: user.id! } },
                status: 'DRAFT',
            },
        });

        return { success: 'Курс создан', courseId: course.id };
    } catch (error) {
        console.error("Error creating course:", error);
        return { error: 'Произошла ошибка при создании курса' };
    }
}