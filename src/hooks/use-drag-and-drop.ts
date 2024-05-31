import { useCallback } from 'react';
import { SectionWithLessons } from "@/lib/types/course";
import { EditSectionPosition } from "@/actions/course/edit-section";

export const useDragAndDrop = (sections: SectionWithLessons[], setSections: (sections: SectionWithLessons[]) => void, setError: (error: string | undefined) => void, updateSectionsOrder: (sections: SectionWithLessons[]) => void) => {
    const handleDragEnd = useCallback((event: any) => {
        const { active, over } = event;
        
        if (!active || !over || active.id === over.id) {
            return;
        }

        const activeIndex = sections.findIndex((section) => section.id === active.id);
        const overIndex = sections.findIndex((section) => section.id === over.id);

        if (activeIndex === overIndex) {
            return; // No need to update if positions are unchanged
        }

        const newPosition = calculateNewPosition(sections, activeIndex, overIndex);
        const newSections = [...sections];
        newSections.splice(overIndex, 0, newSections.splice(activeIndex, 1)[0]);
        setSections(newSections);

        EditSectionPosition(active.id as string, newPosition)
            .then((data) => {
                if ('error' in data) {
                    setError(data.error);
                } else {
                    setTimeout(() => {updateSectionsOrder(data.sections);}, 500);
                }
            })
            .catch(error => {
                console.error('Failed to move section:', error);
                setError('Error moving section');
            });
    }, [sections, setSections, setError, updateSectionsOrder]);

    return { handleDragEnd };
};

const calculateNewPosition = (sections: SectionWithLessons[], activeIndex: number, overIndex: number): number => {
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