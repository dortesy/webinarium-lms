import { Skeleton } from "@/components/ui/skeleton";

export function CourseCatalogSkeleton() {
  return (
    <>
      <h2 className="text-4xl font-bold mb-4 mt-12">Список курсов</h2>
      <div className="w-full mt-2 mb-12 grid grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="flex flex-col space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        ))}
      </div>
    </>
  );
}

export default CourseCatalogSkeleton;