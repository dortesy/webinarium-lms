import React from 'react';
import { SectionWithLessons } from "@/lib/types/course";
import SectionItem from "@/components/dashboard/teacher/course/section-item";
import { SortableContext } from "@dnd-kit/sortable";

interface SectionListProps {
    sections: SectionWithLessons[];
    onDelete: (sectionId: string) => () => void;
    onSubmit: (values: any) => void;
}

const SectionList: React.FC<SectionListProps> = ({ sections, onDelete, onSubmit }) => {
    const sectionsWithItems = sections.map((section) => (
        <SectionItem key={section.id} section={section} onDelete={onDelete(section.id)} onSubmit={onSubmit} />
    ));

    return (
        <div className="pt-8 pb-8 overflow-y-hidden">
            <SortableContext items={sections.map(section => section.id)}>
                {sectionsWithItems}
            </SortableContext>
        </div>
    );
};

export default SectionList;