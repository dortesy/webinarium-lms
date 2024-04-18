import {getTranslations} from 'next-intl/server';
export default async function Home() {
    const t = await getTranslations();
    return (
        <div>
            <h1>{t('Index.title')}</h1>
        </div>
    );
}
