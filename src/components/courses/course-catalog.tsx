//import course from prisma
import CourseCatalogItem from '@/components/courses/course-catalog-item';
import { CourseWithImage } from '@/lib/types/course';
import { getAllCourses } from '@/lib/course/course-helper';

const CourseCatalog =  async () => {
  const courses = await getAllCourses();
  return (
    <>
      <h2 className="text-4xl font-bold mb-4 mt-12">Список курсов</h2>
      <div
        className="w-full mt-2 mb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {courses.map((course) => (
          <CourseCatalogItem course={course} key={course.id} />
        ))}
      </div>

    </>
  )
}


export default CourseCatalog;