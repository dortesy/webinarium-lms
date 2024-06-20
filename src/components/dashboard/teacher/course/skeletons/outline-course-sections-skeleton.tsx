import { Skeleton } from '@/components/ui/skeleton';

const OutlineCourseSectionsSkeleton = () => {
  return (
    <>
      <Skeleton className="h-12 w-1/4 mb-4 rounded-md" />
      <Skeleton className="h-10 w-full rounded-md mb-6" />

      <Skeleton className="h-9 w-44 rounded-md" />

      <div className="space-y-6 mt-14">
        <Skeleton className="h-16 mb-4 w-full flex justify-between items-center px-4">
          <div>
            <Skeleton className="h-8 w-48" />
          </div>

          <div className="flex space-x-4">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-6" />
          </div>
        </Skeleton>
        {Array.from({ length: 12 }).map((_, index) => {
          const randomWidth = Math.floor(Math.random() * (400 - 200 + 1)) + 200;
          return (
            <div
              key={index}
              className="h-12 mb-4 w-full flex justify-between items-center px-4"
            >
              <div className="flex space-x-4 items-center">
                <Skeleton className="h-6 w-6" />
                <Skeleton
                  className={`h-5`}
                  style={{ width: `${randomWidth}px` }}
                />
              </div>

              <div className="flex space-x-2 items-center">
                <Skeleton className="h-5 w-5 mr-2" />
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default OutlineCourseSectionsSkeleton;
