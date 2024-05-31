import CourseList from "@/components/dashboard/teacher/course/course-list";
import {currentUser} from "@/lib/auth";
import {getAllUserCourses, getCourseById} from "@/lib/course/course-helper";
import {redirect} from "@/navigation";
import {ROUTES} from "@/config/routes";
import {Button} from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";



export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('CourseList');
    return {
        title: t('title'),
    };
}

const MyCoursesPage = async () => {
    const t = await getTranslations('CourseList');
    const user = await currentUser();
    if (!user) {
        return <div>{t('noAccess')}</div>
    }

    const courses = await getAllUserCourses(user.id!);

    if (courses?.length === 0) {
        redirect(ROUTES.TEACHER.ADD_COURSE)
    }

    return (
        <div>
            <h2 className="text-4xl font-extrabold dark:text-white">{t('title')}</h2>
            <p className="my-4 text-sm text-gray-500">{t('description')}</p>
            <Button asChild className="mb-5">
                <a href={ROUTES.TEACHER.ADD_COURSE}>{t('addNewCourse')}</a>
            </Button>

            <CourseList initialCourses={courses}/>
        </div>
    );
}


export default MyCoursesPage;