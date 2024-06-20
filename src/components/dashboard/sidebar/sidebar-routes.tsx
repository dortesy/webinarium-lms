'use client';
import { SidebarItem } from '@/components/dashboard/sidebar/sidebar-item';
import {
  GraduationCap,
  UserCircle,
  BookOpenText,
  Receipt,
  ListVideo,
  LayoutDashboard,
  MoveLeft,
  MoveRight,
  Goal,
} from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { SidebarItems } from './sidebar-items';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SidebarRoutes = () => {
  const params = useParams();
  const courseId = params.courseId ? (params.courseId as string) : undefined;
  const [activeMenu, setActiveMenu] = useState<string | undefined>(courseId);
  const t = useTranslations('SidebarLabels');
  console.log(activeMenu);
  console.log(courseId);
  console.log(useParams());
  console.log(params);

  useEffect(() => {
    if (courseId) {
      setActiveMenu(courseId);
    }
  }, [courseId]);

  const handleBackToMainPanel = () => {
    setActiveMenu(undefined);
  };
  const handleBackToCoursePanel = () => {
    setActiveMenu(courseId);
  };

  const mainRoutes = [
    {
      label: t('mainHeader'),
      href: ROUTES.DASHBOARD,
      icon: LayoutDashboard,
    },
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
      label: t('courseGoals'),
      href: ROUTES.TEACHER.COURSE.GOALS(courseId),
      icon: Goal,
    },
    {
      label: t('coursePricing'),
      href: ROUTES.TEACHER.COURSE.PRICING(courseId),
      icon: Receipt,
    },
  ];

  const variants = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {courseId ? (
          activeMenu ? (
            <motion.div
              key="courseMenu"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.1 }}
              className="absolute top-0 left-0 w-full h-full"
            >
              <div
                className="pb-3 mb-3 space-x-2 flex items-center text-xs text-gray-700 cursor-pointer"
                onClick={handleBackToMainPanel}
              >
                <MoveLeft size={16} /> <span>{t('backToMainPanel')}</span>
              </div>
              <SidebarItems
                items={courseRoutes}
                sidebarHeader={t('courseHeader')}
              />
            </motion.div>
          ) : (
            <motion.div
              key="mainMenu"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.1 }}
              className="absolute top-0 left-0 w-full h-full"
            >
              <div
                className="pb-3 mb-3 space-x-2 flex items-center text-xs text-gray-700 cursor-pointer"
                onClick={handleBackToCoursePanel}
              >
                <MoveRight size={16} /> <span>{t('backToCourse')}</span>
              </div>
              <SidebarItems
                items={mainRoutes}
                sidebarHeader={t('sidebarHeader')}
              />
            </motion.div>
          )
        ) : (
          <motion.div
            key="initialMenu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 w-full h-full"
          >
            <SidebarItems
              items={mainRoutes}
              sidebarHeader={t('sidebarHeader')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
