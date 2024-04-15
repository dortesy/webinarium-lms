import { Metadata, ResolvingMetadata } from 'next'
import {getCourseById} from "@/lib/course/course-helper";
import {EditCourseForm} from "@/components/dashboard/teacher/course/edit-course-form";
import {getAllCategories} from "@/lib/category/category-helper";
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
            title: 'Course not found',
        }
    }

    return {
        title: course.title ?? 'Loading...',
    }
}



export default async function CoursePage({ params }: { params: { courseId: string } }) {
    //const course = trpc.courseRouter.getCourseById.fetch({ courseId: params.courseId });
    const course = await getCourseById(params.courseId);
    const categories = await getAllCategories();

    if (!course) {
        return <div>Course not found</div>
    }


    return <div><EditCourseForm course={course} categories={categories}/></div>
}