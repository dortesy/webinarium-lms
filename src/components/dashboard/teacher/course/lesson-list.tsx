import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import LessonItem from "./lesson-item";
import LessonDialog from "./dialog/lesson-dialog";
import { Plus } from "lucide-react";
import { CreateLesson } from "@/actions/course/create-lesson";
import { LessonSchemaType } from "@/schemas/courses/course.schema";
import { ZodError } from "zod";
import { EditLesson } from "@/actions/course/edit-lesson";
import DeleteLesson from "@/actions/course/delete-lesson";
import { LessonWithVideo } from "@/lib/types/course";

interface LessonListProps {
  initialLessons: LessonWithVideo[];
  sectionId: string;
}

const LessonList = ({ initialLessons, sectionId }: LessonListProps) => {
  const t = useTranslations('CourseOutlinePage');
  const [lessons, setLessons] = useState<LessonWithVideo[]>(initialLessons);
  const [isPending, startTransition] = useTransition()


  const handleSubmit = (values: LessonSchemaType) => {
    values.sectionId = sectionId
    startTransition(() => {
      CreateLesson(values).then((data) => {
        if (Array.isArray(data) && data.every((item) => item instanceof ZodError)) {
          console.error("Validation errors:", data);
        } else if ('error' in data) {
          console.error(data.error);
        } else if ('lesson' in data) {
          setLessons((prevLessons) => [...prevLessons, data.lesson]);
        }
        
      });
    });
  };

  
    const handleUpdate = (values: LessonSchemaType) => {
        startTransition(() => {
            EditLesson(values).then((data) => {
                if (Array.isArray(data) && data.every((item) => item instanceof ZodError)) {
                    console.error("Validation errors:", data);
                } else if ('error' in data) {
                    console.error(data.error);
                } else if ('lesson' in data) {
                    setLessons((prevLessons) => prevLessons.map(lesson => lesson.id === data.lesson.id ? data.lesson : lesson));
                }
            });
        });
      };


      const handleDelete = (lessonId: string) => {
        startTransition(() => {
            DeleteLesson(lessonId).then((data) => {
                if ('error' in data) {
                    console.error(data.error);
                } else {
                    setLessons((prevLessons) => prevLessons.filter(lesson => lesson.id !== lessonId));
                }
            });
        });
    };
  

    const handleVideoUpload = (updatedLesson: LessonWithVideo) => {
      setLessons((prevLessons) => prevLessons.map(lesson => lesson.id === updatedLesson.id ? updatedLesson : lesson));
  };


  return (
    <div className="flex flex-col gap-4 pt-4">

    { lessons.length > 0 && <div className="flex flex-col gap-4">
        {lessons.map((lesson, index) => (
          <LessonItem key={lesson.slug} lesson={lesson} index={index} t={t}  handleUpdate={handleUpdate} handleDelete={handleDelete} handleVideoUpload={handleVideoUpload} />
        ))}
    </div>}


      <div>
        <LessonDialog 
        dialogTitle={t('addForm.lesson.dialogTitle')}
        dialogTrigger={<div className="flex items-center gap-1 text-sm cursor-pointer"><Plus width={16} height={16}/> Добавить урок</div> } 
        dialogDescription={t.rich('addForm.lesson.formDescription', {br: () => <br/>})}
        dialogFooterButton={t('addForm.lesson.dialogFooterButton')} onSubmit={handleSubmit} />
      </div>

    </div>
    
  );
};


LessonList.displayName = 'LessonList';
export default LessonList;
