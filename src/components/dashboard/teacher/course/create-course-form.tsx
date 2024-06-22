'use client';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CreateCourseSchema } from '@/schemas/courses/course.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/auth/form-error';
import { FormSuccess } from '@/components/auth/form-success';
import { usePathname, useRouter } from '@/navigation';
import { CreateCourse } from '@/actions/course/create-course';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/config/routes';

export const CreateCourseForm = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('CreateCourseForm');

  const formSchema = CreateCourseSchema(t);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      CreateCourse(values, pathname).then((data) => {
        if ('error' in data) {
          setError(data.error);
        }
        if ('success' in data) {
          setSuccess(data.success);
          router.push(`${ROUTES.TEACHER.COURSE.DETAILS(data.courseId)}`);
        }
      });
    });
  };

  return (
    <>
      <h2 className="text-4xl font-extrabold dark:text-white">{t('title')}</h2>
      <p className="my-4 text-sm text-gray-500">{t('description')}</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex-col space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="title"
                    className={error && 'text-red-500'}
                  >
                    {t('labelName')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder={t('labelPlaceholder')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button className="mt-4" type="submit" disabled={isPending}>
            {t('buttonText')}
          </Button>
        </form>
      </Form>
    </>
  );
};
