import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import CourseSidebar from '@/components/courses/course-sidebar';
import React from 'react';
import { CourseWithSections } from '@/lib/types/course';
import { MonitorPlay } from 'lucide-react';

interface CourseSidebarMobileProps {
  course: CourseWithSections;
}

export const CourseSidebarMobile = ({ course }: CourseSidebarMobileProps) => (
  <Sheet modal={false}>
    <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition dark:text-gray-100">
      <MonitorPlay />
    </SheetTrigger>
    <SheetContent
      side="left"
      className="max-w-full p-4 pt-8 bg-white overflow-hidden "
    >
      {course && (
        <CourseSidebar sections={course.sections} courseId={course.id} />
      )}
    </SheetContent>
  </Sheet>
);
