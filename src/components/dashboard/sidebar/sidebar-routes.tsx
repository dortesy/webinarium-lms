'use client'
import { SidebarItem } from "@/components/dashboard/sidebar/sidebar-item";
import {
    GraduationCap,
    UserCircle,
    Banknote,
    Rows3,
    ReceiptText, BookOpenText, Receipt, ListVideo
} from "lucide-react";
import { ROUTES } from "@/config/routes";
import {useTranslations} from "next-intl";
import {useParams} from "next/navigation";

export const SidebarRoutes = () => {
    const params = useParams();
    const courseId = params.courseId ? params.courseId as string : undefined;
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
            href: ROUTES.TEACHER.COURSE.DETAILS(courseId),
            icon: BookOpenText,
        },
        {
            label: t('courseContent'),
            href: ROUTES.TEACHER.COURSE.OUTLINE(courseId),
            icon: ListVideo,
        },
        {
            label: t('coursePricing'),
            href: ROUTES.TEACHER.COURSE.PRICING(courseId),
            icon: Receipt,
        },

    ];

    let sidebarTitle = courseId ? t('courseHeader') : t('sidebarHeader');

    return (
        <nav>
            <h3 className="text-xs font-medium uppercase text-gray-400">{sidebarTitle}</h3>
            <ul className="flex flex-col space-y-2">
                {courseId
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