import '../../globals.css';
import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '@/i18n';
import { Toaster } from '@/components/ui/toaster';
import { TTNorms } from '@/config/fonts';
import { LayoutProps } from '@/lib/types/layout';
import { Sidebar } from '@/components/dashboard/sidebar/sidebar';
import { Breadcrumbs } from '@/components/dashboard/breadcrumbs/breadcrumbs';
import UnsavedChangesProvider from '@/providers/UnsavedChangesProvider';

const RootLayout: React.FC<LayoutProps> = async ({
  children,
  params: { locale },
}) => {
  const session = await auth();
  const messages = await getMessages(locale);
  //const pathname = headers().get('x-next-pathname') as string;

  return (
    <html lang={locale}>
      <body className={TTNorms.className}>
        <NextIntlClientProvider messages={messages}>
          <SessionProvider session={session}>
            <UnsavedChangesProvider>
              <div className="grid grid-cols-7 bg-neutral-50">
                <aside className="self-start sticky top-0 col-span-1 bg-white pr-4">
                  <Sidebar />
                </aside>

                <main className="col-span-6">
                  <Breadcrumbs />
                  <div className="container mr-auto ml-5 pt-10 bg-white shadow-sm mt-5 rounded-xl pb-10">
                    {children}
                  </div>
                  <Toaster />
                </main>
              </div>
            </UnsavedChangesProvider>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
