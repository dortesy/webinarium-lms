"use server"
import {db} from "@/lib/db";
import {cache} from "react"

export const getCourseById = async (id: string) => {
    try {
        return await db.course.findUnique({ where: {id: id },  include: {image: true}});
    } catch {
        return null;
    }
}



export const getAllUserCourses = async (userId: string) => {
    try {
        return await db.course.findMany({ where: {creatorId: userId}, include: {image: true, category: true}, orderBy: [{createdAt: 'desc'}] });
    } catch {
        return null;
    }
}