import TestDummy from '@/components/test-dummy';
import TestToast from '@/components/test-toast';
import {getTranslations} from 'next-intl/server';
export default async function Home() {
    const t = await getTranslations();
    return (
        <div>
            <h1>{t('Index.title')}</h1>
            <TestDummy />
        </div>
    );
}
