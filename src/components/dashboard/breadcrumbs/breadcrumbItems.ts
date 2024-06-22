'use client';

import { ROUTES } from '@/config/routes';
import { useEffect, useState } from 'react';
import { getCourseTitleById } from '@/lib/course/course-helper';

type BreadcrumbItem = {
  label: string;
  href: string;
  children?: Record<string, BreadcrumbItem>;
};

const breadcrumbItemsMap: Record<string, BreadcrumbItem> = {
  [ROUTES.HOME]: {
    label: 'Главная',
    href: ROUTES.HOME,
    children: {
      [ROUTES.DASHBOARD]: {
        label: 'Панель управления',
        href: ROUTES.DASHBOARD,
        children: {
          [ROUTES.TEACHER.COURSES]: {
            label: 'Мои курсы',
            href: ROUTES.TEACHER.COURSES,
            children: {
              [ROUTES.TEACHER.ADD_COURSE]: {
                label: 'Добавление курса',
                href: ROUTES.TEACHER.ADD_COURSE,
              },
              '[courseId]': {
                label: '',
                href: '', // The actual href will be set dynamically
                children: {
                  '/details': {
                    label: 'Детали',
                    href: '', // The actual href will be set dynamically
                  },
                  '/pricing': {
                    label: 'Цены',
                    href: '', // The actual href will be set dynamically
                  },
                  '/outline': {
                    label: 'Программа',
                    href: '', // The actual href will be set dynamically
                  },
                },
              },
            },
          },
          [ROUTES.TEACHER.PROFILE]: {
            label: 'Профиль',
            href: ROUTES.TEACHER.PROFILE,
          },
        },
      },
    },
  },
};

export const GetBreadcrumbItems = (pathname: string): BreadcrumbItem[] => {
  const [courseTitle, setCourseTitle] = useState<string>('');

  useEffect(() => {
    const courseRegex = /\/courses\/([a-zA-Z0-9-]+)/;
    const match = pathname.match(courseRegex);

    if (match) {
      const courseId = match[1];
      fetchCourse(courseId);
    }

    async function fetchCourse(courseId: string) {
      const courseData = await getCourseTitleById(courseId);
      if (courseData) {
        setCourseTitle(courseData.title);
      }
    }
  }, [pathname]);

  const pathSegments = pathname.split('/').filter(Boolean);
  let currentItem = breadcrumbItemsMap[ROUTES.HOME];
  const items: BreadcrumbItem[] = [currentItem];
  let currentPath = '';

  for (const segment of pathSegments) {
    currentPath += `/${segment}`;
    if (currentItem.children && currentItem.children[currentPath]) {
      currentItem = currentItem.children[currentPath];
      items.push(currentItem);
    } else {
      // Handle dynamic segments
      const dynamicRoute = Object.keys(currentItem.children || {}).find(
        (route) => route.includes('['),
      );
      if (dynamicRoute) {
        currentItem = currentItem.children![dynamicRoute];
        items.push({
          ...currentItem,
          label: courseTitle || currentItem.label,
          href: currentPath,
        });
      }
    }
  }

  return items;
};
