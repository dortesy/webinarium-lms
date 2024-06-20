import { Skeleton } from '@/components/ui/skeleton';

const EditCourseFormSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex-col space-y-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="flex-col space-y-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-48 w-full" />
      </div>

      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="w-full md:w-1/3">
        <Skeleton className="h-6 w-24 mb-2" />
        <Skeleton className="h-48 w-full" />
      </div>

      <Skeleton className="h-10 w-32 mt-4" />
    </div>
  );
};

export default EditCourseFormSkeleton;
