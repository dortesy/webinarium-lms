"use server"
import { LessonSchema, LessonSchemaType } from "@/schemas/courses/course.schema";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getSectionById } from "@/lib/course/course-helper";
import slugify from "slugify";

export const EditLesson = async (values: LessonSchemaType) => {
    const t = await getTranslations("CourseOutlinePage");
    const lessonSchema = LessonSchema(t);
    const validatedFields = lessonSchema.safeParse(values);

    if (!validatedFields.success) {
        return validatedFields.error.errors;
    }

    const { id, title, description, sectionId } = values;

    if (!id || !title || !sectionId) {
        return { error: "Lesson ID, title, and section ID are required" };
    }

    const existingSection = await getSectionById(sectionId);

    if (!existingSection) {
        return { error: 'Раздел не найден' };
    }

    const user = await currentUser();

    if (!user || user.id !== existingSection.course.creatorId) {
        return { error: "Вы не авторизованы" };
    }

    try {
        const lesson = await db.lesson.update({
            where: { id },
            data: {
                title: title.trim(),
                slug: slugify(title.trim(), { lower: true }),
                description: description,
                section: {
                    connect: { id: sectionId }
                }
            }
        });

        return { success: 'Lesson updated', lesson: lesson };
    } catch (error) {
        console.error("Error updating lesson:", error);
        return { error: 'Произошла ошибка при обновлении урока' };
    }
};