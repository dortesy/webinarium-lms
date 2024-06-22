import { EditProfileForm } from '@/components/dashboard/profile/edit-profile-form';
import { currentUser } from '@/lib/auth';
import { getUserById } from '@/lib/auth/auth-helper';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { EditProfileFormSkeleton } from '@/components/dashboard/teacher/course/skeletons/edit-profile-form-skeleton';

export const metadata: Metadata = {
  title: 'Редактирование профиля',
};

const TeacherProfilePage = async () => {
  const t = await getTranslations('ProfileForm');
  const user = await currentUser();

  if (!user) {
    return <div>{t('errors.noAccess')}</div>;
  }

  const completedUser = await getUserById(user.id!);

  if (!completedUser) {
    return <div>{t('errors.noAccess')}</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-2 mt-4">{t('title')}</h1>
      <EditProfileForm user={completedUser} />
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<EditProfileFormSkeleton />}>
      <TeacherProfilePage />
    </Suspense>
  );
};

export default Page;
