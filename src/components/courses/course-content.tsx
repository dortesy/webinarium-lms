
import { CourseWithCategory, LessonWithVideo } from '@/lib/types/course';
import CourseInformation from '@/components/courses/course-information';
import LessonContent from '@/components/courses/lesson-content';

interface CourseContentProps {
  course: CourseWithCategory;
  lesson?: LessonWithVideo;
}

const CourseContent = ({course, lesson}: CourseContentProps) => {


  //loading state?
  //what if no course or lesson?

  return (
    lesson ? <LessonContent lesson={lesson}/>:  <CourseInformation course={course}  />
  )
}

export default CourseContent;
