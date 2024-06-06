import HeroAnimation from '@/components/landing/hero-animation';
import { FlipWords } from '@/components/ui/flip-words';
import { getMessages, getTranslations } from 'next-intl/server';


const Hero = async () => {
  const t = await getTranslations("hero");
  const messages = await getMessages();
  // @ts-ignore
  const keys = Object.keys(messages.hero.words);
  // @ts-ignore
  const translatedWords = keys.map((word) => t(`words.${word}`));


  return (
    <div className="lg:max-w-screen-2xl min-h-[600px] py-12 px-24 flex flex-row items-center justify-center mx-auto w-full shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] rounded-lg bg-[url('/img/hero-pattern.svg')] origin-center bg-center bg-no-repeat bg-cover">
      <div>

        <div className="text-6xl mx-auto font-bold text-black relative max-w-[700px]">
          {t('title')}
          <FlipWords words={translatedWords} /> <br />
        </div>

        <div className="font-light text-md text-gray-700 max-w-[700px] mx-auto mt-12 mb-12">
          {t('description')}
        </div>

        <button
          className="px-8 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200 ">
          {t('callToAction')}
        </button>

      </div>


      <HeroAnimation />
    </div>
  )
}

export default Hero