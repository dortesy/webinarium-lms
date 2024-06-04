"use server"
import {db} from "@/lib/db";
import {cache} from "react"
import {Prisma} from "@prisma/client";


export const getCourseById = async (id: string) => {
    try {
        return await db.course.findUnique({
            where: { id: id },
            include: { image: true, category: true, creator: true }
        });
    } catch {
        return null;
    }
}


export const getAllCourses = async () => {
    try {
        return await db.course.findMany({
            include: { image: true, category: true, creator: true},
            orderBy: { createdAt: Prisma.SortOrder.desc }
        });
    } catch {
        return [];
    }
}

export const getCourseByIdWithSections = async (id: string) => {
    try {
        return await db.course.findUnique({
            where: { id: id },
            include: {
                image: true,
                category: true,
                creator: true,
                sections: {
                    orderBy: {
                        position: Prisma.SortOrder.asc  // Сортируем по полю position в порядке возрастания
                    },
                    include: {
                        lessons: {
                            orderBy: {
                                position: Prisma.SortOrder.asc  // Сортируем по полю position в порядке возрастания
                            },
                            include: {
                                video: true
                            }
                        }
                    }
                }
            }
        });

    } catch {
        return null;
    }
}



export const getAllUserCourses = async (userId: string) => {
    try {
        return await db.course.findMany({
            where: { creatorId: userId },
            include: { image: true, category: true },
            orderBy: { createdAt: Prisma.SortOrder.desc }
        });

    } catch {
        return [];
    }
}



export const getSectionsByCourseId = async (courseId: string) => {
    try {
        return await db.section.findMany({
            where: { courseId: courseId },
            include: { lessons: { include: { video: true } } },
            orderBy: {
                position: Prisma.SortOrder.asc  // Сортируем по полю position в порядке возрастания
            }

        });
    } catch {
        return [];
    }
}

export const getSectionById = async (id: string) => {
    try {
        return await db.section.findUnique({
            where: { id: id },
            include: {
                course: true,
                lessons: {
                    orderBy: {
                        position: Prisma.SortOrder.asc
                    }
                }
            }
        });
    } catch {
        return null;
    }
}


export const getLessonById = async (id: string) => {
    try {
        return await db.lesson.findUnique({
            where: { id: id },
            include: { section: true, video: true }
        });
    } catch {
        return null;
    }
}

export const getLessonBySlug = async (slug: string, sectionId: string) => {
    try {
        return await db.lesson.findFirst({
            where: { slug: slug, sectionId: sectionId },
            include: { section: true, video: true }
        });
    } catch {
        return null;
    }
}

