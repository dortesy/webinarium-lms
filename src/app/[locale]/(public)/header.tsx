'use client';
import { LoginPanel } from '@/components/header/login-panel';
import { useLocale } from 'next-intl';
import LangSwitcher from '@/components/header/lang-switcher';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Bell, Bookmark, Menu, Search, ShoppingCart } from 'lucide-react';
import LogoSVG from '@/components/svg/logo';
import { SearchInput } from '@/components/header/search-input';
import Categories from '@/components/header/categories';
import React, { useCallback, useEffect, useState } from 'react';
import { CategoryData } from '@/lib/types/category';
import { getAllCategories } from '@/lib/category/category-helper';
import CategoriesMobile from '@/components/header/categories-mobile';
import { usePathname } from '@/navigation';
import { CourseWithSections } from '@/lib/types/course';
import { getCourseByIdWithSections } from '@/lib/course/course-helper';
import { CourseSidebarMobile } from '@/components/header/course-sidebar-mobile';

export const Header = () => {
  const locale = useLocale();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [course, setCourse] = useState<CourseWithSections>(); // [course, setCourse
  const pathname = usePathname();

  const isCoursesPage = pathname.startsWith('/courses/');

  const fetchCategories = useCallback(async () => {
    try {
      const categoriesData = await getAllCategories();
      if (categoriesData) {
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCourse = useCallback(async (courseId: string) => {
    try {
      const courseData = await getCourseByIdWithSections(courseId);
      if (courseData) {
        setCourse(courseData);
      }
    } catch (error) {
      console.error('Failed to fetch course:', error);
    }
  }, []);

  useEffect(() => {
    if (pathname.startsWith('/courses/')) {
      // Extract the course ID from the pathname
      const id = pathname.split('/courses/')[1];

      fetchCourse(id);
    }
  }, [pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const MobileSidebar = () => {
    return (
      <div className="flex space-x-2">
        {course && <CourseSidebarMobile course={course} />}

        <Sheet modal={false}>
          <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition dark:text-gray-100">
            <Search size={20} />
          </SheetTrigger>

          <SheetContent
            side="top"
            className="max-w-full p-4 pt-8 bg-white overflow-hidden "
          >
            <SearchInput />
          </SheetContent>
        </Sheet>

        <Sheet open={isSidebarOpen} onOpenChange={toggleSidebar}>
          <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition dark:text-gray-100">
            <Menu />
          </SheetTrigger>

          <SheetContent side="left" className="w-[300px] p-4 pt-8 bg-white">
            <LoginPanel />

            {categories.length > 0 && (
              <CategoriesMobile categories={categories} />
            )}

            <div className="flex gap-x-4 mt-12 mb-12">
              <ShoppingCart
                strokeWidth={1}
                className="cursor-pointer dark:text-white hover:text-blue-600 dark:hover:text-blue-300 transition-all md:hidden"
              />
              <Bookmark
                strokeWidth={1}
                className="cursor-pointer dark:text-white hover:text-blue-600 dark:hover:text-blue-300 transition-all md:hidden"
              />
              <Bell
                strokeWidth={1}
                className="cursor-pointer dark:text-white hover:text-blue-600 dark:hover:text-blue-300 transition-all md:hidden"
              />
            </div>

            <LangSwitcher locale={locale} />
          </SheetContent>
        </Sheet>
      </div>
    );
  };

  return (
    <div className="mx-full flex items-center justify-between h-20 dark:bg-web-gray z-200 w-full">
      <div className="flex items-center gap-x-3 pl-4">
        <a href="/" className="w-48 md:w-64">
          <LogoSVG className="fill-black dark:fill-white" />
        </a>
      </div>

      <div className="items-center gap-x-3 flex-1 pl-5 pr-5 hidden md:flex">
        <SearchInput />

        <div className="flex items-center gap-x-6">
          {categories.length > 0 && <Categories categories={categories} />}

          <ShoppingCart
            strokeWidth={1}
            className="cursor-pointer dark:text-white hover:text-blue-600 dark:hover:text-blue-300 transition-all"
          />
          <Bookmark
            strokeWidth={1}
            className="cursor-pointer dark:text-white hover:text-blue-600 dark:hover:text-blue-300  transition-all"
          />
          <Bell
            strokeWidth={1}
            className="cursor-pointer dark:text-white hover:text-blue-600 dark:hover:text-blue-300 transition-all"
          />
        </div>
      </div>

      <div className="hidden md:flex items-center gap-x-3">
        <LangSwitcher locale={locale} />
        <LoginPanel />
      </div>

      <MobileSidebar />
    </div>
  );
};
