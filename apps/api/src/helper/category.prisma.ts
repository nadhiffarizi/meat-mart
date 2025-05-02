import { prisma } from '../config';

export const getCategoryByName = async (name: string) => {
  const category = await prisma.categories.findUnique({
    where: { name: name },
  });

  return category;
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.categories.findUnique({
    where: { id },
  });

  return category;
};
