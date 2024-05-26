'use client'
import { Media } from "@prisma/client";
import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";

const VideoData = ({ video }: { video: Media }) => {
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
                        <p><strong>Дата загрузки:</strong> {new Date(video.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="text-right">
                    <Button  variant="ghost" >
                        <TrashIcon size={16} className="mr-2" /> Удалить видео
                    </Button>
                </div>
               
            </div>
        </div>
    )
}
export default VideoData;

