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
import {CircleUserRound, LibraryBig, LogOut, LucideIcon, Settings} from 'lucide-react';
import {FC, ReactNode} from "react";
import {useTranslations} from "next-intl";


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


const MenuItem: FC<MenuItemProps> = ({ href, onClick, icon: Icon, children }) => {
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
            <Icon className={iconClassName} strokeWidth={1}/>
            {children}
        </DropdownMenuItem>
    );
};

export const LoginPanel: FC = () => {
    const user = useCurrentUser();
    const t = useTranslations('LoginPanel')

    const handleLogout = () => {
        signOut();
    };

    return (
        <div className="flex items-center gap-x-3 pt-8 pr-4 pb-7">
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger className="focus-visible: outline-none">
                        <Avatar className="border-2">
                            {user.image ? <AvatarImage  src={user.image} alt={user.email} /> : null}
                            <AvatarFallback >{user.email.slice(0, 1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <MenuItem href="/dashboard" icon={CircleUserRound}>
                            {t('profile')}
                        </MenuItem>
                        <MenuItem icon={LibraryBig}>{t('profile')}</MenuItem>
                        <MenuItem icon={Settings}>{t('settings')}</MenuItem>
                        <MenuItem onClick={handleLogout} icon={LogOut}>
                            {t('logout')}
                        </MenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div>
                    <Link href="/auth/login" passHref>
                        <Button variant="ghost">{t('login')}</Button>
                    </Link>
                    <Link href="/auth/register" passHref>
                        <Button variant="outline">{t('register')}</Button>
                    </Link>
                </div>
            )}
        </div>
    );
};