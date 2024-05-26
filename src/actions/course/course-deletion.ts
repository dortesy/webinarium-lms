'use server'

import {currentUser} from "@/lib/auth";
import {db} from "@/lib/db";
import exp from "node:constants";

export const CourseDeletion = async (id: string) => {
    const user = await currentUser()

    if (!user) {
        return { error: "Вы не авторизованы" };
    }

    const courseExists = await db.course.findFirst({
        where: {
            id: id,
            creatorId: user.id,
        },
    });

    if (!courseExists) {
        return { error: 'Курс не найден, либо у вас нет доступа для удаления этого курса' };
    }

    try {
        await db.course.delete({
            where: {
                id: id,
            },
        });

        return { success: 'Курс удален'};
    } catch (error) {
        console.error("Error deleting course:", error);
        return { error: 'Произошла ошибка при удалении курса' };
    }

}

