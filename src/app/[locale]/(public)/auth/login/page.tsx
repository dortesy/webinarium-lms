import LoginForm from '@/components/auth/login-form';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('LoginForm');
  return {
    title: t('pageTitle'),
  };
}

const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;
