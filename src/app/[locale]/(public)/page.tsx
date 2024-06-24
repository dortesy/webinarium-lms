import { getTranslations } from 'next-intl/server';
import Hero from '@/components/landing/hero';
import CourseCatalog from '@/components/courses/course-catalog';
import { Suspense } from 'react';
import CourseCatalogSkeleton from '@/components/courses/course-catalog-skeleton';

export default async function Home() {
  const t = await getTranslations();
  //const Lottie = dynamic(() => import('react-lottie'), { ssr: false });

  return (
    <>
      <Hero />
      <Suspense fallback={<CourseCatalogSkeleton />}>
        <CourseCatalog />
      </Suspense>
    </>
  );
}
