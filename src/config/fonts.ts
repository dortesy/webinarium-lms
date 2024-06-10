// src/config/fonts.js
import localFont from 'next/font/local';

export const golos = localFont({
  src: [
    {
      path: '../../public/fonts/GolosText-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GolosText-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GolosText-DemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GolosText-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GolosText-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
});

