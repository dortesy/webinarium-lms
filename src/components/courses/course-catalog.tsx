'use client'
//import course from prisma
import CourseCatalogItem from '@/components/courses/course-catalog-item';
import { CourseWithImage } from '@/lib/types/course';

interface CourseCatalogProps {
  courses: CourseWithImage[]
}
const CourseCatalog = ({courses}: CourseCatalogProps) => {
  return (
    <>
    <h2 className="text-4xl font-bold mb-4 mt-12">Список курсов</h2>
    <div className="w-full mt-2 mb-12 grid grid-cols-5 gap-4">
      {courses.map((course) => (
        <CourseCatalogItem course={course} key={course.id}/>
      ))}
    </div>
    </>
  )
}


export default CourseCatalog;