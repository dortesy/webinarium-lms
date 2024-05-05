'use client'
import {ROUTES} from "@/config/routes";
import {Category, Course, Media} from "@prisma/client";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useState, useTransition} from "react";
import {CourseDeletion} from "@/actions/course/course-deletion";
import {useToast} from "@/components/ui/use-toast";
import DeleteDialog from "@/components/dashboard/teacher/course/dialog/delete-dialog";

interface CourseWithImage extends Course {
    image?: Media | null;
    category?: Category | null;
}
interface CourseListProps {
    initialCourses: CourseWithImage[]
}
const CourseList = ({initialCourses}: CourseListProps) => {
    const [courses, setCourses] = useState(initialCourses);
    const { toast } = useToast()
    const [isPending, startTransition] = useTransition();
    const removeCourse = (id: string) => () => {
        startTransition(() => {
            CourseDeletion(id).then((data) => {
                if('error' in data){
                    toast({
                        variant: "destructive",
                        title: "Произошла ошибка",
                        description: data.error,
                    })
                }

                if('success' in data){
                    setCourses(courses.filter(course => course.id !== id));
                    toast({
                        variant: "success",
                        title: "Курс удален",
                        description: data.success,
                    })
                }
            })
        });
    }



    return (

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
                        <CardFooter className="flex justify-between">
                          <a href={ROUTES.TEACHER.COURSE.DETAILS(course.id)}><Button variant="outline">Редактировать</Button></a>
                            <DeleteDialog dialogTrigger={<Button variant="destructive" >Удалить</Button>} dialogDescription="Это действие нельзя отменить. Это навсегда удалит ваш курс и все данные курса с наших серверов." removeData={removeCourse(course.id)} />
                        </CardFooter>
                    </Card>
                ))}
            </div>
    );
}

export default CourseList;