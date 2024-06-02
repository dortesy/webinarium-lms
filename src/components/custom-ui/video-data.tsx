'use client'
import { Media } from "@prisma/client";
import { TrashIcon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import { useRef } from "react";
import videojs from 'video.js';
import VideoJS from '@/components/media/videoJS';


const VideoData = ({ video, onDelete }: { video: Media, onDelete: () => void }) => {
    const playerRef = useRef<any>(null);

    const videoJsOptions: any = {
        controls: true,
        responsive: true,
        fluid: true,
        experimentalSvgIcons: true,
        sources: [
          {
            src: video.url,
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
                url: `/media/lessons/videos/${video.id}/thumbnail-sprite-{index}.jpg`,
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

    const t = useTranslations('VideoData');
    return (
        <div className="flex flex-row p-4 gap-4 border border-gray-150 rounded-lg shadow-sm ">
            <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
            <div className="flex flex-col justify-between w-full">
                <div className="flex flex-col">
                    <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                    <div className="text-sm text-gray-600">
                        <p><strong>{t('uploadDate')}</strong> {new Date(video.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="text-right">

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button  variant="ghost">
                            <TrashIcon size={16} className="mr-2" /> {t('deleteVideo')}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>{t('deleteConfirmationTitle')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('deleteConfirmationDescription')}
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction  onClick={onDelete}>{t('confirm')}</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>


                </div>
               
            </div>
        </div>
    )
}
export default VideoData;

