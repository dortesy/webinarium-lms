'use client';
import { LessonWithVideoAndSection } from '@/lib/types/course';
import VideoJS from '@/components/media/videoJS';
import React, { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { createVideoJsOptions } from '@/lib/media/video-js-options';
import { useParams, useSearchParams } from 'next/navigation';

interface LessonContentProps {
  lesson: LessonWithVideoAndSection;
  prevLessonLink: string | null;
  nextLessonLink: string | null;
}

const LessonContent = ({
  lesson,
  prevLessonLink,
  nextLessonLink,
}: LessonContentProps) => {
  const t = useTranslations('LessonContent');
  const playerRef = useRef<any>(null);
  const searchParams = useSearchParams();
  const courseId = useParams().courseId;
  const lessonIndex = parseInt(searchParams.get('lesson') as string) + 1;

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;
    player.on('play', () => console.log('player is playing'));
    player.on('waiting', () => console.log('player is waiting'));
    player.on('dispose', () => console.log('player will dispose'));
  };

  const videoJsOptions = createVideoJsOptions(lesson, playerRef);

  return (
    <div className="w-full">
      <div className="mb-8">
        <Link href={`/courses/${courseId}`} className="font-bold">
          {t('backToCourse')}
        </Link>
      </div>
      <div className="flex justify-between mb-4">
        {prevLessonLink && (
          <Link
            href={prevLessonLink}
            className="flex hover:text-rich-blue text-xs md:text-sm items-center"
          >
            <ArrowLeft className="mr-2 w-6 md:w-8" />{' '}
            <span>{t('previousLesson')}</span>
          </Link>
        )}

        {nextLessonLink && (
          <Link
            href={nextLessonLink}
            className="flex hover:text-rich-blue text-xs md:text-sm items-center"
          >
            <span>{t('nextLesson')}</span>{' '}
            <ArrowRight className="ml-2 w-6 md:w-8" />
          </Link>
        )}
      </div>
      <div className="relative rounded-xl p-10 bg-white shadow-sm w-full h-[80%]">
        <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      </div>

      <div className="mt-5">
        <div className="text-sm ">
          <div className="text-gray-500">
            {t('sectionLabel')}: {lesson.section.title}
          </div>
          <div className="text-xs text-gray-400">
            {t('lessonLabel')}: #{lessonIndex}
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">{lesson.title}</h3>
        <div className="text-sm text-gray-600">
          <p>{lesson.description}</p>
        </div>
      </div>
    </div>
  );
};

export default LessonContent;
