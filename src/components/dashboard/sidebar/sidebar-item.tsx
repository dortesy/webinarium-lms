'use client'
import Link from "next/link";
import {LucideIcon} from "lucide-react";

interface SidebarItemProps {
    icon: LucideIcon
    label: string;
    href: string;
}

export const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
    return (
        <li className="mt-2 space-y-1">
            <Link href={href} className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-700">
                <Icon className="w-6 h-6 mr-2 stroke-gray-600" strokeWidth={1}/>
                <span className="text-gray-800">{label}</span>
            </Link>
        </li>

    )
}