import { SectionWithLessons } from '@/lib/types/course';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface CourseSectionsProps {
    sections: SectionWithLessons[]
}
const CourseSections = ({sections}: CourseSectionsProps) => {
    return (
        <div>
          <div className="border-b pb-2 border-neutral-700">
            <a href="/">Главная страница курса</a>
          </div>
            {sections.map(section => (
              <Accordion type="multiple">
                <AccordionItem value={section.id} className="border-b-0 text-left [data-state=open]:text-white">
                  <AccordionTrigger className="text-gray-400 [&[data-state=open]]:text-white">{section.title}</AccordionTrigger>
                  <AccordionContent>
                    {section.lessons.map((lesson, index) => (

                      <div key={lesson.id} className="mb-4">
                        <span className="text-white border-gray-500 leading-none  mr-2 inline-flex items-center justify-center text-xs inset-1  w-6 h-6 rounded-full border mb-1 mt-1">{index+1}</span>
                        <span className="inline mt-1 font-light text-sm align-middle">{lesson.title}</span>
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