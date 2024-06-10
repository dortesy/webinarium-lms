import Image from "next/image";
import {LoginPanel} from "@/components/header/login-panel";
import {useLocale} from "next-intl";
import LangSwitcher from "@/components/header/lang-switcher";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Sidebar} from "@/components/dashboard/sidebar/sidebar";
import { Bell, Bookmark, Menu, ShoppingCart } from 'lucide-react';
import LogoSVG from '@/components/svg/logo';
import { useEffect } from 'react';
import { SearchInput } from '@/components/header/search-input';
import Categories from '@/components/header/categories';
export const Header = () => {

    const locale = useLocale();

    const MobileSidebar = () => {
        return (
            <Sheet>
                <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                    <Menu />
                </SheetTrigger>

                <SheetContent side="left" className="p-0 bg-white">
                    <Sidebar/>
                </SheetContent>
            </Sheet>
        )
    }


    return (


            <div className="mx-full flex items-center justify-between h-20 dark:bg-web-gray z-200 w-full">

                <div className="flex items-center gap-x-3 pl-4">
                    <a href="/" className="w-64"><LogoSVG className="fill-black dark:fill-white" /></a>
                </div>

                <div className="flex items-center gap-x-3 w-full pl-5 pr-5">
                  <SearchInput/>

                  <div className="flex items-center gap-x-6">
                    <Categories/>

                    <ShoppingCart strokeWidth={1} className="cursor-pointer dark:text-white hover:text-blue-600 dark:hover:text-blue-300 transition-all" />
                    <Bookmark strokeWidth={1} className="cursor-pointer dark:text-white hover:text-blue-600 dark:hover:text-blue-300  transition-all"/>
                    <Bell strokeWidth={1} className="cursor-pointer dark:text-white hover:text-blue-600 dark:hover:text-blue-300 transition-all"/>
                  </div>
                </div>

                <div className="flex items-center gap-x-3">
                    <LangSwitcher locale={locale}/>
                    <LoginPanel/>
                    <MobileSidebar />
                </div>

            </div>
);
};

