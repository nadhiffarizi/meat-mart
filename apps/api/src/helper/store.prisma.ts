import prisma from '@/prisma';

export const getSuperAdminByEmail = async (email: string) => {
  const superAdmin = await prisma.users.findUnique({
    where: { email: email as string, role: 'SUPER_ADMIN' },
    select: { id: true },
  });

  return superAdmin;
};

export const getStoreById = async (id: string) => {
  const store = await prisma.stores.findUnique({
    where: { id: id },
  });

  return store;
};
