'use client'
import Lottie from 'react-lottie';
import * as animationData from '@/animations/learning.json'

const HeroAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  return <Lottie options={defaultOptions}
                 height={400}
                 width={400}/>
}

export default HeroAnimation