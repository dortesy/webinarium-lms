import { LessonWithVideo } from '@/lib/types/course';

export const createVideoJsOptions = (
  lesson: LessonWithVideo,
  playerRef: React.RefObject<any>,
) => ({
  controls: true,
  responsive: true,
  fill: true,
  experimentalSvgIcons: true,
  playbackRates: [0.5, 1, 1.5, 2],
  controlBar: {
    skipButtons: {
      forward: 5,
      backward: 5,
    },
  },
  userActions: {
    hotkeys: (event: KeyboardEvent) => {
      if (event.which === 39) {
        playerRef.current.currentTime(playerRef.current.currentTime() + 5);
      }
      if (event.which === 37) {
        playerRef.current.currentTime(playerRef.current.currentTime() - 5);
      }
    },
    doubleClick: (event: MouseEvent) => {
      const maxWidth = playerRef.current.currentWidth();
      const clickedX = event.offsetX / maxWidth;

      if (clickedX > 0.9) {
        playerRef.current.currentTime(playerRef.current.currentTime() + 5);
      } else if (clickedX < 0.1) {
        playerRef.current.currentTime(playerRef.current.currentTime() - 5);
      } else {
        playerRef.current.requestFullscreen();
      }
    },
  },
  sources: [
    {
      src: lesson.video!.url,
      type: 'application/x-mpegURL',
    },
  ],
  plugins: {
    httpSourceSelector: {
      default: 'auto',
    },
    spriteThumbnails: {
      interval: 5,
      url: `/media/lessons/videos/${lesson.video!.id}/thumbnail-sprite-{index}.jpg`,
      width: 160,
      height: 90,
      columns: 5,
      rows: 5,
    },
  },
});
