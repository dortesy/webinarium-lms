'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Header } from '@/components/auth/header';
import { BackButton } from '@/components/auth/back-button';
import { Social } from '@/components/auth/social';
import { ReactNode } from 'react';

interface CardWrapperProps {
  children: ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
  animation: ReactNode;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
  animation,
}: CardWrapperProps) => {
  return (
    <div className="lg:max-w-screen-2xl min-h-[calc(100vh-120px)]   flex flex-row items-center justify-around mx-auto w-full shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] rounded-lg bg-white mt-4">
      <div className="text-sm align-center w-1/2 bg-sky-50 min-h-[calc(100vh-120px)] flex items-center">
        {animation}
      </div>

      <div className="flex flex-col items-center min-h-[calc(100vh-120px)] justify-center w-1/2">
        <div>
          <Card className="w-[400px] border-0 shadow-none ">
            <CardHeader>
              <Header label={headerLabel} />
            </CardHeader>
            <CardContent>{children}</CardContent>
            {showSocial && (
              <CardFooter>
                <Social />
              </CardFooter>
            )}

            <CardFooter>
              <BackButton href={backButtonHref} label={backButtonLabel} />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
