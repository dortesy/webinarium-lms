import CourseList from "@/components/dashboard/teacher/course/course-list";
import {currentUser} from "@/lib/auth";
import {getAllUserCourses} from "@/lib/course/course-helper";
import {redirect} from "@/navigation";
import {ROUTES} from "@/config/routes";
import {Button} from "@/components/ui/button";
const MyCoursesPage = async () => {

    const user = await currentUser();
    if (!user) {
        return <div>У вас нет доступка к редактированию этого курса</div>
    }

    const courses = await getAllUserCourses(user.id!);

    if (courses?.length === 0) {
        redirect(ROUTES.TEACHER.ADD_COURSE)
    }

    return (
        <div>
            <h2 className="text-4xl font-extrabold dark:text-white">Список ваших курсов</h2>
            <p className="my-4 text-sm text-gray-500">На этой странице вы найдете все ваши добавленные курсы</p>
            <Button asChild className="mb-5"><a href={ROUTES.TEACHER.ADD_COURSE}>Добавить новый курс</a></Button>

            <CourseList initialCourses={courses}/>
        </div>
    );
}


export default MyCoursesPage;