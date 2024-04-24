'use client'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {ROUTES} from "@/config/routes";
import {usePathname} from "@/navigation";
import {getBreadcrumbItems} from "@/components/dashboard/breadcrumbs/breadcrumbItems";
import {Fragment} from "react";
export const Breadcrumbs = () => {
    const pathname = usePathname();
    const items = getBreadcrumbItems(pathname);

    return (
        <Breadcrumb className="pl-8 pt-8 pb-4">
            <BreadcrumbList>
                {items.map((item, index) => (
                    <Fragment key={item.href}>
                        {index !== 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem>
                             {index == items.length - 1 ? (<BreadcrumbPage>{item.label}</BreadcrumbPage>) : (<BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>)}
                        </BreadcrumbItem>
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}