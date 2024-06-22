'use server';
import {
  SectionSchema,
  SectionSchemaType,
} from '@/schemas/courses/course.schema';
import { getTranslations } from 'next-intl/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { getCourseById } from '@/lib/course/course-helper';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

export const CreateSection = async (
  values: SectionSchemaType,
  pathname: string,
) => {
  const t = await getTranslations('CourseOutlinePage');
  const sectionSchema = SectionSchema(t);
  const validatedFields = sectionSchema.safeParse(values);

  if (!validatedFields.success) {
    return validatedFields.error.errors;
  }

  const { title, description, courseId } = values;

  if (!title || !courseId) {
    return { error: t('errors.sectionTitleRequired') };
  }

  const existingCourse = await getCourseById(courseId);

  if (!existingCourse) {
    return { error: t('errors.courseNotFound') };
  }
  const user = await currentUser();

  if (!user || user.id !== existingCourse?.creatorId) {
    return { error: t('errors.notAuthorized') };
  }

  const lastSection = await db.section.findFirst({
    where: {
      courseId: courseId,
    },
    orderBy: {
      position: Prisma.SortOrder.desc,
    },
  });

  const position = lastSection ? lastSection.position + 1 : 1;

  try {
    const section = await db.section.create({
      data: {
        title: title.trim(),
        description: description,
        course: {
          connect: {
            id: courseId,
          },
        },
        position: position,
      },
    });

    revalidatePath(pathname);

    return { success: t('sectionAdded'), section: section };
  } catch (error) {
    console.error('Error creating section:', error);
    return { error: t('errors.sectionCreationError') };
  }
};
