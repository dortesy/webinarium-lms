'use client';
import { ROUTES } from '@/config/routes';
import { Category, Course, Media } from '@prisma/client';
import { useState, useTransition } from 'react';
import { CourseDeletion } from '@/actions/course/course-deletion';
import { toast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface CourseWithImage extends Course {
  image?: Media | null;
  category?: Category | null;
}

interface CourseListProps {
  initialCourses: CourseWithImage[];
}

// TODO
// Add skeleton for CourseList
const CourseList = ({ initialCourses }: CourseListProps) => {
  const [courses, setCourses] = useState(initialCourses);
  const [isPending, startTransition] = useTransition();
  const tEnum = useTranslations('ENUM');
  const t = useTranslations('CourseList');

  const removeCourse = (id: string) => () => {
    startTransition(() => {
      CourseDeletion(id).then((data) => {
        if ('error' in data) {
          console.log(data);
          toast({
            variant: 'destructive',
            title: 'Произошла ошибка',
            description: data.error,
          });
        }

        if ('success' in data) {
          setCourses(courses.filter((course) => course.id !== id));
          toast({
            title: 'Курс удален',
            description: data.success,
          });
        }
      });
    });
  };

  const stripAndTruncate = (text: string, length: number) => {
    const strippedText = text.replace(/(<([^>]+)>)/gi, '');
    if (strippedText.length <= length) return strippedText;
    return strippedText.slice(0, length) + '...';
  };

  return (
    <>
      <h2 className="text-4xl font-extrabold dark:text-white">{t('title')}</h2>
      <p className="my-4 text-sm text-gray-500">{t('description')}</p>
      <Button asChild className="mb-5">
        <Link href={ROUTES.TEACHER.ADD_COURSE}>{t('addNewCourse')}</Link>
      </Button>

      <p></p>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="shadow-md bg-stone-50 rounded-xl relative transition-all duration-300 hover:shadow-lg hover:bg-white"
          >
            <Link
              href={ROUTES.TEACHER.COURSE.DETAILS(course.id)}
              className="absolute inset-0 w-full h-full z-10"
            ></Link>
            <div className="rounded-t-xl overflow-hidden relative h-[200px]">
              {course.image && (
                <Image
                  src={course.image.url}
                  alt={course.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="w-full h-40 object-cover"
                />
              )}
            </div>

            <div className="flex px-2 justify-between mt-2">
              <Badge variant="secondary">
                {tEnum(`CourseStatus.${course.status!}`)}
              </Badge>
              <div className="text-sm text-gray-500">
                {course.category?.name}
              </div>
            </div>

            <div className="px-4 py-4 flex justify-between">
              <h3 className="text-md font-bold">{course.title}</h3>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 relative z-10"
                  >
                    {t('deleteModal.triggerText')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('deleteModal.title')}</DialogTitle>
                    <DialogDescription
                      dangerouslySetInnerHTML={{
                        __html: t.markup('deleteModal.description', {
                          b: (chunks) => `<strong>${chunks}</strong>`,
                        }),
                      }}
                    ></DialogDescription>
                  </DialogHeader>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={isPending}
                      >
                        {t('deleteModal.cancel')}
                      </Button>
                    </DialogClose>

                    <Button
                      type="submit"
                      onClick={removeCourse(course.id)}
                      disabled={isPending}
                    >
                      {t('deleteModal.submit')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CourseList;
