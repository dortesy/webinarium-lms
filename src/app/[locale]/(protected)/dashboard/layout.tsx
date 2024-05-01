import {ReactNode, Suspense} from "react";
import {Sidebar} from "@/components/dashboard/sidebar/sidebar";
import {Breadcrumbs} from "@/components/dashboard/breadcrumbs/breadcrumbs";

import CourseProvider from "@/providers/course-provider";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: ReactNode
}) {

    return (
        <CourseProvider>
            <Breadcrumbs/>
            <div className="flex">
                <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50 mt-32">
                 <Sidebar/>
                </div>
                <section className="flex-1 px-8 py-8 w-full overflow-x-auto md:pl-64">{children}</section>
            </div>
        </CourseProvider>
    )
}