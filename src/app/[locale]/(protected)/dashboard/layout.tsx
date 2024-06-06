import {ReactNode} from "react";
import {Sidebar} from "@/components/dashboard/sidebar/sidebar";
import {Breadcrumbs} from "@/components/dashboard/breadcrumbs/breadcrumbs";


export default function DashboardLayout({
                                            children,
                                        }: {
    children: ReactNode
}) {

    return (
        <>
            <Breadcrumbs/>
            <div className="flex">
                <div className="hidden md:flex h-full w-64 flex-col inset-y-0 z-10">
                 <Sidebar/>
                </div>
                <section className="flex-1 px-8 py-8 w-full h-full mt-10 mb-10 overflow-x-auto bg-white rounded-lg shadow-sm">{children}</section>
            </div>
        </>
    )
}