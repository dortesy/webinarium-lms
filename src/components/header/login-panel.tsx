'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCurrentUser } from '@/hooks/use-current-user';
import {
  CircleUserRound,
  LibraryBig,
  LogOut,
  LucideIcon,
  Settings,
} from 'lucide-react';
import { FC, ReactNode, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/config/routes';

interface MenuItemProps {
  href?: string;
  onClick?: () => void;
  icon: LucideIcon;
  children: ReactNode;
}

interface IconProps {
  className?: string;
  strokeWidth?: number;
}

const MenuItem: FC<MenuItemProps> = ({
  href,
  onClick,
  icon: Icon,
  children,
}) => {
  const iconClassName = 'mr-2 h-4 w-4';

  if (href) {
    return (
      <DropdownMenuItem asChild>
        <Link href={href}>
          <Icon className={iconClassName} strokeWidth={1} />
          {children}
        </Link>
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem onClick={onClick}>
      <Icon className={iconClassName} strokeWidth={1} />
      {children}
    </DropdownMenuItem>
  );
};

export const LoginPanel: FC = () => {
  const user = useCurrentUser();
  const t = useTranslations('LoginPanel');
  useEffect(() => {
    const header = document.getElementById('header');

    if (window.scrollY > 80) {
      header?.classList.add('bg-white', 'shadow-sm', 'dark:bg-web-gray');
    }

    const handleScroll = () => {
      if (header) {
        if (window.scrollY > 80) {
          header.classList.add('bg-white', 'shadow-sm', 'dark:bg-web-gray');
        } else {
          header.classList.remove('bg-white', 'shadow-sm', 'dark:bg-web-gray');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="flex items-center gap-x-3 md:pt-8 pr-4 pb-7 flex-1">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus-visible: outline-none">
            <Avatar className="border-2">
              {user.image ? (
                <AvatarImage
                  src={user.image}
                  alt={user.email}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback>
                {user.email.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <MenuItem href={ROUTES.DASHBOARD} icon={CircleUserRound}>
              {t('profile')}
            </MenuItem>
            <MenuItem icon={LibraryBig}>{t('myCourses')}</MenuItem>
            <MenuItem icon={Settings}>{t('settings')}</MenuItem>
            <MenuItem onClick={handleLogout} icon={LogOut}>
              {t('logout')}
            </MenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="space-y-2 md:space-y-0 md:space-x-3 flex flex-col w-full md:flex-row">
          <Button variant="blueOutline" className="dark:text-white" asChild>
            <a href={ROUTES.AUTH.LOGIN}>{t('login')}</a>
          </Button>

          <Button className="dark:text-white" asChild>
            <a href={ROUTES.AUTH.REGISTRATION}>{t('register')}</a>
          </Button>
        </div>
      )}
    </div>
  );
};
