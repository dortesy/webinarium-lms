'use client'
import Link from "next/link";
import {LucideIcon} from "lucide-react";
import {usePathname, useRouter} from "@/navigation";
import {cn} from "@/lib/utils";

interface SidebarItemProps {
    icon: LucideIcon
    label: string;
    href: string;
}

export const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {

    const pathName = usePathname()

    const isActive = (pathName === "/" && href === "/") || pathName === href || pathName?.startsWith(`${href}/`)

    // const onClick = () => {
    //     router.push(href)
    // }

    return (
        <li className="mt-2 space-y-1" >
            <a href={href} className={cn("flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-700", isActive && "bg-gray-100")}>
                <Icon className={cn("w-6 h-6 mr-2 stroke-gray-600", isActive && "stroke-blue-700")} strokeWidth={1}/>
                <span className={cn('text-gray-700', isActive && "text-blue-700")}>{label}</span>
            </a>
        </li>

    )
}