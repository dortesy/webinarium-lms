'use client'
import {SidebarRoutes} from "@/components/dashboard/sidebar/sidebar-routes";

export const Sidebar = () => {
    return (
        <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
                <SidebarRoutes/>
        </aside>
)
}