import CourseSections from '@/components/courses/course-sections';
import { SectionWithLessons } from '@/lib/types/course';

interface CourseSidebarProps {
    sections: SectionWithLessons[]
}

const CourseSidebar = ({sections}: CourseSidebarProps) => {
  return (
    <div className="bg-web-gray fixed left-0 top-0 w-[315px] h-full z-10 overflow-y-scroll text-white pt-24 pl-6 pr-6">
        <CourseSections sections={sections} />
    </div>
  )
}

export default CourseSidebar;