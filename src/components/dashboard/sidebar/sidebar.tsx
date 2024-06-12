'use client';

import { SidebarRoutes } from '@/components/dashboard/sidebar/sidebar-routes';
import LogoSVG from '@/components/svg/logo';
import SidebarBottomProfile from '@/components/dashboard/sidebar/sidebar-bottom-profile';
import { SidebarBottomMenu } from './sidebar-bottom-menu';

export const Sidebar = () => {
  return (
    <aside className="flex flex-col min-w-64 sticky h-screen px-4 py-4 overflow-y-auto rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700 overflow-x-hidden">
      <div className="mb-10">
        <a href="/" className="w-64">
          <LogoSVG className="fill-black dark:fill-white" />
        </a>
      </div>
      <div className="flex flex-col justify-between h-full">
        <SidebarRoutes />
        <div>
          <SidebarBottomMenu />
          <SidebarBottomProfile />
        </div>
      </div>
    </aside>
  );
};
