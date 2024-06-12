import { LucideIcon } from 'lucide-react';

export type LayoutProps = {
  children: React.ReactNode;
  params: {
    locale: 'ru' | 'uz';
  };
};

export interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

