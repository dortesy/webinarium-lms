import {ReactNode} from "react";
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
                <Sidebar/>
                <section className="flex-1 px-8 py-8 w-full overflow-x-auto">{children}</section>
            </div>
        </CourseProvider>
    )
}