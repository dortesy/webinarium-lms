'use client'
import {SidebarItem} from "@/components/dashboard/sidebar/sidebar-item";
import {GraduationCap, UserRoundCog} from "lucide-react";

export const SidebarRoutes = () => {
    const routes = [
        {
            label: "Мои курсы",
            href: "/dashboard/teacher/courses",
            icon: GraduationCap,
        },
        {
            label: "Профиль",
            href: "/dashboard/teacher/profile",
            icon: UserRoundCog,
        },
    ]

    return (
        <nav>
            <h3 className="text-xs font-medium uppercase text-gray-400">Панель инструктора</h3>
            <ul className="flex flex-col space-y-2">
            {routes.map ((route) => (
                <SidebarItem key={route.href} label={route.label} href={route.href} icon={route.icon} />
            ))}
            </ul>
        </nav>
    )
}
