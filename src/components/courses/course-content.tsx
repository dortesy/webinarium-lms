'use client'

import { CourseWithCategory, LessonWithVideo } from '@/lib/types/course';
import CourseInformation from '@/components/courses/course-information';
import LessonContent from '@/components/courses/lesson-content';

interface CourseContentProps {
  course: CourseWithCategory;
  lesson?: LessonWithVideo;
}

const CourseContent = ({course, lesson}: CourseContentProps) => {
  console.log(lesson)
  return (
    lesson ? <LessonContent lesson={lesson}/>:  <CourseInformation course={course}  />
  )
}

export default CourseContent;
