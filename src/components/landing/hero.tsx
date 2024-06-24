import HeroAnimation from '@/components/landing/hero-animation';
import { FlipWords } from '@/components/ui/flip-words';
import { getMessages, getTranslations } from 'next-intl/server';

const Hero = async () => {
  const t = await getTranslations('hero');
  const messages = await getMessages();
  // @ts-ignore
  const keys = Object.keys(messages.hero.words);
  // @ts-ignore
  const translatedWords = keys.map((word) => t(`words.${word}`));

  return (
    <section className="lg:max-w-screen-2xl min-h-[600px] px-10 py-6 md:py-12 md:px-24 flex flex-col  md:flex-row items-center justify-center md:justify-between mx-auto w-full shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] rounded-lg bg-[url('/img/hero-pattern.svg')] origin-center bg-center bg-no-repeat bg-cover ">
      <div className="order-2 md:order-1">
        <div className="text-3xl md:text-6xl mx-auto font-bold text-black relative max-w-[700px]">
          {t('title')}
          <FlipWords words={translatedWords} /> <br />
        </div>

        <div className="md:text-base text-sm  font-light text- text-gray-700 max-w-[700px] mx-auto mt-6 mb-6  md:mt-12 md:mb-12">
          {t('description')}
        </div>

        <button className="px-8 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200 ">
          {t('callToAction')}
        </button>
      </div>

      <HeroAnimation />
    </section>
  );
};

export default Hero;
