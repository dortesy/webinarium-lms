'use client'
import {Button} from "@/components/ui/button";
import SectionDialog from "@/components/dashboard/teacher/course/dialog/section-dialog";
import {GripVertical, Pencil, Trash} from "lucide-react";
import DeleteDialog from "@/components/dashboard/teacher/course/dialog/delete-dialog";
import * as React from "react";
import {useTranslations} from "next-intl";
import {SectionSchemaType} from "@/schemas/courses/course.schema";
import {CSS} from '@dnd-kit/utilities';
import {useSortable} from "@dnd-kit/sortable";
import LessonList from "./lesson-list";
import { SectionWithLessons } from "@/lib/types/course";


interface SectionItemProps {
    section: SectionWithLessons,
    onDelete: (id: string) => void
    onSubmit: (values: SectionSchemaType) => void;

}
const SectionItem = ({ section, onDelete, onSubmit }:SectionItemProps ) => {

    const t = useTranslations('CourseOutlinePage');

    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id: section.id});
    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    }

    const handleOnSubmit = (values: SectionSchemaType) => {
        onSubmit(values)
    }
    const handleOnDelete = () => {
        onDelete(section.id)
    }

    return (
        <div  style={style} ref={setNodeRef} >
         <div className="flex justify-between items-center py-3 px-6 rounded-lg mt-3 bg-white shadow-sm" >
            <div>
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <p className="text-sm">{section.description}</p>
            </div>
            <div className="flex items-center">
                
                    <SectionDialog 
                                   dialogTitle={t('addForm.section.dialogTitleEdit')}
                                   dialogTrigger={<Button size="icon" variant="ghost" className="mr-2"><Pencil width={16} height={16}/> </Button>}
                                   dialogDescription={t.rich('addForm.section.formDescriptionEdit', {br: () => <br/>})}
                                   dialogFooterButton='Редактировать' onSubmit={handleOnSubmit}
                                   defaultValues={{
                                       id: section.id,
                                       title: section.title,
                                       description: section.description!
                                   }}/>
                
                
                    <DeleteDialog dialogTrigger={<Button size="icon" variant="ghost"><Trash width={16} height={16}/></Button>}
                                  dialogDescription={t('addForm.section.dialogDelete')}
                                  removeData={handleOnDelete}/>
                

                <div  {...listeners} {...attributes}>
                    <GripVertical width={20} height={20} />
                </div>
            </div>
        </div>

      {!isDragging && (
        <LessonList initialLessons={section.lessons} sectionId={section.id} />
      )}

    </div>
    )
}

SectionItem.displayName = 'SectionItem'
export default SectionItem