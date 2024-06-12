'use client';
import Image from 'next/image';
import { Rating } from '@/components/custom-ui/rating';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  BookmarkIcon,
  CalendarFold,
  Captions,
  Clock,
  Eye,
  ListTodo,
  Newspaper,
  Presentation,
  ShieldCheck,
  ShoppingBag,
  ShoppingBagIcon,
  ShoppingBasket,
  ShoppingCartIcon,
  Timer,
  UsersRound,
} from 'lucide-react';
import styles from '@/styles/course-description.module.css';
import { Button } from '@/components/ui/button';
import { CourseWithCategory } from '@/lib/types/course';
import { useTranslations } from 'next-intl';

interface CourseInformationProps {
  course: CourseWithCategory;
}

// utils/formatDate.ts
// utils/formatDate.ts
export function formatDate(date: string | number | Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
  };
  return new Intl.DateTimeFormat('ru-RU', options).format(new Date(date));
}

const CourseInformation = ({ course }: CourseInformationProps) => {
  const t = useTranslations('ENUM');
  const level = course.level;
  const levelText = t(`CourseLevel.${level!}`);

  const colorVariants = {
    BEGINNER: 'bg-green-800',
    INTERMEDIATE: 'bg-orange-700',
    ADVANCED: 'bg-red-600',
  };
  return (
    <>
      <div className="w-2/3">
        <div className="max-w-full relative h-[500px] rounded-xl">
          <Image
            src={course.image!.url}
            fill
            style={{ objectFit: 'cover' }}
            alt={course.title}
            className="rounded-xl"
          />
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background:
                'linear-gradient(292.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%)',
              opacity: 0.8,
            }}
          ></div>

          <h1 className="w-[70%] leading-snug text-4xl font-bold absolute left-5 top-5 flex items-center justify-center text-white ">
            {course.title}
          </h1>

          <div className="absolute left-0 bottom-6 flex w-full items-center justify-between px-6">
            <div className="flex items-center">
              <Rating
                rating={4.2}
                totalStars={5}
                size={16}
                variant="yellow"
                className="h-1"
                showText={true}
                disabled={true}
              />
              <div className="mt-2.5">
                <a
                  href="#"
                  className="text-gray-300 ml-3 text-sm hover:text-white"
                >
                  {course.category!.name}
                </a>
              </div>
            </div>
            {/* <Badge className={`${colorVariants[level!]} mt-3`}> */}
            {/*   {levelText} */}
            {/* </Badge> */}
          </div>
        </div>

        <div className="mt-5 flex justify-between">
          <div className="flex items-center">
            <div className="rounded-full relative h-16 w-16">
              <Image
                src={course.creator.image!}
                alt={course.creator.name!}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-full"
              />
            </div>

            <div className="ml-2">
              <div className="text-sm font-bold">
                {course.creator.firstName} {course.creator.lastName}
              </div>

              <div className="text-gray-500 text-sm">Автор курса</div>
            </div>
          </div>

          <div>
            <div className="flex items-center font-light text-md text-neutral-600">
              <UsersRound size={16} className="mr-2" /> 97 участников
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="font-bold text-2xl">Описание</h2>

          <div className="text-neutral-600 mt-4">
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: course.description! }}
            />
          </div>
        </div>

        <div className="flex mb-4 gap-7">
          <div className="flex flex-col w-1/4 bg-white shadow-sm rounded-xl py-6 px-4">
            <div className="text-gray-400 mb-2">Дата загрузки</div>

            <div className="flex space-x-2 items-center">
              <CalendarFold size={16} strokeWidth={1} />{' '}
              <span>{formatDate(course.createdAt)}</span>
            </div>
          </div>

          <div className="flex flex-col w-1/4 bg-white shadow-sm rounded-xl py-6 px-6">
            <div className="text-gray-400 mb-2">Уровень</div>

            <div className="flex space-x-2 items-center">
              <BarChart size={16} /> <span>{levelText}</span>
            </div>
          </div>

          <div className="flex flex-col w-1/4 bg-white shadow-sm rounded-xl py-6 px-6">
            <div className="text-gray-400 mb-2">Продолжительность</div>

            <div className="flex space-x-2 items-center">
              <Clock size={16} /> <span>22 часа 13 минут</span>
            </div>
          </div>

          <div className="flex flex-col w-1/4 bg-white shadow-sm rounded-xl py-6 px-6">
            <div className="text-gray-400 mb-2">Просмотров</div>

            <div className="flex space-x-2 items-center">
              <Eye size={16} /> <span>9 700</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-1/3 max-w-[350px]">
        <div className="bg-white shadow-sm rounded-xl p-6">
          <div className="text-2xl font-bold">900 тыс. сум</div>

          <div className="font-light text-gray-600 mt-4 mb-2">
            Курс включает в себя:
          </div>

          <div className="text-indigo-950 font-light">
            <div className="flex items-center mb-3">
              <div className="mr-2">
                <Presentation width={18} height={18} />
              </div>
              <div>33 Урока</div>
            </div>
            <div className="flex items-center mb-3">
              <div className="mr-2">
                <Timer width={18} height={18} />
              </div>
              <div>9 Часов 48 минут материала</div>
            </div>

            <div className="flex items-center mb-3">
              <div className="mr-2">
                <ShieldCheck width={18} height={18} />
              </div>
              <div>Подтверждающий сертификат</div>
            </div>

            <div className="flex items-center  mb-3">
              <div className="mr-2">
                <Captions width={18} height={18} />
              </div>
              <div>Субтитры</div>
            </div>

            <div className="flex items-center mb-3">
              <div className="mr-2">
                <Newspaper width={18} height={18} />
              </div>
              <div>10 статей</div>
            </div>

            <div className="flex items-center mb-3">
              <div className="mr-2">
                <ListTodo width={18} height={18} />
              </div>
              <div>2 теста</div>
            </div>
          </div>

          <div className="flex gap-4 mt-12">
            <Button variant="secondary" className="grow">
              Добавить в корзину <ShoppingBagIcon size={16} className="ml-2" />
            </Button>
            <Button variant="outline" size="icon">
              <BookmarkIcon />
            </Button>
          </div>

          <Button className="mt-4 w-full">Начать обучение</Button>
        </div>
      </div>
    </>
  );
};

export default CourseInformation;
