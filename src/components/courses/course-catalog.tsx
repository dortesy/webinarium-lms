//import course from prisma
import CourseCatalogItem from '@/components/courses/course-catalog-item';
import { getAllCourses } from '@/lib/course/course-helper';
import { getTranslations } from 'next-intl/server';

const CourseCatalog = async () => {
  const courses = await getAllCourses();
  const t = await getTranslations('CourseCatalog');
  return (
    <main className="p-4 md:p-0">
      <h2 className="text-4xl font-bold mb-4 mt-12">{t('title')}</h2>
      <div className="w-full mt-2 mb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {courses.map((course) => (
          <CourseCatalogItem course={course} key={course.id} />
        ))}
      </div>
    </main>
  );
};

export default CourseCatalog;
