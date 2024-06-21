'use client';
import { useEffect, useState, useTransition } from 'react';
import {
  DynamicGoalsSchema,
  DynamicGoalsType,
} from '@/schemas/courses/course.schema';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';
import { useTranslations } from 'next-intl';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Plus, SquareMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { updateDynamicGoals } from '@/actions/course/create-learnings';
import { useSetUnsavedChanges } from '@/providers/UnsavedChangesProvider';
//
// type DynamicGoalsType = {
//   learnings?: Array<{ text: string; placeholder?: string }>;
//   requirements?: Array<{ text: string; placeholder?: string }>;
//   targetAudience?: Array<{ text: string; placeholder?: string }>;
// };

interface DynamicGoalsForm {
  courseId: string;
  courseField: Array<{ text: string; placeholder?: string }> | [];
  fieldName: keyof DynamicGoalsType; // Ensure type safety
  //serverAction: (courseId: string, values: DynamicGoalsType) => Promise<any>;
}

const DynamicGoalsForm = ({
  courseId,
  courseField,
  fieldName,
}: DynamicGoalsForm) => {
  const t = useTranslations(`CourseGoalsForm.${fieldName}`);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const { setUnsavedChanges, clearUnsavedChanges } = useSetUnsavedChanges();

  const [isPending, startTransition] = useTransition();

  const formSchema = DynamicGoalsSchema(t);

  const defaultValues: DynamicGoalsType = {
    [fieldName]: [
      {
        text: '',
        placeholder: t('placeholders.1'),
      },
      {
        text: '',
        placeholder: t('placeholders.2'),
      },
      {
        text: '',
        placeholder: t('placeholders.3'),
      },
    ],
  };

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues:
      courseField && courseField.length > 1
        ? {
            [fieldName]: courseField.map((learning: { text: string }) => ({
              text: learning.text,
            })),
          }
        : defaultValues,
    resolver: zodResolver(formSchema),
  });

  const { fields, append, remove } = useFieldArray({
    name: fieldName,
    control: form.control,
  });

  const onSubmit = (values: DynamicGoalsType) => {
    startTransition(() => {
      updateDynamicGoals(courseId, values, fieldName).then((data) => {
        if ('success' in data) {
          toast({
            title: t('messages.success'),
            description: t('messages.successDescription'),
          });
          form.reset(values);
          setTimeout(clearUnsavedChanges, 100);
        } else {
          toast({
            variant: 'destructive',
            title: t('messages.error'),
            description: t('messages.errorDescription'),
          });
        }
      });
    });
  };

  useEffect(() => {
    const subscription = form.watch(() => {
      setIsFormDirty(form.formState.isDirty);
      setUnsavedChanges({});
      console.log('DIRTY');
    });
    return () => {
      clearUnsavedChanges();

      subscription.unsubscribe();
    };
  }, [form]);

  // useEffect(() => {
  //   const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  //     if (isFormDirty) {
  //       e.preventDefault();
  //       e.returnValue = '';
  //     }
  //   };
  //
  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, [isFormDirty]);

  return (
    <div className="mt-8 mb-8">
      <strong>{t('title')}</strong>
      <p className="my-4 text-sm text-gray-500">{t('description')}</p>
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
              name={`${fieldName}.${index}.text` as const}
              render={({ field }) => (
                <FormItem className="relative">
                  <div className="flex items-center">
                    <FormControl>
                      <Input
                        className="max-w-3xl"
                        disabled={isPending}
                        placeholder={form.getValues(
                          `${fieldName}.${index}.placeholder`,
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

                  {form.formState.errors[fieldName] &&
                    form.formState.errors[fieldName]?.[index] && (
                      <FormMessage>
                        {form.formState.errors[fieldName]?.[index]?.message}
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
              {t('add')}
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {t('save')}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default DynamicGoalsForm;
