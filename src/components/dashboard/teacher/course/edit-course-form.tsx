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
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CourseLanguageEnum, CourseLevelEnum } from '@/lib/enums/course';
import { EditCourse } from '@/actions/course/edit-course';
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
import { FormError } from '@/components/auth/form-error';
import { FormSuccess } from '@/components/auth/form-success';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { usePathname } from '@/navigation';

interface CourseWithMedia extends PrismaCourse {
  image?: Media | null; // Add the image property here
}

interface EditCourseFormProps {
  course: CourseWithMedia;
  categories: CategoryData[];
}

const EditCourseForm = ({ course, categories }: EditCourseFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string | undefined>('');
  const [error, setError] = useState<string | undefined>('');
  const pathname = usePathname();

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

  const form = useForm<z.infer<typeof formSchema>>({
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
      }
    }
  };

  const createFormData = (values: EditCourseSchemaType): FormData => {
    const formData = new FormData();
    formData.append('pathname', pathname);
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
    form.reset({
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
      form.setValue('imageId', '');
      try {
        formSchema.shape.file.parse(file);
        form.setValue('file', file as File);
        form.clearErrors('file');
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
      form.setValue('file', undefined);
    }
    return false;
  };

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('title')}</FormLabel>
              <FormControl>
                <Input {...field} id="title" type="text" disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('description')}</FormLabel>
              <FormControl>
                <RichEditor
                  value={field.value}
                  name={field.name}
                  onChange={field.onChange}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap -mx-3 mb-2">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <FormItem>
                  <FormLabel>{t('category')}</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      items={categories}
                      value={field.value}
                      disabled={isPending}
                      name={field.name}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <FormItem>
                  <FormLabel>{t('level')}</FormLabel>
                  <FormControl>
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <FormItem>
                  <FormLabel>{t('language')}</FormLabel>
                  <FormControl>
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <div className="w-full md:w-1/3">
              <FormItem>
                <FormLabel>{t('imageLabel')}</FormLabel>
                <FormControl>
                  <ImageDropzone
                    {...field}
                    handleOnDrop={handleOnDrop}
                    resetFileInput={resetFileInput}
                    file={field.value}
                    id="file"
                    t={t}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />

        <FormError message={error} />
        <FormSuccess message={success} />

        <Button className="mt-4" type="submit" disabled={isPending}>
          {t('submitText')}
        </Button>
      </form>
    </Form>
  );
};

export default EditCourseForm;
