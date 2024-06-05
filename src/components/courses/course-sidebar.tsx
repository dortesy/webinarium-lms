import CourseSections from '@/components/courses/course-sections';
import { SectionWithLessons } from '@/lib/types/course';

interface CourseSidebarProps {
    sections: SectionWithLessons[]
    courseId: string
}

const CourseSidebar = ({sections, courseId}: CourseSidebarProps) => {
  return (
    <div className="bg-web-gray fixed left-0 top-0 w-[315px] h-full z-10 overflow-y-scroll text-white pt-24 pl-6 pr-6">
        <CourseSections sections={sections} courseId={courseId}/>
    </div>
  )
}

export default CourseSidebar;