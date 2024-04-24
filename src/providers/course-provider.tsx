'use client'
import {CourseContext} from "@/context/course-context";
import {ReactNode, useState} from "react";

interface CourseProviderProps {
    children: ReactNode;
}
export default function CourseProvider({ children }: CourseProviderProps) {
    const [courseTitle, setCourseTitle] = useState("");

    return (
        <CourseContext.Provider value={{ courseTitle, setCourseTitle }}>
            {children}
        </CourseContext.Provider>
    );
}