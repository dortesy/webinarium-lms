'use client';

import { createContext, ReactNode } from 'react';
import { CourseFull } from '@/lib/types/course';
import { CategoryData } from '@/lib/types/category';

type CourseContext = {
  course: CourseFull | undefined;
  categories: CategoryData[] | [];
};

export const CourseContext = createContext<CourseContext>({
  course: undefined,
  categories: [],
});

export default function CourseProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: CourseContext;
}) {
  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
}
