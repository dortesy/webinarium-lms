"use server"

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getLessonById, getSectionById } from "@/lib/course/course-helper";

const EditLessonPosition = async (lessonId: string, position: number) => {
    const existingLesson = await getLessonById(lessonId);

    if (!existingLesson) {
        return { error: 'Урок не найден' };
    }

    const section = await getSectionById(existingLesson.sectionId);

    if (!section) {
        return { error: 'Раздел не найден' };
    }

    const user = await currentUser();

    if (!user || user.id !== section.course.creatorId) {
        return { error: "Вы не авторизованы" };
    }

    try {
        await db.lesson.update({
            where: { id: lessonId },
            data: { position: position }
        });

        const lessons = await db.lesson.findMany({
            where: { sectionId: section.id },
            orderBy: { position: 'asc' },
            include: { video: true }
        });

        return { success: 'Позиция урока изменена', lessons: lessons };
    } catch (error) {
        console.error("Error updating lesson position:", error);
        return { error: 'Произошла ошибка при изменении позиции урока' };
    }
};

export default EditLessonPosition;