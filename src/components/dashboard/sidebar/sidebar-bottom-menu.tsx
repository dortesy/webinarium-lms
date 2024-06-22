'use client';
import { Bell, CircleHelp, Settings } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { SidebarItems } from './sidebar-items';
import { AnimatePresence, motion } from 'framer-motion';

export const SidebarBottomMenu = () => {
  const params = useParams();
  const t = useTranslations('SidebarLabels');

  const mainRoutes = [
    {
      label: t('profileSettings'),
      href: ROUTES.TEACHER.SETTINGS,
      icon: Settings,
    },
    {
      label: t('profileNotifications'),
      href: ROUTES.TEACHER.NOTIFICATIONS,
      icon: Bell,
    },
    {
      label: t('profileGetHelp'),
      href: ROUTES.TEACHER.HELP,
      icon: CircleHelp,
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
        <motion.div
          key="initialMenu"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          <SidebarItems items={mainRoutes} sidebarHeader={''} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
