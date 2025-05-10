import { prisma } from '../config';

export const getStoreById = async (id: string) => {
  const store = await prisma.stores.findUnique({
    where: { id: id },
  });

  return store;
};
