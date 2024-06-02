import {Skeleton} from "@/components/ui/skeleton";

const VideoDataSkeleton = () => {
    return (
        <div className="flex flex-row p-4 gap-4 border border-gray-150 rounded-lg shadow-sm relative">
            <div className="absolute z-10 top-0 left-0 right-0 bottom-0 bg-dot-transparent bg-opacity-45 bg-gray-100">
                <div className="grid place-items-center h-full">
                    <div className="flex items-center justify-center text-gray-600 border border-gray-200 rounded-full py-2 px-4 bg-white bg-opacity-75">
                        <span className="font-bold mr-2">Происходит обработка видео...</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                  d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"/>
                            <rect width="2" height="7" x="11" y="6" fill="currentColor" rx="1">
                                <animateTransform attributeName="transform" dur="27s" repeatCount="indefinite" type="rotate"
                                                  values="0 12 12;360 12 12"/>
                            </rect>
                            <rect width="2" height="9" x="11" y="11" fill="currentColor" rx="1">
                                <animateTransform attributeName="transform" dur="2.25s" repeatCount="indefinite"
                                                  type="rotate" values="0 12 12;360 12 12"/>
                            </rect>
                        </svg>
                    </div>
                </div>
            </div>
            <Skeleton className="w-[240px] h-[135px] rounded"/> {/* Skeleton for the video player */}
            <div className="flex flex-col justify-between w-full">
                <div className="flex flex-col">
                    <Skeleton className="w-[200px] h-[24px] mb-2 rounded-full"/> {/* Skeleton for the video title */}
                    <div className="text-sm text-gray-600">
                        <Skeleton className="w-[150px] h-[20px] rounded-full"/> {/* Skeleton for the upload date */}
                    </div>
                </div>
                <div className="flex items-end justify-end">
                    <Skeleton className="w-[100px] h-[36px] rounded-full" /> {/* Skeleton for the delete button */}
                </div>
            </div>
        </div>
    );
}

export default VideoDataSkeleton;
