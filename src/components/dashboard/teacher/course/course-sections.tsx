'use client'
import {Lesson, Media, Section} from '@prisma/client';
import {Button} from "@/components/ui/button";
import {SectionSchemaType} from "@/schemas/courses/course.schema";
import {useTranslations} from "next-intl";
import {useId, useTransition, useState, useMemo, useCallback} from "react";
import {CreateSection} from "@/actions/course/create-section";
import {useToast} from "@/components/ui/use-toast";
import SectionDialog from "@/components/dashboard/teacher/course/dialog/section-dialog";
import {EditSection, EditSectionPosition} from "@/actions/course/edit-section";
import DeleteSection from "@/actions/course/delete-section";
import {DndContext, DragEndEvent, DragOverEvent, closestCenter} from '@dnd-kit/core';
import SectionItem from "@/components/dashboard/teacher/course/section-item";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {
    restrictToVerticalAxis,
  } from '@dnd-kit/modifiers';

import { SectionWithLessons } from "@/lib/types/course";

interface CourseSectionsProps{
    initialSections: SectionWithLessons[];
    courseId: string;
}

const CourseSections =  ({initialSections, courseId}: CourseSectionsProps) => {
    const [sections, setSections] = useState<SectionWithLessons[]>(initialSections)
    const [error, setError] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const t = useTranslations("CourseOutlinePage");
    const { toast } = useToast()


    const onSubmit = useCallback((values: SectionSchemaType) => {
        values.courseId = courseId;

        setError('');
        startTransition(() => {
            if (values.id) {
                EditSection(values).then((data) => {
                    if ('error' in data) {
                        setError(data.error);
                    } else {
                        toast({
                            title: `${t('sectionEdited')}`,
                            description: `${t('sectionEditedSuccess', { title: values.title })}`,
                        });
                        if ('section' in data) {
                            setSections((prev) => {
                                return prev.map((section) => {
                                    if (section.id === data.section.id) {
                                        return {
                                            ...section,
                                            title: data.section.title,
                                            description: data.section.description,
                                        };
                                    }
                                    return section;
                                });
                            });
                        }
                    }
                });
            } else {
                CreateSection(values).then((data) => {
                    if ('error' in data) {
                        setError(data.error);
                    } else {
                        toast({
                            title: `${t('sectionAdded')}`,
                            description: `${t('sectionAddedSuccess', { title: values.title })}`,
                        });
                        if ('section' in data) {
                            setSections((prev) => {
                                return [
                                    ...prev,
                                    {
                                        ...data.section,
                                        id: data.section.id,
                                        lessons: [],
                                    },
                                ];
                            });
                        }
                    }
                });
            }
        });
    }, [courseId, setError, startTransition, toast, t]);

// Inside the CourseSections component
const onDelete = useCallback((sectionId: string) => () => {
    setError('');
    startTransition(() => {
        DeleteSection(sectionId).then((data) => {
            if ('error' in data) {
                setError(data.error);
            } else {
                toast({
                    title: `${t('sectionDeleted')}`,
                    description: `${t('sectionDeletedSuccess')}`,
                });
                setSections((prev) => {
                    return prev.filter((section) => section.id !== sectionId);
                });
            }
        });
    });
}, [setError, startTransition, toast, t]);

    const handleDragEnd = (event: DragEndEvent) => {
        
        const { active, over } = event;
        console.log('what')
        
        if (!active || !over || active.id === over.id) {
            return;
        }


        const activeIndex = sections.findIndex((section) => section.id === active.id)
        const overIndex = sections.findIndex((section) => section.id === over.id)

        if (activeIndex === overIndex) {
            return; // Нет необходимости обновлять, если позиции не изменились
        }


        const newPosition = calculateNewPosition(sections, activeIndex, overIndex);
        const newSections = [...sections];
        newSections.splice(overIndex, 0, newSections.splice(activeIndex, 1)[0]);
        setSections(newSections);


        startTransition(() => {
            EditSectionPosition(active.id as string, newPosition)
                .then((data) => {
                    if ('error' in data) {
                        setError(data.error);
                    } else {
                        // toast({
                        //     title: 'Раздел перемещен',
                        //     description: 'Раздел был успешно перемещен',
                        // });
                        setTimeout(() => {updateSectionsOrder(data.sections);}, 500);

                    }
                })
                .catch(error => {
                    console.error('Failed to move section:', error);
                    setError('Ошибка при перемещении раздела');
                });
        });

    }


    const updateSectionsOrder = (newSections: SectionWithLessons[]) => {
        setSections((prevSections) => {
            // Создаем новый массив с текущими секциями
            let updatedSections = [...prevSections];

            // Обновляем элементы в массиве
            newSections.forEach(newSection => {
                const index = updatedSections.findIndex(sec => sec.id === newSection.id);
                if (index !== -1) {
                    updatedSections[index] = newSection;
                }
            });

            return updatedSections;
        });
    };


    const calculateNewPosition = (sections: Section[], activeIndex: number, overIndex: number): number => {
        console.log('calculate new position')
        if (overIndex > activeIndex) {
            const nextSection = sections[overIndex + 1];
            const targetSection = sections[overIndex];
            return nextSection ? (targetSection.position + nextSection.position) / 2 : targetSection.position + 1;
        } else {
            const previousSection = sections[overIndex - 1];
            const targetSection = sections[overIndex];
            return previousSection ? (previousSection.position + targetSection.position) / 2 : targetSection.position / 2;
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        
        console.log('drag over', event)
        if(!event.over) {
            console.log('no over')
            return
        }
        console.log('over', event.over)
    }

    const sectionsWithItems = useMemo(() => {
        return sections.map((section) =>  <SectionItem key={section.id} section={section} onDelete={onDelete(section.id)} onSubmit={onSubmit} />)
    }, [onDelete, onSubmit, sections])


    const sectionIds = useMemo(() => {
        return sections.map((section) => section.id)
    }, [sections])
    const id = useId()

    return (
            <div>
                <DndContext   onDragEnd={handleDragEnd} id={id} modifiers={[restrictToVerticalAxis]} onDragOver={handleDragOver} collisionDetection={closestCenter}>

                {!sections.length && <div>Для добавление уроков пожалуйста добавьте необходимые разделы</div>}
                <SectionDialog 
                            dialogTitle={t('addForm.section.dialogTitle')}
                            dialogTrigger={<Button>{t('addSection')}</Button>}
                            dialogDescription={t.rich('addForm.section.formDescription', { br: () => <br /> })}
                            dialogFooterButton={t('add')}
                            onSubmit={onSubmit}/>


                {/*render sections*/}
                <div className="pt-8 pb-8 overflow-y-hidden">
                        <SortableContext items={sectionIds}>
                            {sectionsWithItems}
                        </SortableContext>
                </div>
                
                 </DndContext>
            </div>

    )
}

export default CourseSections