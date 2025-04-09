import { prisma } from '../config';

export const getUserByEmail = async (email: string) => {
  const user = await prisma.users.findUnique({
    where: { email },
  });

  return user;
};
