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

export const updateDynamicGoals = async (
  courseId: string,
  values: DynamicGoalsType,
  fieldName: keyof DynamicGoalsType,
) => {
  const t = await getTranslations('CourseGoalsForm');
  const formSchema = DynamicGoalsSchema(t);
  const validatedFields = formSchema.safeParse(values);

  if (!validatedFields.success) {
    return validatedFields.error.errors;
  }

  const user = await currentUser();
  const course = await getOnlyCourseById(courseId);

  if (!course) {
    return { error: 'Курс не найден' };
  }

  if (!user || user.id !== course.creatorId) {
    return { error: 'Вы не авторизованы' };
  }

  if (!values[fieldName]) {
    return { error: `Поле ${fieldName} не найдено` };
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

    return { success: true, updatedCourse };
  } catch (error) {
    console.error('Ошибка при обновлении курса:', error);
    return { error: 'Ошибка при обновлении курса' };
  }
};
