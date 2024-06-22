'use server';
import {
  SectionSchema,
  SectionSchemaType,
} from '@/schemas/courses/course.schema';
import { getTranslations } from 'next-intl/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import {
  getCourseById,
  getSectionsByCourseId,
} from '@/lib/course/course-helper';
import { revalidatePath } from 'next/cache';

export const EditSection = async (
  values: SectionSchemaType,
  pathname: string,
) => {
  const t = await getTranslations('CourseOutlinePage');
  const sectionSchema = SectionSchema(t);
  const validatedFields = sectionSchema.safeParse(values);

  if (!validatedFields.success) {
    return validatedFields.error.errors;
  }

  const { id, title, description, courseId } = values;

  if (!title || !courseId || !id) {
    return { error: t('errors.sectionTitleRequired') };
  }

  const existingCourse = await getCourseById(courseId);

  if (!existingCourse) {
    return { error: t('errors.courseNotFound') };
  }
  const user = await currentUser();

  if (!user || user.id !== existingCourse.creatorId) {
    return { error: t('errors.notAuthorized') };
  }

  try {
    const section = await db.section.update({
      where: {
        id: id,
      },
      data: {
        title: title.trim(),
        description: description,
      },
    });

    revalidatePath(pathname);
    return {
      success: t('sectionEditedSuccess', { title: section.title }),
      section: section,
    };
  } catch (error) {
    console.error('Error editing section:', error);
    return { error: t('errors.sectionUpdateError') };
  }
};

export const EditSectionPosition = async (
  sectionId: string,
  position: number,
  pathname: string,
) => {
  const t = await getTranslations('CourseOutlinePage');
  const existingSection = await db.section.findUnique({
    where: {
      id: sectionId,
    },
    include: { course: true },
  });

  if (!existingSection) {
    return { error: t('errors.sectionNotFound') };
  }

  const user = await currentUser();

  if (!user || user.id !== existingSection.course.creatorId) {
    return { error: t('errors.notAuthorized') };
  }

  try {
    const section = await db.section.update({
      where: {
        id: sectionId,
      },
      data: {
        position: position,
      },
    });

    const sections = await getSectionsByCourseId(section.courseId);

    revalidatePath(pathname);
    return {
      success: t('sectionMoved', { title: section.title }),
      sections: sections,
    };
  } catch (error) {
    console.error('Error moving section position:', error);
    return { error: t('errors.sectionMovingError') };
  }
};
