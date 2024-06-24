'use server';
// Assuming db is properly instantiated Prisma Client
import { db } from '@/lib/db';

export const getAllCategories = async () => {
  try {
    const categories = await db.category.findMany({
      where: { parentId: null },
      include: {
        children: true,
      },
    });
    return categories.map((cat) => ({
      value: cat.id,
      label: cat.name,
      children: cat.children.map((child) => ({
        value: child.id,
        label: child.name,
      })),
    }));
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return []; // Return an empty array if there's an error
  }
};
