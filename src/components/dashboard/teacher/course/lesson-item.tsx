'use client';

import LessonDialog from './dialog/lesson-dialog';
import { FilePenLine, GripVertical, Trash2, Video } from 'lucide-react';
import DeleteDialog from './dialog/delete-dialog';
import { useTranslations } from 'next-intl';
import { LessonSchemaType } from '@/schemas/courses/course.schema';
import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import VideoDropzone from '@/components/custom-ui/video-dropzone';
import VideoData from '@/components/custom-ui/video-data';
import { LessonWithVideo } from '@/lib/types/course';
import deleteVideo from '@/actions/course/delete-video';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import VideoDataSkeleton from '@/components/custom-ui/video-data-skeleton';
import socket from '@/socket';
import { getLessonById } from '@/lib/course/course-helper';
import { EditLesson } from '@/actions/course/edit-lesson';
import { toast } from '@/components/ui/use-toast';
import { usePathname } from '@/navigation';

type TranslationsFunction = ReturnType<typeof useTranslations>;

interface LessonItemProps {
  initialLesson: LessonWithVideo;
  index: number;
  t: TranslationsFunction;
  handleDelete: (lessonId: string) => void;
  isNew?: boolean; // Add this line
}

const LessonItem = ({
  initialLesson,
  index,
  t,
  handleDelete,
  isNew,
}: LessonItemProps) => {
  const [lesson, setLesson] = useState<LessonWithVideo>(initialLesson);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: lesson.id });
  const [isPending, startTransition] = useTransition();
  const [jobStatus, setJobStatus] = useState(null);
  const pathname = usePathname();
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  useEffect(() => {
    const handleJobCompleted = async (data: any) => {
      setJobStatus(data);
      const lessonId = data.data; // Assuming data.data contains the lesson ID
      const updatedLesson = await getLessonById(lessonId);
      if (updatedLesson && lesson.id === updatedLesson.id) {
        setLesson(updatedLesson);
        toast({
          title: t('addForm.lesson.videoProcessed'),
          description: t('addForm.lesson.videoProcessed'),
        });
      }
    };

    const handleJobFailed = (data: any) => {
      console.log('jobFailed', data);
      setJobStatus(data);
    };

    socket.on('jobCompleted', handleJobCompleted);
    socket.on('jobFailed', handleJobFailed);

    return () => {
      socket.off('jobCompleted', handleJobCompleted);
      socket.off('jobFailed', handleJobFailed);
    };
  }, [lesson.id]);

  const [isVideoBlockVisible, setIsVideoBlockVisible] = useState(
    isNew || false,
  );

  const handleVideoButtonClick = () => {
    if (isVideoBlockVisible) {
      setIsVideoBlockVisible(false);
    } else {
      setIsVideoBlockVisible(true);
    }
  };

  const onSubmit = (values: LessonSchemaType) => {
    startTransition(() => {
      EditLesson(values, pathname).then((data) => {
        if ('success' in data) {
          setLesson(data.lesson!);
        }
        if ('error' in data) {
          console.error(data.error);
          toast({
            title: t('errors.genericError'),
            description: data.error,
            variant: 'destructive',
          });
        }
      });
    });
  };

  const onDelete = () => {
    handleDelete(lesson.id);
  };

  const handleVideoDelete = async () => {
    if (!lesson.video) {
      return;
    }
    const result = await deleteVideo(lesson.video.id);
    if (result.success && result.updatedLesson) {
      handleVideoUpload(result.updatedLesson);
    } else {
      console.error(result.error);
    }
  };

  const handleVideoUpload = (updatedLesson: LessonWithVideo) => {
    setLesson(updatedLesson);
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex justify-between items-center p-4 relative">
        <div
          className="absolute top-0 left-0 right-0 bottom-0 cursor-pointer "
          onClick={handleVideoButtonClick}
        ></div>

        <div className="flex items-center gap-4">
          <div className="text-lg font-bold">{index + 1}</div>
          <div>
            <h3 className="text-sm">{lesson.title}</h3>
            <p className="text-sm text-gray-600">{lesson.description}</p>
          </div>
        </div>
        <div className="flex gap-3 items-center relative z-10">
          <Button
            size="icon"
            variant={isVideoBlockVisible ? 'secondary' : 'ghost'}
            onClick={handleVideoButtonClick}
          >
            <Video
              className="cursor-pointer"
              width={18}
              height={18}
              strokeWidth={1}
            />
          </Button>

          <LessonDialog
            dialogTitle={t('addForm.lesson.dialogTitleEdit')}
            defaultValues={{
              ...lesson,
              description: lesson.description ?? undefined,
            }}
            dialogTrigger={
              <FilePenLine
                className="cursor-pointer"
                width={16}
                height={16}
                strokeWidth={1}
              />
            }
            dialogDescription={t('addForm.lesson.formDescriptionEdit')}
            dialogFooterButton={t('addForm.lesson.editText')}
            onSubmit={onSubmit}
          />
          <DeleteDialog
            dialogTrigger={
              <Trash2
                className="cursor-pointer"
                width={16}
                height={16}
                strokeWidth={1}
              />
            }
            dialogDescription={t('addForm.lesson.deleteText')}
            removeData={onDelete}
          />
          <div {...listeners} {...attributes}>
            <GripVertical width={16} height={16} strokeWidth={1} />
          </div>
        </div>
      </div>

      {isVideoBlockVisible ? (
        lesson.video ? (
          lesson.video.isReady ? (
            <VideoData video={lesson.video} onDelete={handleVideoDelete} />
          ) : (
            <VideoDataSkeleton />
          )
        ) : (
          <VideoDropzone
            lessonId={lesson.id}
            sectionId={lesson.sectionId}
            onVideoUpload={handleVideoUpload}
          />
        )
      ) : (
        <Separator />
      )}
    </div>
  );
};

LessonItem.displayName = 'LessonItem';

export default LessonItem;
