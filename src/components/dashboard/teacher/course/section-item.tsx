'use client'
import {Button} from "@/components/ui/button";
import SectionDialog from "@/components/dashboard/teacher/course/dialog/section-dialog";
import {GripVertical, Pencil, Trash2} from "lucide-react";
import DeleteDialog from "@/components/dashboard/teacher/course/dialog/delete-dialog";
import * as React from "react";
import {Section} from "@prisma/client";
import {useTranslations} from "next-intl";
import {SectionSchemaType} from "@/schemas/courses/course.schema";
import {useDraggable} from "@dnd-kit/core";
import {CSS} from '@dnd-kit/utilities';
import {useSortable} from "@dnd-kit/sortable";

interface SectionItemProps {
    section: Section,
    onDelete: (id: string) => void
    onSubmit: (values: SectionSchemaType) => void;

}
const SectionItem = ({ section, onDelete, onSubmit }:SectionItemProps ) => {
    const t = useTranslations('CourseOutlinePage');

    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: section.id});
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const handleOnSubmit = (values: SectionSchemaType) => {
        onSubmit(values)
    }
    const handleOnDelete = () => {
        onDelete(section.id)
    }

    return (
        <div className="border border-gray-200 p-3 rounded-lg mt-3 bg-white" style={style}  ref={setNodeRef} >
        <div className="flex justify-between items-center" >
            <div>
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <p className="text-sm">{section.description}</p>
            </div>
            <div className="flex items-center">
                <Button size="icon" variant="ghost" className="mr-2">
                    <SectionDialog dialogTrigger={<Pencil/>}
                                   dialogDescription={t.rich('addForm.section.formDescription', {br: () => <br/>})}
                                   dialogFooterButton='Редактировать' onSubmit={handleOnSubmit}
                                   defaultValues={{
                                       id: section.id,
                                       title: section.title,
                                       description: section.description!
                                   }}/>
                </Button>
                <Button size="icon" variant="ghost">
                    <DeleteDialog dialogTrigger={<Trash2/>}
                                  dialogDescription="Вы уверены что хотите удалить этот раздел?"
                                  removeData={handleOnDelete}/>
                </Button>

                <div  {...listeners} {...attributes}>
                    <GripVertical />
                </div>
            </div>
        </div>

    </div>
    )
}

SectionItem.displayName = 'SectionItem'
export default SectionItem