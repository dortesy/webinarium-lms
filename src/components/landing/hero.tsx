import HeroAnimation from '@/components/landing/hero-animation';
import { FlipWords } from '@/components/ui/flip-words';


const Hero = () => {
  const words = ['Программистом', 'Анонистом', 'Тарологом', 'Бизнесменом', 'Астрологом', 'Алхимиком', 'Космонавтом', '']
  return (
    <div className="lg:max-w-screen-2xl min-h-[600px] py-12 px-24 flex flex-row items-center justify-center mx-auto w-full shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] rounded-lg bg-[url('/img/hero-pattern.svg')] origin-center bg-center bg-no-repeat bg-cover">
      <div>

        <div className="text-6xl mx-auto font-bold text-black relative max-w-[700px]">
          На Webinarium у тебя есть возможность стать
          <FlipWords words={words} /> <br />
        </div>

        <div className="font-light text-md text-gray-700 max-w-[700px] mx-auto mt-12 mb-12">
          Откройте для себя новые возможности обучения с помощью Webinarium. Независимо от вашего уровня или интересов,
          у нас вы найдете курсы, которые вас заинтересуют и помогут в вашем личном и профессиональном развитии.
        </div>

        <button
          className="px-8 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200 ">
          Все курсы
        </button>

      </div>


      <HeroAnimation />
    </div>
  )
}

export default Hero