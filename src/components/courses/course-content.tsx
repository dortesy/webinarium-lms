import { CourseWithCategory, LessonWithVideo } from '@/lib/types/course';
import CourseInformation from '@/components/courses/course-information';
import LessonContent from '@/components/courses/lesson-content';

interface CourseContentProps {
  course: CourseWithCategory;
  lesson?: LessonWithVideo;
  prevLessonLink: string | null;
  nextLessonLink: string | null;
}

const CourseContent = ({
  course,
  lesson,
  prevLessonLink,
  nextLessonLink,
}: CourseContentProps) => {
  return lesson ? (
    <LessonContent
      lesson={lesson}
      prevLessonLink={prevLessonLink}
      nextLessonLink={nextLessonLink}
    />
  ) : (
    <CourseInformation course={course} />
  );
};

export default CourseContent;
