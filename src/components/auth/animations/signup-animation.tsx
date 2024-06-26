'use client';
import Lottie from 'react-lottie';
import * as animationData from '@/animations/sign-up.json';

const SignUpAnimation = () => {
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
      height={400}
      width={500}
      isClickToPauseDisabled={true}
    />
  );
};

export default SignUpAnimation;
