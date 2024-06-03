import {getTranslations} from 'next-intl/server';
import Hero from '@/components/landing/hero';
export default async function Home() {
    const t = await getTranslations();

    //const Lottie = dynamic(() => import('react-lottie'), { ssr: false });

    return (
        <div>
             <Hero/>
        </div>
    );
}
