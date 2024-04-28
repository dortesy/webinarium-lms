'use client'
import {ROUTES} from "@/config/routes";
import {Category, Course, Media} from "@prisma/client";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";


interface CourseWithImage extends Course {
    image?: Media | null;
    category?: Category | null;
}
interface CourseListProps {
    courses: CourseWithImage[]
}
const CourseList = ({courses}: CourseListProps) => {

    console.log(courses)

    return (
        <div>
        <h1>Course List</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {courses.map(course => (

                    <Card key={course.id} className="flex flex-col px-2 justify-between">
                        <CardHeader>
                            <CardTitle>{course.title}</CardTitle>
                            <CardDescription>{course.category?.name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {course.image && <img src={course.image.url} alt={course.title} className="w-full h-40 object-cover" />}
                        </CardContent>
                        <CardFooter>
                          <a href={ROUTES.TEACHER.COURSE.DETAILS(course.id)}><Button variant="outline">Редактировать</Button> </a>
                        </CardFooter>
                    </Card>
                    // <div  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                    //     <h2 className="text-xl font-bold dark:text-white">{course.title}</h2>
                    //     <p className="text-gray-500 dark:text-gray-300">{course.description}</p>
                    //     <a href={ROUTES.TEACHER.COURSE.DETAILS(course.id)} className="text-blue-500 dark:text-blue-400">Подробнее</a>
                    // </div>
                ))}
            </div>

        </div>
    );
}

export default CourseList;