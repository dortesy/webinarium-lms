'use client'
import { useRouter, usePathname } from '@/navigation';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {useParams} from "next/navigation";
import {useTransition} from "react";
import { RU, UZ } from 'country-flag-icons/react/3x2'

type props = {
    locale: string
}
export default function LangSwitcher ({locale}: props) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const [isPending, startTransition] = useTransition();


    function onSelectChange(value: string) {
        const nextLocale = value
        startTransition(() => {
            router.replace(
                pathname,
                {...params, locale: nextLocale}
            );
        });
    }


    return (
        <Select defaultValue={locale} onValueChange={onSelectChange}>
            <SelectTrigger className="w-[110px] dark:text-white dark:bg-gray-950 ">
                <SelectValue placeholder="Выбрать язык" className="dark:border-white dark:text-white dark:hidden" />
            </SelectTrigger>
            <SelectContent className="dark:text-white dark:hidden">
                <SelectGroup className="dark:hidden">
                    <SelectItem value="ru" >
                        <div className="flex items-center">
                            <RU width={22} height={22}/>
                            <SelectLabel className="pl-2">RU</SelectLabel>
                        </div>
                    </SelectItem>
                    <SelectItem value="uz">
                        <div className="flex items-center">
                            <UZ width={22} height={22}/>
                            <SelectLabel className="pl-2">UZ</SelectLabel>
                        </div>
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )



}