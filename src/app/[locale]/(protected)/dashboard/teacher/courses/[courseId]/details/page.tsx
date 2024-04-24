import { Metadata, ResolvingMetadata } from 'next'
import {getCourseById} from "@/lib/course/course-helper";
import {EditCourseForm} from "@/components/dashboard/teacher/course/edit-course-form";
import {getAllCategories} from "@/lib/category/category-helper";
import {CourseContext} from "@/context/course-context";
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
    const course = await getCourseById(params.courseId);
    const categories = await getAllCategories();

    if (!course) {
        return <div>Course not found</div>
    }


    return (
        <div><EditCourseForm course={course} categories={categories}/></div>
    )
}