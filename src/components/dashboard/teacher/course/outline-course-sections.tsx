'use client';
import { Button } from '@/components/ui/button';
import { SectionSchemaType } from '@/schemas/courses/course.schema';
import { useTranslations } from 'next-intl';
import { useCallback, useId, useState, useTransition } from 'react';
import { CreateSection } from '@/actions/course/create-section';
import { toast } from '@/components/ui/use-toast';
import SectionDialog from '@/components/dashboard/teacher/course/dialog/section-dialog';
import { EditSection } from '@/actions/course/edit-section';
import DeleteSection from '@/actions/course/delete-section';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import { SectionWithLessons } from '@/lib/types/course';
import SectionList from './section-list';
import { useDragAndDrop } from '@/hooks/use-drag-and-drop';
import { usePathname } from '@/navigation';

interface CourseSectionsProps {
  initialSections: SectionWithLessons[];
  courseId: string;
}

const OutlineCourseSections = ({
  initialSections,
  courseId,
}: CourseSectionsProps) => {
  const [sections, setSections] =
    useState<SectionWithLessons[]>(initialSections);
  const [error, setError] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const t = useTranslations('CourseOutlinePage');

  const updateSectionsOrder = useCallback(
    (newSections: SectionWithLessons[]) => {
      setSections((prevSections) => {
        let updatedSections = [...prevSections];
        newSections.forEach((newSection) => {
          const index = updatedSections.findIndex(
            (sec) => sec.id === newSection.id,
          );
          if (index !== -1) {
            updatedSections[index] = newSection;
          }
        });
        return updatedSections;
      });
    },
    [],
  );

  const { handleDragEnd } = useDragAndDrop(
    sections,
    setSections,
    setError,
    updateSectionsOrder,
    pathname,
  );

  const onSubmit = (values: SectionSchemaType) => {
    values.courseId = courseId;

    setError('');
    startTransition(() => {
      if (values.id) {
        EditSection(values, pathname).then((data) => {
          if ('error' in data) {
            setError(data.error);
            toast({
              variant: 'destructive',
              title: `${t('errors.genericError')}`,
              description: data.error,
            });
          } else {
            if ('section' in data) {
              toast({
                title: `${t('sectionEdited')}`,
                description: `${t('sectionEditedSuccess', { title: values.title })}`,
              });

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
        CreateSection(values, pathname).then((data) => {
          if ('error' in data) {
            setError(data.error);
          } else {
            if ('section' in data) {
              toast({
                title: `${t('sectionAdded')}`,
                description: `${t('sectionAddedSuccess', { title: values.title })}`,
              });
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
  };

  // Inside the CourseSections component
  const onDelete = (sectionId: string) => () => {
    setError('');
    startTransition(() => {
      DeleteSection(sectionId, pathname).then((data) => {
        if ('error' in data) {
          setError(data.error);
        } else {
          setSections((prev) => {
            return prev.filter((section) => section.id !== sectionId);
          });

          toast({
            title: `${t('sectionDeleted')}`,
            description: `${t('sectionDeletedSuccess')}`,
          });
        }
      });
    });
  };

  const id = useId();

  return (
    <div>
      <DndContext
        onDragEnd={handleDragEnd}
        id={id}
        modifiers={[restrictToVerticalAxis]}
        collisionDetection={closestCenter}
      >
        {!sections.length && (
          <div className="text-sm text-gray-700 mb-4 font-semibold">
            {t('noSections')}
          </div>
        )}
        <SectionDialog
          dialogTitle={t('addForm.section.dialogTitle')}
          dialogTrigger={<Button>{t('addSection')}</Button>}
          dialogDescription={t.rich('addForm.section.formDescription', {
            br: () => <br />,
          })}
          dialogFooterButton={t('add')}
          onSubmit={onSubmit}
        />

        {sections.length > 0 && (
          <SectionList
            sections={sections}
            onDelete={onDelete}
            onSubmit={onSubmit}
          />
        )}
      </DndContext>
    </div>
  );
};

export default OutlineCourseSections;
