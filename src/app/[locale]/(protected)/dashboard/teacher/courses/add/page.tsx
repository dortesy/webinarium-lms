import { CreateCourseForm } from '@/components/dashboard/teacher/course/create-course-form';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('CreateCourseForm');
  return { title: t('title') };
}

const MyCoursesPage = () => {
  return <CreateCourseForm />;
};

export default MyCoursesPage;
