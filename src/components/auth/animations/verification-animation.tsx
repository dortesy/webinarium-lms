'use client';
import Lottie from 'react-lottie';
import * as animationData from '@/animations/verification.json';

const VerificationAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <Lottie
      options={defaultOptions}
      height={500}
      width={500}
      isClickToPauseDisabled={true}
    />
  );
};

export default VerificationAnimation;
