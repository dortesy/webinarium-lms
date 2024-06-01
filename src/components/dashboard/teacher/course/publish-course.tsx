"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getCourseById } from "@/lib/course/course-helper";
import { useEffect, useState } from "react";

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
    <Button variant={CourseStatus ? "published" : "disabled"} className="cursor-pointer" asChild><div className="flex items-center mx-2 gap-2 w-[95%]">
        <Switch id="publish-course" onCheckedChange={onChangeSwitch} className="data-[state=checked]:bg-emerald-900 data-[state=unchecked]:bg-input" />
            <Label htmlFor="publish-course"  className="cursor-pointer" >{CourseStatus ? "Курс опубликован" : "Курс не опубликован"}</Label>
    </div>
  </Button>
  );
};

export default PublishCourse;