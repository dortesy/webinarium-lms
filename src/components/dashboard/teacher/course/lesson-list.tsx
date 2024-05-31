'use client'

import { useTranslations } from "next-intl";
import { useId, useRef, useState, useTransition } from "react";
import LessonItem from "./lesson-item";
import LessonDialog from "./dialog/lesson-dialog";
import { Plus } from "lucide-react";
import { CreateLesson } from "@/actions/course/create-lesson";
import { LessonSchemaType } from "@/schemas/courses/course.schema";
import { ZodError } from "zod";
import { EditLesson } from "@/actions/course/edit-lesson";
import DeleteLesson from "@/actions/course/delete-lesson";
import { LessonWithVideo } from "@/lib/types/course";
import { DndContext, DragEndEvent, DragOverEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import EditLessonPosition from "@/actions/course/edit-lesson-position";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface LessonListProps {
  initialLessons: LessonWithVideo[];
  sectionId: string;
}

const LessonList = ({ initialLessons, sectionId }: LessonListProps) => {
  const t = useTranslations('CourseOutlinePage');
  const [lessons, setLessons] = useState<LessonWithVideo[]>(initialLessons);
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("");

  const handleSubmit = (values: LessonSchemaType) => {
    values.sectionId = sectionId
    startTransition(() => {
      CreateLesson(values).then((data) => {
        if (Array.isArray(data) && data.every((item) => item instanceof ZodError)) {
          console.error("Validation errors:", data);
        } else if ('error' in data) {
          console.error(data.error);
          toast({
              title: "Ошибка",
              description: data.error,
              variant: "destructive",
          })
        } else if ('lesson' in data) {
          setLessons((prevLessons) => [...prevLessons, { ...data.lesson, isNew: true }]);
          
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
                    toast({
                        title: "Ошибка",
                        description: data.error,
                        variant: "destructive",
                    })
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

  const calculateNewPosition = (lessons: LessonWithVideo[], activeIndex: number, overIndex: number): number => {
    if (overIndex > activeIndex) {
        const nextLesson = lessons[overIndex + 1];
        const targetLesson = lessons[overIndex];
        return nextLesson ? (targetLesson.position + nextLesson.position) / 2 : targetLesson.position + 1;
    } else {
        const previousLesson = lessons[overIndex - 1];
        const targetLesson = lessons[overIndex];
        return previousLesson ? (previousLesson.position + targetLesson.position) / 2 : targetLesson.position / 2;
    }
};

  const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (!active || !over || active.id === over.id) {
          return;
      }

      const activeIndex = lessons.findIndex((lesson) => lesson.id === active.id);
      const overIndex = lessons.findIndex((lesson) => lesson.id === over.id);

      if (activeIndex === overIndex) {
          return;
      }

      const newPosition = calculateNewPosition(lessons, activeIndex, overIndex);
      const newLessons = [...lessons];
      newLessons.splice(overIndex, 0, newLessons.splice(activeIndex, 1)[0]);
      setLessons(newLessons);

      startTransition(() => {
          EditLessonPosition(active.id as string, newPosition)
              .then((data) => {
                  if ('error' in data) {
                      setError(data.error);
                  } else {
                      setTimeout(() => { updateLessonsOrder(data.lessons); }, 500);
                  }
              })
              .catch(error => {
                  console.error('Failed to move lesson:', error);
                  setError('Ошибка при перемещении урока');
              });
      });
  };

  const updateLessonsOrder = (newLessons: LessonWithVideo[]) => {
    setLessons((prevLessons) => {
        let updatedLessons = [...prevLessons];
        newLessons.forEach(newLesson => {
            const index = updatedLessons.findIndex(lesson => lesson.id === newLesson.id);
            if (index !== -1) {
                updatedLessons[index] = newLesson;
            }
        });
        return updatedLessons;
    });
  };

  const id = useId()

  return (
    <div className="flex flex-col gap-4 pt-4">
        <DndContext onDragEnd={handleDragEnd} id={id} modifiers={[restrictToVerticalAxis]} collisionDetection={closestCenter}>
            <SortableContext items={lessons.map(lesson => lesson.id)} strategy={verticalListSortingStrategy}>
                {lessons.length > 0 && <div className="flex flex-col gap-4">
                    {lessons.map((lesson, index) => (
                        <LessonItem key={lesson.slug} lesson={lesson} index={index} t={t} handleUpdate={handleUpdate} handleDelete={handleDelete} handleVideoUpload={handleVideoUpload} isNew={lesson.isNew} />
                    ))}
                </div>}
            </SortableContext>
        </DndContext>
        <div className="pl-4">
            <LessonDialog 
                dialogTitle={t('addForm.lesson.dialogTitle')}
                dialogTrigger={<Button className="flex items-center gap-1 text-sm cursor-pointer" variant="addLesson"><Plus width={16} height={16}/>Добавить урок</Button> } 
                dialogDescription={t.rich('addForm.lesson.formDescription', {br: () => <br/>})}
                dialogFooterButton={t('addForm.lesson.dialogFooterButton')} onSubmit={handleSubmit} />
        </div>
    </div>
    
  );
};


LessonList.displayName = 'LessonList';
export default LessonList;
