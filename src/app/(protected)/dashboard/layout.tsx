import {ReactNode} from "react";
import {Sidebar} from "@/components/dashboard/sidebar/sidebar";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: ReactNode
}) {
    return (
        <main className="lg:max-w-screen-lg  mx-auto flex-1 flex w-full">
        <Sidebar />
        <section className="px-8 py-8 w-full">{children}</section>
        </main>
    )
}