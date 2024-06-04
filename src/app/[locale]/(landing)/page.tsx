import {getTranslations} from 'next-intl/server';
import Hero from '@/components/landing/hero';
import CourseCatalog from '@/components/courses/course-catalog';
import { getAllCourses } from '@/lib/course/course-helper';
export default async function Home() {
    const t = await getTranslations();
    const courses = await getAllCourses();
    //const Lottie = dynamic(() => import('react-lottie'), { ssr: false });

    return (
        <div>
             <Hero/>

          <CourseCatalog courses={courses}/>
        </div>
    );
}
