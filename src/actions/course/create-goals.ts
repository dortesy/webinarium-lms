'use server';

import {
  DynamicGoalsSchema,
  DynamicGoalsType,
} from '@/schemas/courses/course.schema';
import { getTranslations } from 'next-intl/server';
import { currentUser } from '@/lib/auth';
import { getOnlyCourseById } from '@/lib/course/course-helper';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const updateDynamicGoals = async (
  courseId: string,
  values: DynamicGoalsType,
  fieldName: keyof DynamicGoalsType,
  pathname: string,
) => {
  const t = await getTranslations(`CourseGoalsForm`);
  const formSchema = DynamicGoalsSchema(t);
  const validatedFields = formSchema.safeParse(values);

  if (!validatedFields.success) {
    return validatedFields.error.errors;
  }

  const user = await currentUser();
  const course = await getOnlyCourseById(courseId);

  if (!course) {
    return { error: t('courseNotFound') };
  }

  if (!user || user.id !== course.creatorId) {
    return { error: t('notAuthorized') };
  }

  if (!values[fieldName]) {
    return { error: t('fieldNotFound', { field: fieldName }) };
  }

  const transformedData = values[fieldName]!.map((item) => ({
    text: item.text,
  }));

  try {
    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data: {
        [fieldName]: transformedData as Prisma.JsonArray,
      },
    });

    revalidatePath(pathname);
    return { success: true, updatedCourse };
  } catch (error) {
    console.error(`Error while adding field ${fieldName} to course`, error);
    return { error: t('genericError') };
  }
};
