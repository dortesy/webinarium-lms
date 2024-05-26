"use server"
import {SectionSchema, SectionSchemaType} from "@/schemas/courses/course.schema";
import {getTranslations} from "next-intl/server";
import {db} from "@/lib/db";
import {currentUser} from "@/lib/auth";
import {Prisma} from "@prisma/client";
import {getCourseById, getSectionsByCourseId} from "@/lib/course/course-helper";

export const CreateSection = async (values: SectionSchemaType) => {
    const t = await getTranslations("CourseOutlinePage")
    const sectionSchema = SectionSchema(t);
    const validatedFields = sectionSchema.safeParse(values);

    if (!validatedFields.success) {
        return validatedFields.error.errors;
    }

    const { title, description, courseId } = values;

    if (!title || !courseId) {
        return { error: "Section title is required" };
    }

    const existingCourse = await getCourseById(courseId);

    if (!existingCourse) {
        return { error: 'Курс не найден' };
    }
    const user = await currentUser()

    if (!user || user.id !== existingCourse?.creatorId) {
        return { error: "Вы не авторизованы" };
    }


    const lastSection = await db.section.findFirst({
        where: {
            courseId: courseId
        },
        orderBy: {
            position: Prisma.SortOrder.desc
        }
    });

    const position = lastSection ? lastSection.position + 1 : 1;


    try{
        const section = await db.section.create({
            data: {
                title: title.trim(),
                description: description,
                course: {
                    connect: {
                        id: courseId
                    }
                },
                position: position
            }
        });

        return { success: 'Section created', section: section};
    } catch (error) {
        console.error("Error creating section:", error);
        return { error: 'Произошла ошибка при создании раздела' };
    }


}