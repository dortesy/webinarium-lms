import { Metadata } from 'next';
import {
  getCourseById,
  getCourseByIdWithSections,
} from '@/lib/course/course-helper';
import { getAllCategories } from '@/lib/category/category-helper';
import EditCourseForm from '@/components/dashboard/teacher/course/edit-course-form';
import { currentUser } from '@/lib/auth';
import { cache, Suspense } from 'react';
import EditCourseFormSkeleton from '@/components/dashboard/teacher/course/skeletons/edit-course-form-skeleton';

type Props = {
  params: { courseId: string };
};

const getCourse = cache(
  async (id: string) => await getCourseByIdWithSections(id),
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const courseId = params.courseId;
  const course = await getCourseById(courseId);

  if (!course) {
    return {
      title: 'Webinarium - Курс не найден',
    };
  }

  return {
    title: `${course.title} - Редактирование курса` ?? 'Загрузка...',
  };
}

export default async function Page({
  params,
}: {
  params: { courseId: string };
}) {
  const CoursePage = async () => {
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

    const categories = await getAllCategories();

    return <EditCourseForm initialCourse={course} categories={categories} />;
  };

  return (
    <Suspense fallback={<EditCourseFormSkeleton />}>
      <CoursePage />
    </Suspense>
  );
}

// 'use client';
// import { CourseContext } from '@/app/[locale]/(protected)/dashboard/teacher/courses/[courseId]/course-provider';
// import { useContext, useEffect, useState } from 'react';
// import EditCourseForm from '@/components/dashboard/teacher/course/edit-course-form';
// import { CourseFull } from '@/lib/types/course';
// import { CategoryData } from '@/lib/types/category';
// import EditCourseFormSkeleton from '@/components/dashboard/teacher/course/skeletons/edit-course-form-skeleton';
//
// const CoursePage = () => {
//   const [course, setCourse] = useState<CourseFull>();
//   const [categories, setCategories] = useState<CategoryData[]>();
//   const context = useContext(CourseContext);
//
//   useEffect(() => {
//     setCategories(context.categories);
//     setCourse(context.course);
//     if (context.course) document.title = context.course.title;
//   }, []);
//
//   if (!course || !categories) {
//     return <EditCourseFormSkeleton />;
//   }
//
//   return (
//     <>
//       <EditCourseForm course={course} categories={categories} />
//     </>
//   );
// };
//
// export default CoursePage;
