import { Metadata, ResolvingMetadata } from 'next';
import {
  getCourseById,
  getCourseByIdWithSections,
} from '@/lib/course/course-helper';
import CourseSidebar from '@/components/courses/course-sidebar';
import { Suspense } from 'react';
import LessonContent from '@/components/courses/lesson-content';
import CourseInformation from '@/components/courses/course-information';

type Params = {
  params: { courseId: string };
};

type CoursePageProps = Params & {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Params,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const courseId = params.courseId;
  const course = await getCourseById(courseId);

  if (!course) {
    return {
      title: 'Webinarium - Course not found',
    };
  }

  return {
    title: `${course.title} - Webinarium`,
  };
}

const CoursePage = async ({ params, searchParams }: CoursePageProps) => {
  const course = await getCourseByIdWithSections(params.courseId);

  if (!course) {
    return <div>Course not found</div>;
  }

  const sectionIndex = searchParams?.section
    ? parseInt(searchParams.section as string, 10)
    : undefined;
  const lessonIndex = searchParams?.lesson
    ? parseInt(searchParams.lesson as string, 10)
    : undefined;

  // Implementation of the logic to get the previous and next lesson links
  let lesson;
  let prevLessonLink = null;
  let nextLessonLink = null;
  if (sectionIndex !== undefined && lessonIndex !== undefined) {
    prevLessonLink =
      lessonIndex === 0
        ? sectionIndex === 0
          ? null
          : `/courses/${params.courseId}/?section=${sectionIndex - 1}&lesson=${course.sections[sectionIndex - 1].lessons.length - 1}`
        : `/courses/${params.courseId}/?section=${sectionIndex}&lesson=${lessonIndex - 1}`;
    nextLessonLink =
      lessonIndex === course.sections[sectionIndex].lessons.length - 1
        ? sectionIndex === course.sections.length - 1
          ? null
          : `/courses/${params.courseId}/?section=${sectionIndex + 1}&lesson=0`
        : `/courses/${params.courseId}/?section=${sectionIndex}&lesson=${lessonIndex + 1}`;
    lesson = course.sections[sectionIndex]?.lessons[lessonIndex];
  }

  return (
    <>
      <CourseSidebar sections={course.sections} courseId={course.id} />
      <div className="sm:ml-[290px] h-full min-h-screen bg-stone-50 rounded-t-xl relative z-10 p-5 md:p-10 flex gap-4 flex-col md:flex-row">
        {lesson ? (
          <LessonContent
            lesson={lesson}
            prevLessonLink={prevLessonLink}
            nextLessonLink={nextLessonLink}
          />
        ) : (
          <CourseInformation course={course} />
        )}
      </div>
    </>
  );
};

const Page = async ({
  params,
  searchParams,
}: {
  params: { courseId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  return (
    <Suspense fallback={<p>Идет загрузка</p>}>
      <CoursePage params={params} searchParams={searchParams} />
    </Suspense>
  );
};

export default Page;
