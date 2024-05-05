import { ROUTES } from "@/config/routes";
import {useContext} from "react";
import {CourseContext} from "@/context/course-context";

type BreadcrumbItem = {
    label: string;
    href: string;
    children?: Record<string, BreadcrumbItem>;
};

const breadcrumbItemsMap: Record<string, BreadcrumbItem> = {
    [ROUTES.HOME]: {
        label: "Главная",
        href: ROUTES.HOME,
        children: {
            [ROUTES.TEACHER.MAIN]: {
                label: "Панель управления",
                href: ROUTES.TEACHER.MAIN,
                children: {
                    [ROUTES.TEACHER.COURSES]: {
                        label: "Мои курсы",
                        href: ROUTES.TEACHER.COURSES,
                        children: {
                            "[courseId]": {
                                label: "",
                                href: "", // The actual href will be set dynamically
                                children: {
                                    "/details": {
                                        label: "Детали",
                                        href: "", // The actual href will be set dynamically
                                    },
                                    "/pricing": {
                                        label: "Цены",
                                        href: "", // The actual href will be set dynamically
                                    },
                                    "/outline": {
                                        label: "Программа",
                                        href: "", // The actual href will be set dynamically
                                    },
                                },
                            },
                        },
                    },
                    [ROUTES.TEACHER.PROFILE]: {
                        label: "Профиль",
                        href: ROUTES.TEACHER.PROFILE,
                    },
                },
            },
        },
    },
};

export const GetBreadcrumbItems = (pathname: string): BreadcrumbItem[] => {
    const pathSegments = pathname.split("/").filter(Boolean);
    let currentItem = breadcrumbItemsMap[ROUTES.HOME];
    const items: BreadcrumbItem[] = [currentItem];
    const courseData = useContext(CourseContext);
    let currentPath = "";

    for (const segment of pathSegments) {
        currentPath += `/${segment}`;
        if (currentItem.children && currentItem.children[currentPath]) {
            currentItem = currentItem.children[currentPath];
            items.push(currentItem);
        } else {
            // Handle dynamic segments
            const dynamicRoute = Object.keys(currentItem.children || {}).find((route) =>
                route.includes("[")
            );
            if (dynamicRoute) {
                currentItem = currentItem.children![dynamicRoute];
                items.push({
                    ...currentItem,
                    label: courseData.courseTitle || currentItem.label,
                    href: currentPath,
                });
            }
        }
    }

    return items;
};