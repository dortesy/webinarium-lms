import { Metadata } from 'next';
import { getCourseById } from '@/lib/course/course-helper';
import { getAllCategories } from '@/lib/category/category-helper';
import EditCourseForm from '@/components/dashboard/teacher/course/edit-course-form';
import { currentUser } from '@/lib/auth';
import { Suspense } from 'react';
import EditCourseFormSkeleton from '@/components/dashboard/teacher/course/skeletons/edit-course-form-skeleton';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { courseId: string };
};
//
// export const dynamic = 'force-dynamic';
// const getCourse = cache(
//   async (id: string) => await getCourseByIdWithSections(id),
// );

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations('EditCourseForm');
  const courseId = params.courseId;
  const course = await getCourseById(courseId);

  if (!course) {
    return {
      title: t('errors.courseNotFound'),
    };
  }

  return {
    title: `${course.title} - ${t('pageTitle')}`,
  };
}

export default async function Page({ params }: Props) {
  const CoursePage = async () => {
    const user = await currentUser();
    const t = await getTranslations('EditCourseForm');

    if (!user) {
      return <div>{t('errors.noAccess')}</div>;
    }
    const course = await getCourseById(params.courseId);

    if (!course) {
      return <div>{t('errors.courseNotFound')}</div>;
    }

    if (user.id !== course.creatorId) {
      return <div>{t('errors.noAccess')}</div>;
    }

    const categories = await getAllCategories();

    return <EditCourseForm course={course} categories={categories} />;
  };

  return (
    <Suspense fallback={<EditCourseFormSkeleton />}>
      <CoursePage />
    </Suspense>
  );
}
