'use client'
import { Media } from "@prisma/client";
import { TrashIcon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

const VideoData = ({ video, onDelete }: { video: Media, onDelete: () => void }) => {
    const t = useTranslations('VideoData');
    return (
        <div className="flex flex-row p-4 gap-4 border border-gray-150 rounded-lg shadow-sm ">
            <video controls className="w-72 rounded-lg ">
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="flex flex-col justify-between w-full">
                <div className="flex flex-col">
                    <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                    <div className="text-sm text-gray-600">
                        <p><strong>{t('uploadDate')}</strong> {new Date(video.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="text-right">

                <AlertDialog>
                    <AlertDialogTrigger>
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

