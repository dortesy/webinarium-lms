import { getCourseByIdWithSections } from '@/lib/course/course-helper';
import CourseProvider from './course-provider';
import { getAllCategories } from '@/lib/category/category-helper';

import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Страница курса',
  description: 'На этой странице вы можете редактировать курс',
};

export default function CourseLayout({
  children,
  params, // will be a page or nested layout
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) {
  return (
    <Suspense fallback={<h2>KONSKIY HUY</h2>}>
      <CoursePage />
    </Suspense>
  );

  async function CoursePage() {
    const course = await getCourseByIdWithSections(params.courseId);
    const categories = await getAllCategories();

    if (!course) {
      return '<div>Course not found</div>';
    }

    return (
      <CourseProvider value={{ course, categories }}>{children}</CourseProvider>
    );
  }
}
