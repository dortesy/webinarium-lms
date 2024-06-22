'use server';
import {
  LessonSchema,
  LessonSchemaType,
} from '@/schemas/courses/course.schema';
import { getTranslations } from 'next-intl/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { Prisma } from '@prisma/client';
import { getLessonBySlug, getSectionById } from '@/lib/course/course-helper';
import slugify from 'slugify';
import { revalidatePath } from 'next/cache';

export const CreateLesson = async (
  values: LessonSchemaType,
  pathname: string,
) => {
  const t = await getTranslations('CourseOutlinePage');
  const lessonSchema = LessonSchema(t);
  const validatedFields = lessonSchema.safeParse(values);

  if (!validatedFields.success) {
    return validatedFields.error.errors;
  }

  const { title, description, sectionId } = values;

  if (!title || !sectionId) {
    return { error: t('errors.lessonTitleRequired') };
  }

  const existingSection = await getSectionById(sectionId);

  if (!existingSection) {
    return { error: t('errors.courseNotFound') };
  }
  const user = await currentUser();

  if (!user || user.id !== existingSection.course.creatorId) {
    return { error: t('errors.notAuthorized') };
  }

  // Check if lesson with the same slug exists
  const slug = slugify(title.trim(), { lower: true });
  const existingLesson = await getLessonBySlug(slug, sectionId);

  if (existingLesson) {
    return { error: t('errors.lessonAlreadyExists') };
  }

  const lastLesson = await db.lesson.findFirst({
    where: {
      sectionId: sectionId,
    },
    orderBy: {
      position: Prisma.SortOrder.desc,
    },
  });

  const position = lastLesson ? lastLesson.position + 1 : 1;

  try {
    const lesson = await db.lesson.create({
      data: {
        title: title.trim(),
        slug: slug,
        description: description,
        section: {
          connect: {
            id: sectionId,
          },
        },
        position: position,
      },
      include: {
        video: true,
      },
    });

    revalidatePath(pathname);
    return { success: t('lessonCreated'), lesson: lesson };
  } catch (error) {
    console.error('Error creating lesson:', error);
    return { error: t('errors.lessonCreationError') };
  }
};
