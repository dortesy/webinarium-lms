
const LoadingSkeleton = () => {
    
    return (
        <div
            className="flex-1 flex flex-col items-center justify-center">
            <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-5">
                <div className="flex justify-center">
                    <div
                        className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
                        role="status" aria-label="loading">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoadingSkeleton;