'use client';
import { useCurrentUser } from '@/hooks/use-current-user';
import { CircleUser } from 'lucide-react';

const SidebarBottom = () => {
  const user = useCurrentUser();
  if (!user) {
    return <div>User not found</div>;
  }
  console.log(user);
  return (
    <div className="border bg-blue-50 flex   p-2 rounded-lg  shadow-sm items-center">
      <div className="rounded-full">
        {user.image ? (
          <img
            src={user.image}
            alt={user.email}
            className="rounded-full w-8 h-8"
          />
        ) : (
          <CircleUser strokeWidth={1} className="text-blue-500" />
        )}
      </div>
      <div className="line-clamp-1 text-sm flex-1 ml-2">{user.email}</div>
    </div>
  );
};

export default SidebarBottom;
