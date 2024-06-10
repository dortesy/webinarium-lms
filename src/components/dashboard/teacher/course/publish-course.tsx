"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getCourseById } from "@/lib/course/course-helper";
import { useEffect, useState } from "react";
import { SquareArrowUpRight } from 'lucide-react';

interface PublishCourseProps {
    courseId: string;
}

const PublishCourse = ({courseId}: PublishCourseProps) => {

    const [CourseStatus, setCourseStatus] = useState<boolean>(false)

    
    useEffect(() => {
        const getCourseStatus = async () => {
            const course = await getCourseById(courseId)  // Corrected variable name to match the case
            if (course && course.status === "PUBLISHED") {
                setCourseStatus(true)
                return true
            }
        }
        getCourseStatus()
        console.log(CourseStatus)
    }, [CourseStatus])

    const onChangeSwitch = () => {
        console.log(CourseStatus)
        setCourseStatus(!CourseStatus)
    }

    return ( 
    <Button variant={CourseStatus ? "default" : "disabled"} className="cursor-pointer" asChild><div className="flex items-center mx-2 gap-2 w-[95%]">
            <SquareArrowUpRight size={18} strokeWidth={1} />
            <Label htmlFor="publish-course"  className="cursor-pointer" >{CourseStatus ? "Курс опубликован" : "Курс не опубликован"}</Label>
    </div>
  </Button>
  );
};

export default PublishCourse;