import Image from "next/image";
import {LoginPanel} from "@/components/auth/login-panel";
import {useLocale} from "next-intl";
import LangSwitcher from "@/components/lang-switcher";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Sidebar} from "@/components/dashboard/sidebar/sidebar";
import {Menu} from "lucide-react";
import {Navbar} from "@/components/custom-ui/navbar";

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
        <header className="h-20 w-full border-b border-gray-200 px4">
            <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                    <a href="/"><Image src="/logo.svg" height={120} width={200} alt="Webinarium"/></a>
                </div>
                <div className="flex items-center gap-x-3 pt-8 pr-4 pb-7">
                    <LangSwitcher locale={locale}/>
                    <LoginPanel/>
                    <MobileSidebar />
                </div>
                </div>
        </header>
);
};

