'use client';
import { Course } from '@prisma/client';
import { useTranslations } from 'next-intl';
import DynamicGoalsForm from '@/components/dashboard/teacher/course/dynamic-goals-form';
import { Separator } from '@/components/ui/separator';

const CourseGoalsForm = ({ course }: { course: Course }) => {
  const t = useTranslations('CourseGoalsForm');

  const learnings = course.learnings as Array<{ text: string }>;
  const requirements = course.requirements as Array<{ text: string }>;
  const targetAudience = course.targetAudience as Array<{ text: string }>;

  return (
    <>
      <h2 className="text-4xl font-extrabold dark:text-white">{t('title')}</h2>
      <p className="my-4 text-sm text-gray-500">
        {t.rich('description', { br: () => <br /> })}
      </p>

      <DynamicGoalsForm
        courseId={course.id}
        courseField={learnings}
        fieldName={'learnings'}
      />

      <Separator />

      <DynamicGoalsForm
        courseId={course.id}
        courseField={requirements}
        fieldName={'requirements'}
      />

      <Separator />

      <DynamicGoalsForm
        courseId={course.id}
        courseField={targetAudience}
        fieldName={'targetAudience'}
      />
    </>
  );
};

export default CourseGoalsForm;
