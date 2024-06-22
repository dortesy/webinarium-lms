import { Skeleton } from '@/components/ui/skeleton';

export function EditProfileFormSkeleton() {
  return (
    <form>
      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/2 px-3 mb-2">
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="w-full md:w-1/2 px-3 mb-2">
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-32 w-full" />
      </div>
      <h2 className="text-xl font-bold mb-2 mt-4">
        <Skeleton className="h-6 w-32" />
      </h2>
      <div className="flex flex-wrap -mx-3 mb-6 mt-4">
        <div className="w-full md:w-1/3 px-3 mb-2">
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-2">
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-2">
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-2">
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-2">
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-2">
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="w-full md:w-1/3 mb-8">
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-10 w-24 mt-4" />
    </form>
  );
}
