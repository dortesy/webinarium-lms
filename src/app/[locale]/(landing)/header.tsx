import Image from "next/image";
import {LoginPanel} from "@/components/auth/login-panel";
import {useLocale} from "next-intl";
import LangSwitcher from "@/components/lang-switcher";

export const Header = () => {

    const locale = useLocale();

    return (
        <header className="h-20 w-full border-b border-gray-200 px4">
            <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                    <Image src="/logo.svg" height={40} width={40} alt="Webinarium"/>
                    <h1 className="text-2xl font-black">
                        <a href="/">Webinarium</a>
                    </h1>
                </div>
                <div className="flex items-center gap-x-3 pt-8 pr-4 pb-7">
                    <LangSwitcher locale={locale}/>
                    <LoginPanel/>
                </div>

                </div>
        </header>
);
};

