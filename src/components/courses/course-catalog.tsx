'use client'
//import course from prisma
import CourseCatalogItem from '@/components/courses/course-catalog-item';
import { CourseWithImage } from '@/lib/types/course';

interface CourseCatalogProps {
  courses: CourseWithImage[]
}
const CourseCatalog = ({courses}: CourseCatalogProps) => {
  return (
    <div className="w-full mt-12 mb-12 grid grid-cols-5 gap-4">
      {courses.map((course) => (
        <CourseCatalogItem course={course} key={course.id}/>
      ))}
    </div>
  )
}


export default CourseCatalog;