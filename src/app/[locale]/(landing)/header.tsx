import Image from "next/image";
import {LoginPanel} from "@/components/auth/login-panel";
import {useLocale} from "next-intl";
import LangSwitcher from "@/components/lang-switcher";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Sidebar} from "@/components/dashboard/sidebar/sidebar";
import {Menu} from "lucide-react";
import LogoSVG from '@/components/svg/logo';
import { useEffect } from 'react';
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
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                    <a href="/" className="w-64"><LogoSVG className="fill-black dark:fill-white" /></a>
                </div>
                <div className="flex items-center gap-x-3 pt-8 pr-4 pb-7">
                    <LangSwitcher locale={locale}/>
                    <LoginPanel/>
                    <MobileSidebar />
                </div>
            </div>
);
};

