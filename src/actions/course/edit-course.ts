'use server';
import {
  EditCourseSchema,
  EditCourseSchemaType,
} from '@/schemas/courses/course.schema';
import { db } from '@/lib/db';
import slugify from 'slugify';
import { currentUser } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';
import { CourseLanguage, CourseLevel } from '@/lib/enums/course';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { UploadImage } from '@/lib/media/upload-image';
import { deleteFile } from '@/lib/media/delete-file';
import { revalidatePath } from 'next/cache';

export const EditCourse = async (
  values: EditCourseSchemaType,
  formData: FormData,
) => {
  const t = await getTranslations('EditCourseForm');
  const editCourseSchema = EditCourseSchema(t);
  const validatedFields = editCourseSchema.safeParse(values);

  if (!validatedFields.success) {
    return validatedFields.error.errors;
  }

  /*
   * TODO:
   * Published, price and duration are not being used
   * Find cases where we can use duration/published or should we remove them
   * We can retrieve full length of courses by lessons
   * We also have status field - ARCHIVED/DRAFT/PUBLISHED
   * Need to decide which one is better boolean published or enum status field
   * */

  const {
    id,
    title,
    description,
    categoryId,
    creatorId,
    imageId,
    language,
    level,
    published,
    price,
    duration,
  } = values;
  const user = await currentUser();

  if (!user || user.id !== creatorId) {
    return { error: t('errors.noAccess') };
  }

  if (!title) {
    return { error: t('errors.minTitle') };
  }

  const slug = slugify(title, { lower: true });

  const existingCourse = await db.course.findFirst({
    where: {
      slug: slug,
      creatorId: user.id,
    },
  });

  if (existingCourse && existingCourse.id !== id) {
    return { error: t('errors.courseExists') };
  }

  const window = new JSDOM('').window;
  const sanitizedDescription = DOMPurify(window).sanitize(description ?? '');

  try {
    const course = await db.course.update({
      where: {
        id: id,
      },
      data: {
        title: title.trim(),
        slug: slug,
        description: sanitizedDescription,
        category: {
          ...(categoryId
            ? {
                connect: {
                  id: categoryId,
                },
              }
            : {}),
        },
        level: level as CourseLevel,
        language: language as CourseLanguage,
      },
    });

    const validatedImage = formData.get('image')
      ? (editCourseSchema.shape.file.parse(formData.get('image')) as File)
      : null;

    if (validatedImage && validatedImage.size > 0) {
      await UploadImage(course, validatedImage);
    }
    if (!validatedImage && imageId) {
      const deletedMedia = await db.media.delete({
        where: {
          id: imageId,
        },
      });

      deleteFile(deletedMedia.url);
    }

    const newCourse = await db.course.findFirst({
      where: {
        id: id,
      },
      include: {
        category: true,
        image: true,
      },
    });

    const pathname = formData.get('pathname') as string;
    if (pathname) revalidatePath(pathname);

    return { success: t('success'), course: newCourse };
  } catch (error) {
    console.error('Error updating course:', error);
    return { error: t('errors.genericError') };
  }
};
