'use server';
import {
  CreateCourseSchema,
  CreateCourseSchemaType,
} from '@/schemas/courses/course.schema';
import { db } from '@/lib/db';
import slugify from 'slugify';
import { currentUser } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';

export const CreateCourse = async (
  values: CreateCourseSchemaType,
  pathname: string,
) => {
  const t = await getTranslations('CreateCourseForm');
  const paramSchema = CreateCourseSchema(t);
  const validatedFields = paramSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log(validatedFields.error.errors);
    return validatedFields.error.errors;
  }

  const { title } = values;
  const user = await currentUser();

  if (!user) {
    return { error: t('errors.notAuthorized') };
  }

  if (!title) {
    return { error: t('errors.titleRequired') };
  }

  const slug = slugify(title, { lower: true });

  const existingCourse = await db.course.findFirst({
    where: {
      slug: slug,
      creatorId: user.id,
    },
  });

  if (existingCourse) {
    return { error: t('errors.courseExists') };
  }

  try {
    const course = await db.course.create({
      data: {
        title: title.trim(),
        slug: slug,
        creator: { connect: { id: user.id! } },
        status: 'DRAFT',
      },
    });

    revalidatePath(pathname);
    return { success: t('success'), courseId: course.id };
  } catch (error) {
    console.error('Error creating course:', error);
    return { error: t('errors.creationError') };
  }
};
