'use client';
import Image from 'next/image';
import { Rating } from '@/components/custom-ui/rating';
import {
  BarChart,
  BookmarkIcon,
  CalendarFold,
  Captions,
  Check,
  Clock,
  Eye,
  ListTodo,
  Newspaper,
  Presentation,
  ShieldCheck,
  ShoppingBagIcon,
  Timer,
  UsersRound,
} from 'lucide-react';
import styles from '@/styles/course-description.module.css';
import { Button } from '@/components/ui/button';
import { CourseWithCategory } from '@/lib/types/course';
import { useTranslations } from 'next-intl';
import InfoCard from '@/components/courses/course-info-card';

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
  const t = useTranslations('CourseInformation');

  const tEnum = useTranslations('ENUM');
  const level = course.level;
  const levelText = tEnum(`CourseLevel.${level!}`);

  const colorVariants = {
    BEGINNER: 'bg-green-800',
    INTERMEDIATE: 'bg-orange-700',
    ADVANCED: 'bg-red-600',
  };
  return (
    <>
      <div className="sm:w-full md:w-2/3">
        <div className="max-w-full relative h-[300px] md:h-[500px] rounded-xl">
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

          <h1 className="w-[70%] leading-snug text-2xl md:text-4xl font-bold absolute left-5 top-5 flex items-center justify-center text-white ">
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
            <div className="rounded-full relative min-h-14 min-w-14">
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

              <div className="text-gray-500 text-sm">{t('courseAuthor')}</div>
            </div>
          </div>

          <div className="flex items-center align-self font-light text-md text-neutral-600 self-start mt-1">
            <UsersRound size={16} className="mr-2" /> <span>97 участников</span>
          </div>
        </div>

        <div className="mt-10">
          <div className="text-neutral-600 mt-4 text-sm md:text-base">
            {course.learnings && (
              <>
                <h2 className="font-bold text-2xl text-black mb-4">
                  {t('whatYouWillLearn')}
                </h2>
                <div className="bg-white p-4 box-shadow-sm rounded-md mb-4">
                  <ul className="list-none flex flex-wrap mt-6 justify-between">
                    {Object.values(course.learnings).map((object, index) => (
                      <li
                        key={index}
                        className="flex w-[48%] md:w-[28%] mb-4 md:mb-6"
                      >
                        <Check className="text-green-800 mr-1 min-w-4 md:min-w-8" />
                        <span>{object.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            <article
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: course.description! }}
            />

            {course.requirements && course.targetAudience && (
              <div className="flex my-6 border p-5 rounded-md text-sm">
                <div className="w-1/2 p-2 md:p-5 border-r mr-2">
                  <h2 className="font-bold text-xl md:text-2xl text-black mb-4">
                    {t('requirements')}
                  </h2>
                  <ul className="list-disc space-y-2">
                    {Object.values(course.requirements).map((object, index) => (
                      <li key={index}>
                        <span>{object.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-1/2 p-2 md:p-5 ml-3">
                  <h2 className="font-bold text-xl md:text-2xl text-black mb-4">
                    {t('targetAudience')}
                  </h2>
                  <ul className="list-disc space-y-2">
                    {Object.values(course.targetAudience).map(
                      (object, index) => (
                        <li key={index}>
                          <span>{object.text}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex mb-4 gap-7 flex-col md:flex-row">
          <InfoCard
            label={t('infoCard.dateUpload')}
            Icon={CalendarFold}
            value={formatDate(course.createdAt)}
          />
          <InfoCard
            label={t('infoCard.level')}
            Icon={BarChart}
            value={levelText}
          />
          <InfoCard
            label={t('infoCard.length')}
            Icon={Clock}
            value="22 часа 13 минут"
          />
          <InfoCard label={t('infoCard.views')} Icon={Eye} value="9 700" />
        </div>
      </div>

      <div className="w-full md:w-1/3 md:max-w-[350px]">
        <div className="bg-white shadow-sm rounded-xl p-6">
          <div className="text-2xl font-bold">900 тыс. сум</div>

          <div className="font-light text-gray-600 mt-4 mb-2">
            {t('courseIncludes')}
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
            <Button variant="blueOutline" className="grow">
              {t('addToBasket')}{' '}
              <ShoppingBagIcon size={16} className="ml-2 bg-dot-rich-blue" />
            </Button>
            <Button variant="outline" size="icon">
              <BookmarkIcon className="text-rich-blue" />
            </Button>
          </div>

          <Button className="mt-4 w-full">{t('beginCourse')}</Button>
        </div>
      </div>
    </>
  );
};

export default CourseInformation;
