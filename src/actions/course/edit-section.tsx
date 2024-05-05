
"use server"
import {SectionSchema, SectionSchemaType} from "@/schemas/courses/course.schema";
import {getTranslations} from "next-intl/server";
import {db} from "@/lib/db";
import {currentUser} from "@/lib/auth";
import {Prisma} from "@prisma/client";
import {getCourseById, getSectionsByCourseId} from "@/lib/course/course-helper";

export const EditSection = async (values: SectionSchemaType) => {
    const t = await getTranslations("CourseOutlinePage")
    const sectionSchema = SectionSchema(t);
    const validatedFields = sectionSchema.safeParse(values);

    if (!validatedFields.success) {
        return validatedFields.error.errors;
    }

    const { id, title, description, courseId } = values;

    if (!title || !courseId || !id) {
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


    try{
        const section = await db.section.update({
            where: {
                id: id
            },
            data: {
                title: title.trim(),
                description: description,
            }
         });


        return { success: 'Раздел изменен', section: section};
    } catch (error) {
        console.error("Error creating section:", error);
        return { error: 'Произошла ошибка при создании раздела' };
    }
}


export const EditSectionPosition = async (sectionId: string, position: number) => {

    const existingSection = await db.section.findUnique({
            where: {
                id: sectionId
            },
            include: { course: true },
        });

    if (!existingSection) {
        return { error: 'Раздел не найден' };
    }

    const user = await currentUser()

    if (!user || user.id !== existingSection.course.creatorId) {
        return { error: "Вы не авторизованы" };
    }


    try {
        const section = await db.section.update({
            where: {
                id: sectionId
            },
            data: {
                position: position
            }
        });

        const sections = await getSectionsByCourseId(section.courseId);

        return { success: 'Позиция раздела изменена', sections: sections};
    }
    catch (error) {
        console.error("Error updating section position:", error);
        return { error: 'Произошла ошибка при изменении позиции раздела' };
    }

}