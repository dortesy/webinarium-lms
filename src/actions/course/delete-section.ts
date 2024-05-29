"use server"

import {db} from "@/lib/db";
import {currentUser} from "@/lib/auth";
import { deleteFile } from "@/lib/media/delete-file";

const DeleteSection = async (sectionId: string) => {

    const existingSection = await db.section.findUnique({
        where: {
            id: sectionId
        },
        include: {
            course: true,
            lessons: {
                include: {
                    video: true
                }
            }
        }
        
    });

    if (!existingSection) {
        return { error: 'Раздел не найден' };
    }

    const user = await currentUser()

    if (!user || user.id !== existingSection.course.creatorId) {
        return { error: "Вы не авторизованы" };
    }




    try {

        const lessons = existingSection.lessons;
        for (const lesson of lessons) {
            if (lesson.video) {
                 deleteFile(lesson.video.url);
            }
        }

        await db.section.delete({
            where: {
                id: sectionId
            }
        });


        return { success: 'Раздел удален' };
    } catch (error) {
        console.error("Error deleting section:", error);
        return { error: 'Произошла ошибка при удалении раздела' };
    }


}

export default DeleteSection;