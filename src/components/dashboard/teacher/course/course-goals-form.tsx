'use client';
import {
  LearningSchemaType,
  LearningsSchema,
} from '@/schemas/courses/course.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Course } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, SquareMinus } from 'lucide-react';
import * as z from 'zod';
import { useTransition } from 'react';
import { CreateLearnings } from '@/actions/course/create-learnings';

const CourseGoalsForm = ({ course }: { course: Course }) => {
  const t = useTranslations('CourseGoalsForm');
  const [isPending, startTransition] = useTransition();

  const formSchema = LearningsSchema(t);

  const defaultValues: LearningSchemaType = {
    learnings: [
      {
        text: '',
        placeholder: 'Пример: Создавать веб-сайты с нуля',
      },
      {
        text: '',
        placeholder: 'Пример: Разбираться в алгоритмах',
      },
      {
        text: '',
        placeholder: 'Пример: Проходить технические интервью',
      },
    ],
  };

  const courseLearnings = course.learnings as Array<{ text: string }>;
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues:
      courseLearnings && courseLearnings.length > 1
        ? {
            learnings: courseLearnings.map((learning: { text: string }) => ({
              text: learning.text,
            })),
          }
        : defaultValues,
    resolver: zodResolver(formSchema),
  });

  const { fields, append, remove } = useFieldArray({
    name: 'learnings',
    control: form.control,
  });

  const onSubmit = (values: LearningSchemaType) => {
    console.log(values);

    startTransition(() => {
      CreateLearnings(course.id, values).then((data) => {});
    });
  };
  return (
    <>
      <h2 className="text-4xl font-extrabold dark:text-white">{t('title')}</h2>
      <p className="my-4 text-sm text-gray-500">
        {t.rich('description', { br: () => <br /> })}
      </p>

      <strong>{t('strongText')}</strong>
      <p className="my-4 text-sm text-gray-500">{t('secondDescription')}</p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          method="post"
        >
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`learnings.${index}.text` as const}
              render={({ field }) => (
                <FormItem className="relative">
                  <div className="flex items-center">
                    <FormControl>
                      <Input
                        className="max-w-3xl"
                        disabled={isPending}
                        placeholder={form.getValues(
                          `learnings.${index}.placeholder`,
                        )}
                        {...field}
                      />
                    </FormControl>

                    {index >= 3 && (
                      <SquareMinus
                        className="ml-2 cursor-pointer text-gray-500 hover:text-black"
                        onClick={() => remove(index)}
                      />
                    )}
                  </div>

                  {form.formState.errors.learnings &&
                    form.formState.errors.learnings[index] && (
                      <FormMessage>
                        {form.formState.errors.learnings[index]?.message}
                      </FormMessage>
                    )}
                </FormItem>
              )}
            />
          ))}
          {fields.length < 10 && (
            <Button
              className="flex items-center gap-1 text-sm cursor-pointer"
              variant="addLesson"
              type="button"
              disabled={isPending}
              onClick={() => append({ text: '' })}
            >
              <Plus width={16} height={16} />
              Добавить
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            Сохранить
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CourseGoalsForm;
