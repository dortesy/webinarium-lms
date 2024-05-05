'use client'
import * as React from "react";
import {Lesson, Section} from '@prisma/client';
import {Button} from "@/components/ui/button";
import {SectionSchemaType} from "@/schemas/courses/course.schema";
import {useTranslations} from "next-intl";
import {useId, useTransition} from "react";
import {CreateSection} from "@/actions/course/create-section";
import {useToast} from "@/components/ui/use-toast";
import SectionDialog from "@/components/dashboard/teacher/course/dialog/section-dialog";
import {EditSection, EditSectionPosition} from "@/actions/course/edit-section";
import DeleteSection from "@/actions/course/delete-section";
import {DndContext, DragEndEvent} from '@dnd-kit/core';
import SectionItem from "@/components/dashboard/teacher/course/section-item";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
interface SectionsWithLessons extends Section {
    lessons: Lesson[];
}
interface CourseSectionsProps{
    initialSections: SectionsWithLessons[];
    courseId: string;
}

const CourseSections = ({initialSections, courseId}: CourseSectionsProps) => {
    const [sections, setSections] = React.useState<SectionsWithLessons[]>(initialSections)
    const [error, setError] = React.useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const t = useTranslations("CourseOutlinePage");
    const { toast } = useToast()


    const onSubmit = (values: SectionSchemaType) => {
        values.courseId = courseId

        setError('')
        startTransition(() => {

            if(values.id) {
                EditSection(values).then((data) => {
                    if('error' in data) {
                        setError(data.error)
                    } else {
                        toast({
                            title: `Раздел изменен`,
                            description: `Название раздела было успешно изменено на "${values.title}"`,
                        })
                        if('section' in data) {
                            setSections((prev) => {
                                return prev.map((section) => {
                                    if(section.id === data.section.id) {
                                        return {
                                            ...section,
                                            title: data.section.title,
                                            description: data.section.description
                                        }
                                    }
                                    return section
                                })
                            })
                        }
                    }
                })

                //EditSection
            } else {
                CreateSection(values).then((data) => {
                    if ('error' in data) {
                        setError(data.error)
                    } else {
                        toast({
                            title: `Раздел добавлен`,
                            description: `Раздел ${values.title} был успешно добавлен к курсу`,
                        })
                        if('section' in data) {
                            setSections((prev) => {
                                return [
                                    ...prev,
                                    {
                                        ...data.section,
                                        id: data.section.id,
                                        lessons: []
                                    }
                                ]
                            })


                        }
                    }
                })
            }



        })
    }

    const onDelete = (sectionId: string) => () =>  {
        console.log('huy', sectionId)
        setError('')
        startTransition(() => {
            DeleteSection(sectionId).then((data) => {
                if('error' in data) {
                    setError(data.error)
                } else {
                    toast({
                        title: `Раздел удален`,
                        description: `Раздел был успешно удален`,
                    })
                    setSections((prev) => {
                        return prev.filter((section) => section.id !== sectionId)
                    })
                }
            })
        })
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
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
                        toast({
                            title: 'Раздел перемещен',
                            description: 'Раздел был успешно перемещен',
                        });
                        setTimeout(() => {updateSectionsOrder(data.sections);}, 500);

                    }
                })
                .catch(error => {
                    console.error('Failed to move section:', error);
                    setError('Ошибка при перемещении раздела');
                });
        });

    }


    const updateSectionsOrder = (newSections: SectionsWithLessons[]) => {
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


    const id = useId()

    return (
        <div>
            {!sections.length && <div>Для добавление уроков пожалуйста добавьте необходимые разделы</div>}
            <SectionDialog dialogTrigger={<Button>{t('addSection')}</Button>}
                           dialogDescription={t.rich('addForm.section.formDescription', { br: () => <br /> })}
                           dialogFooterButton={t('add')}
                           onSubmit={onSubmit}/>


            {/*render sections*/}
            <DndContext onDragEnd={handleDragEnd} id={id}>
                <div className="mt-5">
                    <SortableContext items={sections.map(section => section.id)} strategy={verticalListSortingStrategy}>
                        {sections.map((section, index) => (
                            <SectionItem key={section.id} section={section} onDelete={onDelete(section.id)} onSubmit={onSubmit} />
                        ))}
                    </SortableContext>
                </div>
            </DndContext>
        </div>
    )
}

export default CourseSections