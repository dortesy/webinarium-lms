import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {Messages} from "../global";

// Can be imported from a shared config
export const locales = ['ru', 'uz'] as const;
export const defaultLocale = 'ru' as const;
export const localePrefix = 'always';

export const getMessages = async (locale: string): Promise<Messages> =>
    (await import(`@/messages/${locale}.json`)).default;


export default getRequestConfig(async ({locale}) => {
    // Validate that the incoming `locale` parameter is valid

    const baseLocale = new Intl.Locale(locale).baseName as typeof locales[any];

    if (!locales.includes(baseLocale)) notFound();

    return {
        messages: (await import(`@/messages/${baseLocale}.json`)).default
    };
});