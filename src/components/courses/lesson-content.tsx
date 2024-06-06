'use client'
import { LessonWithVideo } from '@/lib/types/course';
import VideoJS from '@/components/media/videoJS';
import videojs from 'video.js';
import React, { useRef } from 'react';

interface LessonContentProps {
    lesson: LessonWithVideo;
}

const LessonContent = ({lesson}: LessonContentProps) => {
  const playerRef = useRef<any>(null);
  console.log('render lesson content')
  const videoJsOptions: any = {
    controls: true,
    responsive: true,
    fill: true,
    experimentalSvgIcons: true,
    playbackRates: [0.5, 1, 1.5, 2],
    controlBar: {
      skipButtons: {
        forward: 5,
        backward: 5
      }
    },
    userActions: {
      hotkeys: function(event: any) {
        // `this` is the player in this context

        // `x` key = pause
        if (event.which === 39) {
          playerRef.current.currentTime(playerRef.current.currentTime() + 5)
        }
        // `y` key = play
        if (event.which === 37) {
          playerRef.current.currentTime(playerRef.current.currentTime() - 5)
        }
      },

      doubleClick: function(event: any) {
        // const clickedY = event.clientY;
        const maxWidth = playerRef.current.currentWidth();

        // Proportional edges
        const rightEdgeProportion = 0.9;
        const leftEdgeProportion = 0.1;

        const clickedX = event.offsetX / maxWidth;

        if (clickedX > rightEdgeProportion) {
          playerRef.current.currentTime(playerRef.current.currentTime() + 5);
        } else if (clickedX < leftEdgeProportion) {
          playerRef.current.currentTime(playerRef.current.currentTime() - 5);
        } else {
          playerRef.current.requestFullscreen()
        }


      }
    },
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
    player.on('play', () => {
      videojs.log('player is playing');
    });
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });


  };


    return (
        <div className="w-full">
          <div className="relative rounded-xl p-10 bg-white shadow-sm mb-5 w-full h-[80%]">
            <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
          </div>

          <h3 className="text-xl font-semibold mb-2">{lesson.title}</h3>

          <div className="text-sm text-gray-600">
            <p>{lesson.description}</p>
          </div>
        </div>
    )
}

export default LessonContent;