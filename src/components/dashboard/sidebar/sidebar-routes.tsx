'use client'
import { usePathname } from 'next/navigation';
import { SidebarItem } from "@/components/dashboard/sidebar/sidebar-item";
import {
    GraduationCap,
    UserCircle,
    ArrowLeft,
    Info,
    DollarSign,
    Book,
    FileText,
    Banknote,
    Rows3,
    ReceiptText
} from "lucide-react";
import { ROUTES } from "@/config/routes";
import {useTranslations} from "next-intl";

export const SidebarRoutes = () => {
    const pathname = usePathname();
    const courseId = pathname?.split('/').pop();
    const t = useTranslations('SidebarLabels')

    const mainRoutes = [
        {
            label: t('courses'),
            href: ROUTES.TEACHER.COURSES,
            icon: GraduationCap,
        },
        {
            label: t('profile'),
            href: ROUTES.TEACHER.PROFILE,
            icon: UserCircle,
        },
    ];

    const courseRoutes = [
        {
            label: t('courseDetails'),
            href: `${ROUTES.TEACHER.COURSES}/${courseId}/details`,
            icon: ReceiptText,
        },
        {
            label: t('coursePricing'),
            href: `${ROUTES.TEACHER.COURSES}/${courseId}/pricing`,
            icon: Banknote,
        },
        {
            label: t('courseContent'),
            href: `${ROUTES.TEACHER.COURSES}/${courseId}/outline`,
            icon: Rows3,
        },
    ];

    const isCourseRoute = pathname?.includes(`${ROUTES.TEACHER.COURSES}/`);

    return (
        <nav>
            <h3 className="text-xs font-medium uppercase text-gray-400">Панель инструктора</h3>
            <ul className="flex flex-col space-y-2">
                {isCourseRoute
                    ? courseRoutes.map((route) => (
                        <SidebarItem
                            key={route.href}
                            label={route.label}
                            href={route.href}
                            icon={route.icon}
                        />
                    ))
                    : mainRoutes.map((route) => (
                        <SidebarItem
                            key={route.href}
                            label={route.label}
                            href={route.href}
                            icon={route.icon}
                        />
                    ))}
            </ul>
        </nav>
    );
};