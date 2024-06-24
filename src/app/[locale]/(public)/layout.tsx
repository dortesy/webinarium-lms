import '../globals.css';
import { Header } from '@/app/[locale]/(public)/header';
import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '@/i18n';
import { headers } from 'next/headers';
import { Toaster } from '@/components/ui/toaster';
import { LayoutProps } from '@/lib/types/layout';
import { golos } from '@/config/fonts';

const RootLayout: React.FC<LayoutProps> = async ({
  children,
  params: { locale },
}) => {
  const session = await auth();
  const messages = await getMessages(locale);
  const pathname = headers().get('x-next-pathname') as string;
  const coursesRegex = /courses\/[0-9a-fA-F-]+/;
  const headerStyle = 'lg:max-w-screen-2xl mx-auto w-full dark';
  const headerContains = coursesRegex.test(pathname);
  const testContains = pathname.includes('test');

  if (testContains) {
    return (
      <html lang={locale}>
        <body className={golos.className}>
          <main
            className={`${!headerContains ? 'lg:max-w-screen-2xl' : ''}  mx-auto flex-1 w-full box-content`}
          >
            {children}
          </main>
        </body>
      </html>
    );
  }
  return (
    <html lang={locale}>
      <body className={golos.className}>
        <NextIntlClientProvider messages={messages}>
          <SessionProvider session={session}>
            <div className="min-h-screen flex flex-col bg-stone-50">
              <header id="header" className="sticky top-0 z-20 transition-all">
                <div
                  className={`mx-auto w-full ${!headerContains ? 'lg:max-w-screen-2xl' : 'dark'}`}
                >
                  <Header />
                </div>
              </header>

              <main
                className={`${!headerContains ? 'lg:max-w-screen-2xl' : ''}  mx-auto flex-1 w-full box-content`}
              >
                {children}
                <Toaster />
              </main>
            </div>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
