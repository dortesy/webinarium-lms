import { Lesson } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import LessonItem from "./lesson-item";
import LessonDialog from "./dialog/lesson-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateLesson } from "@/actions/course/create-lesson";
import { LessonSchemaType } from "@/schemas/courses/course.schema";

interface LessonListProps {
  initialLessons: Lesson[];
  sectionId: string;
}

const LessonList = ({ initialLessons, sectionId }: LessonListProps) => {
  const t = useTranslations('CourseOutlinePage');
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [isPending, startTransition] = useTransition()


  const handleSubmit = (values: LessonSchemaType) => {
    values.sectionId = sectionId
    startTransition(() => {
      CreateLesson(values).then((data) => {
        if ('error' in data) {
          console.error(data.error);
        } else {
          setLessons((prevLessons) => [...prevLessons, data.lesson]);
        }
      });
    });
  };



  
  return (
    <div className="flex flex-col gap-4 mt-4">

      <div className="flex flex-col gap-4 ">
        {lessons.map((lesson, index) => (
          <LessonItem key={lesson.slug} lesson={lesson} index={index} />
        ))}
      </div>


      <div>
        <LessonDialog 
        dialogTrigger={<div className="flex items-center gap-1 text-sm cursor-pointer"><Plus width={16} height={16}/> Добавить урок</div> } 
        dialogDescription={t('addForm.lesson.description')} 
        dialogFooterButton="Добавить урок" onSubmit={handleSubmit} />
      </div>

    </div>
    
  );
};


LessonList.displayName = 'LessonList';
export default LessonList;
