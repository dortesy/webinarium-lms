import LoadingSpinner from '@/components/custom-ui/loading-spinner';

export default function Loading() {
  return (
    <div className="lg:max-w-screen-2xl min-h-[calc(100vh-120px)]   grid place-items-center mx-auto w-full shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] rounded-lg bg-white mt-4">
      <LoadingSpinner />;
    </div>
  );
}
