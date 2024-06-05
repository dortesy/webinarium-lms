import { Metadata, ResolvingMetadata } from 'next';
import { getCourseById, getCourseByIdWithSections } from '@/lib/course/course-helper';
import CourseSidebar from '@/components/courses/course-sidebar';
import { getTranslations } from 'next-intl/server';
import CourseContent from '@/components/courses/course-content';
import { Suspense } from 'react'
type Props = {
  params: { courseId: string }

}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const courseId = params.courseId;
  const course = await getCourseById(courseId);

  if (!course) {
    return {
      title: 'Webinarium - Курс не найден',
    }
  }

  return {
    title: `${course.title} - Редактирование курса` ?? 'Загрузка...',
  }
}

const CoursePage = async ({ params, searchParams }: { params: { courseId: string }, searchParams?: { [key: string]: string | string[] | undefined }; }) => {

  const sectionIndex = searchParams?.section ? parseInt(searchParams.section as string, 10) : undefined;
  const lessonIndex = searchParams?.lesson ? parseInt(searchParams.lesson as string, 10) : undefined;
  const course = await getCourseByIdWithSections(params.courseId);
  if(!course) {
    return <div>Course not found</div>
  }
  let lesson = undefined;
  if (sectionIndex !== undefined && lessonIndex !== undefined) {
    const section = course.sections[sectionIndex];
    lesson = section ? section.lessons[lessonIndex] : undefined;
  }
  return (
    <>
      <CourseSidebar sections={course.sections} courseId={course.id}/>
      <div className="ml-[290px] h-full min-h-screen bg-stone-50 rounded-t-xl relative z-10 pt-10 pl-10 pr-10 flex gap-4">
         <CourseContent course={course} lesson={lesson}/>
      </div>
    </>
  );
}

const Page = async ({ params, searchParams }: { params: { courseId: string }, searchParams?: { [key: string]: string | string[] | undefined }; }) => {
  return (
    <Suspense fallback={<p>Идет загрузка</p>}>
    <CoursePage params={params} searchParams={searchParams}/>
    </Suspense>
  )
}

export default Page;