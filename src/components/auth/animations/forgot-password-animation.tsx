'use client';
import Lottie from 'react-lottie';
import * as animationData from '@/animations/forgot-password.json';

const ForgotPasswordAnimation = () => {
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
      height={450}
      width={450}
      isClickToPauseDisabled={true}
    />
  );
};

export default ForgotPasswordAnimation;
