'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ROUTES } from '@/config/routes';
import { Link, usePathname, useRouter } from '@/navigation';
import { GetBreadcrumbItems } from '@/components/dashboard/breadcrumbs/breadcrumbItems';
import { Fragment } from 'react';
export const Breadcrumbs = () => {
  const pathname = usePathname();
  const items = GetBreadcrumbItems(pathname);

  return (
    <Breadcrumb className="pl-8 mt-2 pt-4">
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.href}>
            {index !== 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {index == items.length - 1 ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

