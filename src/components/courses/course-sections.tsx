'use client'
import { SectionWithLessons } from '@/lib/types/course';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface CourseSectionsProps {
    sections: SectionWithLessons[]
    courseId: string
}
const CourseSections = ({sections, courseId}: CourseSectionsProps) => {
  const searchParams = useSearchParams()
    const searchSectionIndex = searchParams.get('section') ? parseInt(searchParams.get('section') as string, 10) : undefined;
    const searchLessonIndex = searchParams.get('lesson') ? parseInt(searchParams.get('lesson') as string, 10) : undefined;
    const activeStyle = "text-indigo-400"
    console.log(searchSectionIndex, searchLessonIndex)
    return (
        <div>
          <div className="border-b pb-2 border-neutral-700">
            <Link href={`/courses/${courseId}`}>Главная страница курса</Link>
          </div>
            {sections.map((section, sectionIndex) => (
              <Accordion key={section.id} type="single" collapsible defaultValue={searchSectionIndex === sectionIndex ? section.id : undefined}>
                <AccordionItem value={section.id} className="border-b-0 text-left [data-state=open]:text-white">
                  <AccordionTrigger className="text-gray-400 [&[data-state=open]]:text-white">{section.title}</AccordionTrigger>
                  <AccordionContent>
                    {section.lessons.map((lesson, lessonIndex) => (

                      <div key={lesson.id} className="mb-4">
                        <Link href={`?section=${sectionIndex}&lesson=${lessonIndex}`} className={`${searchLessonIndex === lessonIndex && searchSectionIndex === sectionIndex ? 'text-indigo-400' : ''} block group hover:text-blue-400 `}>
                          <span className={`text-white border-gray-500 leading-none mr-2 inline-flex items-center justify-center text-xs inset-1  w-6 h-6 rounded-full border mb-1 mt-1 group-hover:text-blue-400 group-hover:border-blue-400  ${searchLessonIndex === lessonIndex && searchSectionIndex === sectionIndex ? 'text-indigo-400 border-indigo-400' : ''}`}>{lessonIndex+1}</span>
                          <span className="inline mt-1 font-light text-sm align-middle">
                            {lesson.title}
                          </span>
                        </Link>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}


        </div>
    )
}

export default CourseSections;