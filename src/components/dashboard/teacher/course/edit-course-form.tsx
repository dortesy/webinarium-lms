'use client';
import { Course as PrismaCourse, Media } from '@prisma/client';
import { CategoryData } from '@/lib/types/category';
import { useTranslations } from 'next-intl';
import React, { useState, useTransition } from 'react';
import {
  EditCourseSchema,
  EditCourseSchemaType,
} from '@/schemas/courses/course.schema';
import DOMPurify from 'isomorphic-dompurify';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CourseLanguageEnum, CourseLevelEnum } from '@/lib/enums/course';
import { EditCourse } from '@/actions/course/edit-course';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import RichEditor from '@/components/rich-editor/rich-editor';
import SearchableSelect from '@/components/custom-ui/searchable-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ImageDropzone from '@/components/custom-ui/image-dropzone';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import EditCourseFormSkeleton from '@/components/dashboard/teacher/course/skeletons/edit-course-form-skeleton';

interface CourseWithMedia extends PrismaCourse {
  image?: Media | null; // Add the image property here
}

interface EditCourseFormProps {
  initialCourse: CourseWithMedia;
  categories: CategoryData[];
}

const EditCourseForm = ({ initialCourse, categories }: EditCourseFormProps) => {
  const [course, setCourse] = useState<CourseWithMedia>(initialCourse);

  if (!course) {
    return <EditCourseFormSkeleton />;
  }

  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string | undefined>('');
  const [error, setError] = useState<string | undefined>('');

  const t = useTranslations('EditCourseForm');

  const defaultValues = {
    id: course.id,
    title: course.title || '',
    description: course.description
      ? DOMPurify.sanitize(course.description)
      : '',
    categoryId: course.categoryId || '',
    level: course.level || CourseLevelEnum[0],
    language: course.language || CourseLanguageEnum[0],
    imageId: course.imageId || undefined,
    published: course.published || false,
    creatorId: course.creatorId,
    file: course.image
      ? new File([], course.image.url, { type: 'image/png' })
      : undefined,
  };

  const formSchema = EditCourseSchema(t);
  const resetFileInput = React.useRef<() => void>(() => {});

  const {
    control,
    reset,
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = (values: EditCourseSchemaType) => {
    const formData = createFormData(values);

    startTransition(() => {
      try {
        EditCourse(values, formData).then((data) => {
          handleResponse(data, values);
        });
      } catch (error) {
        console.error('Error submitting the form: ', error);
      }
    });
  };

  const handleResponse = (data: any, values: EditCourseSchemaType) => {
    if ('error' in data) {
      setError(data.error);
    }

    if ('success' in data) {
      setSuccess(data.success);
      if (data.course) {
        updateFormValues(data.course, values);
        console.log('huy sosi');
        setCourse((prevCourse) => ({
          ...prevCourse,
          ...data.course,
        }));
      }
    }
  };

  const createFormData = (values: EditCourseSchemaType): FormData => {
    const formData = new FormData();
    if (values.file) {
      formData.append('image', values.file);
      values.file = undefined;
    }
    return formData;
  };

  const updateFormValues = (
    course: CourseWithMedia,
    values: EditCourseSchemaType,
  ) => {
    reset({
      ...values,
      title: course.title,
      imageId: course.imageId ? course.imageId : undefined,
      file: course.image
        ? new File([], course.image.url, { type: 'image/png' })
        : undefined,
    });
  };

  const handleOnDrop = (acceptedFiles: FileList | null): boolean => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setValue('imageId', '');
      try {
        formSchema.shape.file.parse(file);
        setValue('file', file as File);
        clearErrors('file');
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMessage = error.errors[0].message;
          setError(errorMessage);
          return false;
        } else {
          console.error(
            'Unknown error occurred during file validation:',
            error,
          );
        }
      }
    }
    if (acceptedFiles === null) {
      setValue('file', undefined);
    }
    return false;
  };

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
    >
      <div className="flex-col space-y-2">
        <Label htmlFor="title" className={errors.title && 'text-red-500'}>
          {t('title')}
        </Label>
        <Input
          {...register('title')}
          id="title"
          type="text"
          disabled={isPending}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <div className="flex-col space-y-2">
            <Label
              htmlFor="description"
              className={errors.description && 'text-red-500'}
            >
              {t('description')}
            </Label>
            <RichEditor
              value={field.value}
              name={field.name}
              onChange={field.onChange}
              disabled={isPending}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
        )}
      />

      <div className="flex flex-wrap -mx-3 mb-2">
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <Label htmlFor="categoryId">{t('category')}</Label>
              <SearchableSelect
                items={categories}
                value={field.value}
                disabled={isPending}
                name={field.name}
                onChange={field.onChange}
              />
            </div>
          )}
        />

        <Controller
          name="level"
          control={control}
          defaultValue={CourseLevelEnum[0]}
          render={({ field }) => (
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <Label htmlFor="level">{t('level')}</Label>
              <Select
                value={field.value}
                name={field.name}
                onValueChange={field.onChange}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue onBlur={field.onBlur} ref={field.ref} />
                </SelectTrigger>
                <SelectContent>
                  {CourseLevelEnum.map((level) => (
                    <SelectItem key={level} value={level}>
                      {t(level)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        ></Controller>

        <Controller
          name="language"
          control={control}
          render={({ field }) => (
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <Label htmlFor="language">{t('language')}</Label>
              <Select
                value={field.value}
                name={field.name}
                onValueChange={field.onChange}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue onBlur={field.onBlur} ref={field.ref} />
                </SelectTrigger>
                <SelectContent>
                  {CourseLanguageEnum.map((language) => (
                    <SelectItem key={language} value={language}>
                      {t(language)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </div>

      <Controller
        control={control}
        name="file"
        render={({ field }) => (
          <div className="w-full md:w-1/3">
            <Label htmlFor="file" className={error && 'text-red-500'}>
              Изображение для курса
            </Label>
            <ImageDropzone
              {...field}
              handleOnDrop={handleOnDrop}
              resetFileInput={resetFileInput}
              file={field.value}
              id="file"
              t={t}
            />
          </div>
        )}
      />

      <FormError message={error} />
      <FormSuccess message={success} />

      <Button className="mt-4" type="submit" disabled={isPending}>
        Сохранить
      </Button>
    </form>
  );
};

export default EditCourseForm;
