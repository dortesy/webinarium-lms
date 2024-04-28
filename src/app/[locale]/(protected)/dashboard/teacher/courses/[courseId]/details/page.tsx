import { Metadata, ResolvingMetadata } from 'next'
import {getCourseById} from "@/lib/course/course-helper";
import {EditCourseFormOld} from "@/components/dashboard/teacher/course/edit-course-form-old";
import {getAllCategories} from "@/lib/category/category-helper";
import {CourseContext} from "@/context/course-context";
import EditCourseForm from "@/components/dashboard/teacher/course/edit-course-form";
import {currentUser} from "@/lib/auth";
type Props = {
    params: { courseId: string }

}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const courseId = params.courseId;
    const course = await getCourseById(courseId);

    if (!course) {
        return {
            title: 'Webinarium - Курс не найден',
        }
    }

    return {
        title: course.title ?? 'Загрузка...',
    }
}



export default async function CoursePage({ params }: { params: { courseId: string } }) {

    const user = await currentUser();
    if (!user) {
        return <div>У вас нет доступка к редактированию этого курса</div>
    }

    const course = await getCourseById(params.courseId);

    if (!course) {
        return <div>Course not found</div>
    }

    if (user.id !== course.creatorId) {
        return <div>У вас нет доступка к редактированию этого курса</div>
    }

    const categories = await getAllCategories();



    return (
        <div><EditCourseForm course={course} categories={categories}/></div>
    )
}