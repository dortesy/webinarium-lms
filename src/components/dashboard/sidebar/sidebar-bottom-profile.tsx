'use client';
import { useCurrentUser } from '@/hooks/use-current-user';
import { CircleUser } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'use-intl';

const SidebarBottomProfile = () => {
  const t = useTranslations('SidebarLabels');
  const user = useCurrentUser();
  if (!user) {
    return <div>User not found</div>;
  }
  return (
    <div className="flex py-4 px-4  border-t border-gray-200 items-center ">
      <div className="rounded-full w-10 h-10 min-w-10 relative">
        {user.image ? (
          <Image
            fill
            sizes="100px"
            src={user.image}
            alt={user.email}
            className="rounded-full w-full object-cover h-full"
          />
        ) : (
          <CircleUser strokeWidth={1} className="text-blue-500 w-full h-full" />
        )}
      </div>
      <div className="truncate">
        <div className=" text-sm flex-1 ml-2 truncate">{user.email}</div>
        <div className="line-clamp-1 font-light text-gray-500 text-sm ml-2">
          {t('profileRoleInstructor')}
        </div>
      </div>
    </div>
  );
};

export default SidebarBottomProfile;
