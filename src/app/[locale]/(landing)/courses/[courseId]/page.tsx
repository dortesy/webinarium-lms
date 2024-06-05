import { Metadata, ResolvingMetadata } from 'next';
import { getCourseById, getCourseByIdWithSections } from '@/lib/course/course-helper';
import CourseSidebar from '@/components/courses/course-sidebar';
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import { Captions, ListTodo, Newspaper, Presentation, ShieldCheck, Timer, UsersRound } from 'lucide-react';
import { Rating } from '@/components/custom-ui/rating';
import { Badge } from '@/components/ui/badge';
import { getTranslations } from 'next-intl/server';
import styles from '@/styles/course-description.module.css';
import CourseContent from '@/components/courses/course-content';
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
  const t = await getTranslations('ENUM');
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

  console.log(lesson)
  return (
    <>
      <CourseSidebar sections={course.sections} courseId={course.id}/>

    <div className="ml-[290px] h-full min-h-screen bg-stone-50 rounded-t-xl relative z-10 pt-10 pl-10 pr-10 flex gap-4">
      <CourseContent course={course} lesson={lesson}/>
    </div>
    </>
  );
}

export default CoursePage;