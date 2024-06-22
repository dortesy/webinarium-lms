'use client';

import Link from '@/components/unsaved-changes/Link';
import { usePathname } from '@/navigation';
import { cn } from '@/lib/utils';
import { SidebarItemProps } from '@/lib/types/layout';

export const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathName = usePathname();

  const isActive = (pathName === '/' && href === '/') || pathName === href;

  // const onClick = () => {
  //     router.push(href)
  // }

  return (
    <li className="mt-2 space-y-1">
      <Link
        href={href}
        className={cn(
          'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-light  hover:bg-gray-100 hover:text-gray-700',
          isActive && 'bg-blue-50',
        )}
      >
        <Icon
          className={cn(
            'w-6 h-6 mr-2 stroke-gray-600',
            isActive && 'stroke-blue-700',
          )}
          strokeWidth={1}
        />
        <span className={cn('text-gray-700', isActive && 'text-blue-500')}>
          {label}
        </span>
      </Link>
    </li>
  );
};
