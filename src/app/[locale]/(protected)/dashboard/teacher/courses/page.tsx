import CourseList from '@/components/dashboard/teacher/course/course-list';
import { currentUser } from '@/lib/auth';
import { getAllUserCourses } from '@/lib/course/course-helper';
import { redirect } from '@/navigation';
import { ROUTES } from '@/config/routes';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('CourseList');
  return {
    title: t('title'),
  };
}

const MyCoursesPage = async () => {
  const t = await getTranslations('CourseList');
  const user = await currentUser();
  
  if (!user) {
    return <div>{t('noAccess')}</div>;
  }

  const courses = await getAllUserCourses(user.id!);

  if (courses?.length === 0) {
    redirect(ROUTES.TEACHER.ADD_COURSE);
  } else {
    return <CourseList initialCourses={courses} />;
  }
};

export default MyCoursesPage;
