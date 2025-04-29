import { prisma } from '../config';

export const getCategoryByName = async (name: string) => {
  const user = await prisma.categories.findUnique({
    where: { name },
  });

  return user;
};

export const getCategoryById = async (id: string) => {
  const user = await prisma.categories.findUnique({
    where: { id },
  });

  return user;
};
