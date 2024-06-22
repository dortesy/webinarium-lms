'use server';
import {
  LessonSchema,
  LessonSchemaType,
} from '@/schemas/courses/course.schema';
import { getTranslations } from 'next-intl/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import {
  getLessonById,
  getLessonBySlug,
  getSectionById,
} from '@/lib/course/course-helper';
import slugify from 'slugify';
import { revalidatePath } from 'next/cache';

export const EditLesson = async (
  values: LessonSchemaType,
  pathname: string,
) => {
  const t = await getTranslations('CourseOutlinePage');
  const lessonSchema = LessonSchema(t);
  const validatedFields = lessonSchema.safeParse(values);

  if (!validatedFields.success) {
    return validatedFields.error.errors;
  }

  const { id, title, description, sectionId } = values;

  if (!id || !title || !sectionId) {
    return { error: t('errors.lessonMissingFieldsError') };
  }

  const existingSection = await getSectionById(sectionId);

  if (!existingSection) {
    return { error: t('errors.sectionNotFound') };
  }

  const user = await currentUser();

  if (!user || user.id !== existingSection.course.creatorId) {
    return { error: t('errors.notAuthorized') };
  }
  const slug = slugify(title.trim(), { lower: true });

  const lesson = await getLessonById(id);
  if (lesson?.title !== title) {
    const existingLesson = await getLessonBySlug(slug, sectionId);

    if (existingLesson) {
      return { error: t('errors.lessonAlreadyExists') };
    }
  }

  try {
    const lesson = await db.lesson.update({
      where: { id },
      data: {
        title: title.trim(),
        slug: slugify(title.trim(), { lower: true }),
        description: description,
        section: {
          connect: { id: sectionId },
        },
      },
      include: {
        video: true, // Include video in the returned lesson
      },
    });

    revalidatePath(pathname);
    return { success: true, lesson: lesson };
  } catch (error) {
    console.error('Error updating lesson:', error);
    return { error: t('errors.lessonUpdateError') };
  }
};
