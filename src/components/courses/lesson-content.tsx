'use client'
import Image from 'next/image';
import { Rating } from '@/components/custom-ui/rating';
import { Badge } from '@/components/ui/badge';
import { LessonWithVideo } from '@/lib/types/course';
import VideoJS from '@/components/media/videoJS';
import videojs from 'video.js';
import { useRef } from 'react';

interface LessonContentProps {
    lesson: LessonWithVideo;
}

const LessonContent = ({lesson}: LessonContentProps) => {
  const playerRef = useRef<any>(null);

  const videoJsOptions: any = {
    controls: true,
    responsive: true,
    fluid: true,
    experimentalSvgIcons: true,
    playbackRates: [0.5, 1, 1.5, 2],
    sources: [
      {
        src: lesson.video!.url,
        type: 'application/x-mpegURL',
      },
    ],

    plugins: {
      httpSourceSelector:
        {
          default: 'auto'
        },
      spriteThumbnails: {
        interval: 5,
        url: `/media/lessons/videos/${lesson.video!.id}/thumbnail-sprite-{index}.jpg`,
        width: 160,
        height: 90,
        columns: 5,
        rows: 5
      }
    },

  };


  const handlePlayerReady = (player: any) => {
    playerRef.current = player;


    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });

  };


    return (
        <div className="w-full">
          <div className="max-w-full relative h-[500px] rounded-xl">
            <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
          </div>
        </div>
    )
}

export default LessonContent;