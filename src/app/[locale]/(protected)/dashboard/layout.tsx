import {ReactNode} from "react";
import {Sidebar} from "@/components/dashboard/sidebar/sidebar";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: ReactNode
}) {
    return (
        <>
            <Sidebar/>
            <section className="flex-1 px-8 py-8 w-full overflow-x-auto">{children}</section>
        </>
    )
}