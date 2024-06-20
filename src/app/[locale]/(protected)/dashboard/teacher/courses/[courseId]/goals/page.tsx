import { Metadata, ResolvingMetadata } from 'next';
import {
  getCourseById,
  getCourseByIdWithSections,
  getOnlyCourseById,
} from '@/lib/course/course-helper';
import { getAllCategories } from '@/lib/category/category-helper';
import EditCourseForm from '@/components/dashboard/teacher/course/edit-course-form';
import { currentUser } from '@/lib/auth';
import { cache, Suspense } from 'react';
import EditCourseFormSkeleton from '@/components/dashboard/teacher/course/skeletons/edit-course-form-skeleton';
import CourseGoalsForm from '@/components/dashboard/teacher/course/course-goals-form';

type Props = {
  params: { courseId: string };
};

const getCourse = cache(async (id: string) => await getOnlyCourseById(id));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const courseId = params.courseId;
  const course = await getCourse(courseId);

  if (!course) {
    return {
      title: 'Webinarium - Курс не найден',
    };
  }

  return {
    title: `${course.title} - Цели обучения ` ?? 'Загрузка...',
  };
}

export default async function Page({
  params,
}: {
  params: { courseId: string };
}) {
  const CourseGoalsPage = async () => {
    const user = await currentUser();

    if (!user) {
      return <div>У вас нет доступка к редактированию этого курса</div>;
    }
    const course = await getCourse(params.courseId);

    if (!course) {
      return <div>Course not found</div>;
    }

    if (user.id !== course.creatorId) {
      return <div>У вас нет доступка к редактированию этого курса</div>;
    }

    return <CourseGoalsForm course={course} />;
  };

  return (
    <Suspense fallback={<EditCourseFormSkeleton />}>
      <CourseGoalsPage />
    </Suspense>
  );
}
