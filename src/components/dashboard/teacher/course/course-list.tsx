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
import DeleteDialog from "@/components/dashboard/teacher/course/dialog/delete-dialog";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";


interface CourseWithImage extends Course {
    image?: Media | null;
    category?: Category | null;
}
interface CourseListProps {
    initialCourses: CourseWithImage[]
}
const CourseList = ({initialCourses}: CourseListProps) => {
    const [courses, setCourses] = useState(initialCourses);
    const [isPending, startTransition] = useTransition();
    const tEnum = useTranslations('ENUM');
    const tCourseList = useTranslations('CourseList');
  

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
                        title: "Курс удален",
                        description: data.success,
                    })
                }
            })
        });
    }


    const stripAndTruncate = (text: string, length: number) => {
        const strippedText = text.replace(/(<([^>]+)>)/ig, '');
        if (strippedText.length <= length) return strippedText;
        return strippedText.slice(0, length) + '...';
      };

      


  

    return (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {courses.map(course => (


                    <div key={course.id} className="shadow-md rounded-xl relative transition-all duration-300 hover:shadow-lg">
                         <Link href={ROUTES.TEACHER.COURSE.DETAILS(course.id)} className="absolute inset-0 w-full h-full z-10">
                         </Link>
                        <div className="rounded-t-xl overflow-hidden">
                            {course.image && <Image src={course.image.url} alt={course.title} width={200} height={200} className="w-full h-40 object-cover" />}
                        </div>

                       
                        <div className="flex px-2 justify-between mt-2">
                            <Badge variant="secondary">{tEnum(`CourseStatus.${course.status!}`)}</Badge>
                            <div className="text-sm text-gray-500">{course.category?.name}</div>
                        </div>

                        <div className="px-4 py-4">
                            <h3 className="text-md font-bold">{course.title}</h3>
                        </div>
                    </div>
                    

                    // <Card key={course.id} className="flex flex-col px-2 justify-between">
                    //     <CardHeader>
                    //         <CardTitle>{course.title}</CardTitle>
                    //         <CardDescription>{course.category?.name}</CardDescription>
                    //     </CardHeader>
                    //     <CardContent>
                    //         {course.image && <Image src={course.image.url} alt={course.title} width={200} height={200} className="w-full h-40 object-cover" />}
                    //     </CardContent>
                    //     <CardFooter className="flex justify-between">
                    //       <a href={ROUTES.TEACHER.COURSE.DETAILS(course.id)}><Button variant="outline">Редактировать</Button></a>
                    //         <DeleteDialog dialogTrigger={<Button variant="destructive" >Удалить</Button>} dialogDescription="Это действие нельзя отменить. Это навсегда удалит ваш курс и все данные курса с наших серверов." removeData={removeCourse(course.id)} />
                    //     </CardFooter>
                    // </Card>
                ))}
            </div>
    );
}

export default CourseList;