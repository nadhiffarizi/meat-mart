import { statusEnum } from '@/enums/statusEnum.enums';
import prisma from '@/prisma';

export const getSuperAdminByEmail = async (email: string) => {
  const superAdmin = await prisma.users.findUnique({
    where: { email: email as string, role: 'SUPER_ADMIN' },
    select: { id: true },
  });

  return superAdmin;
};
