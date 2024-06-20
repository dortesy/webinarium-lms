'use server';

import {
  LearningSchemaType,
  LearningsSchema,
} from '@/schemas/courses/course.schema';
import { getTranslations } from 'next-intl/server';
import { currentUser } from '@/lib/auth';
import { getOnlyCourseById } from '@/lib/course/course-helper';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export const CreateLearnings = async (
  courseId: string,
  values: LearningSchemaType,
) => {
  const t = await getTranslations('CourseGoalsForm');
  const formSchema = LearningsSchema(t);
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

  const transformedData = values.learnings.map((learning) => ({
    text: learning.text,
  }));

  try {
    await db.course.update({
      where: { id: courseId },
      data: {
        learnings: transformedData as Prisma.JsonArray,
      },
    });
  } catch {
    return { error: 'Ошибка при создании целей курса' };
  }
};
