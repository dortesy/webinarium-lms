import {db} from "@/lib/db";
import {cache} from "react"

export const getCourseById = async (id: string) => {
    try {
        return await db.course.findUnique({ where: {id: id }});
    } catch {
        return null;
    }
}

