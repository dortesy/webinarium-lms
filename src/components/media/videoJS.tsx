'use client'
import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-http-source-selector';
import 'videojs-sprite-thumbnails'
interface VideoJSProps {
  options: any;
  onReady?: (player: any) => void;
}

const VideoJS: React.FC<VideoJSProps> = ({ options, onReady }) => {
  const videoRef = React.useRef<HTMLDivElement | null>(null);
  const playerRef = React.useRef<any | null>(null);

  React.useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current?.appendChild(videoElement);



      const player = playerRef.current = videojs(videoElement, options, () => {
        console.log(player.isDisposed())
        if (onReady) {
          onReady(player);
        }
      });
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay || false);
      player.src(options.sources || []);
    }
  }, [options, videoRef]);

  React.useEffect(() => {
    const player = playerRef.current;

    return () => {

      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player className="w-full h-full">
      <div ref={videoRef} className="h-[100%]" />
    </div>
  );
};

export default VideoJS;