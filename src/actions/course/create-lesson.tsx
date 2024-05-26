"use server"
import {LessonSchema, LessonSchemaType} from "@/schemas/courses/course.schema";
import {getTranslations} from "next-intl/server";
import {db} from "@/lib/db";
import {currentUser} from "@/lib/auth";
import {Prisma} from "@prisma/client";
import {getSectionById} from "@/lib/course/course-helper";
import slugify from "slugify";

export const CreateLesson = async (values: LessonSchemaType) => {
    const t = await getTranslations("CourseOutlinePage")
    const lessonSchema = LessonSchema(t);
    const validatedFields = lessonSchema.safeParse(values);
    console.log(validatedFields)

    if (!validatedFields.success) {
        return validatedFields.error.errors;
    }

    const { title, description, sectionId } = values;

    if (!title || !sectionId) {
        return { error: "Lesson title is required" };
    }

    const existingSection = await getSectionById(sectionId);

    if (!existingSection) {
        return { error: 'Раздел не найден' };
    }
    const user = await currentUser()

    if (!user || user.id !== existingSection.course.creatorId) {
        return { error: "Вы не авторизованы" };
    }

    const lastLesson = await db.lesson.findFirst({
        where: {
            sectionId: sectionId
        },
        orderBy: {
            position: Prisma.SortOrder.desc
        }
    });

    const position = lastLesson ? lastLesson.position + 1 : 1;

    try {
        const lesson = await db.lesson.create({
            data: {
                title: title.trim(),
                slug: slugify(title.trim(), { lower: true }),
                description: description,
                section: {
                    connect: {
                        id: sectionId
                    }
                },
                position: position,
            },
            include: {
                video: true
            }
        });

        return { success: 'Lesson created', lesson: lesson };
    } catch (error) {
        console.error("Error creating lesson:", error);
        return { error: 'Произошла ошибка при создании урока' };
    }
}