'use client';
import { SidebarItem } from '@/components/dashboard/sidebar/sidebar-item';
import { SidebarItemProps } from '@/lib/types/layout';

interface SidebarItemsProps {
  items: SidebarItemProps[];
  courseId?: string | undefined;
  sidebarHeader: string;
}

export const SidebarItems = ({
  items,
  courseId = undefined,
  sidebarHeader,
}: SidebarItemsProps) => {
  return (
    <nav>
      <h3 className="text-xs font-medium uppercase text-gray-400">
        {sidebarHeader}
      </h3>
      <ul className="flex flex-col space-y-2">
        {items.map((item) => (
          <SidebarItem
            key={item.href}
            label={item.label}
            href={item.href}
            icon={item.icon}
          />
        ))}
      </ul>
    </nav>
  );
};
