'use client';
import Lottie from 'react-lottie';
import * as animationData from '@/animations/learning.json';

const HeroAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <div className="w-[300px] md:w-[450px] pointer-events-none md:mr-5 order-1 md:order-2">
      <Lottie options={defaultOptions} />
    </div>
  );
};

export default HeroAnimation;
