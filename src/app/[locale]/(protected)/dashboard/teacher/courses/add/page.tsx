import {AddCourseForm} from "@/components/dashboard/teacher/course/add-course-form";

const MyCoursesPage = () => {


    return (
        <div>
            <h2 className="text-4xl font-extrabold dark:text-white">Добавить курс</h2>
            <p className="my-4 text-sm text-gray-500">Начните с указания названия вашего будущего курса. Оно должно быть лаконичным, привлекательным и информативным, чтобы потенциальные студенты сразу поняли, чему они смогут научиться.</p>

            <AddCourseForm />
        </div>
    );
}


export default MyCoursesPage;