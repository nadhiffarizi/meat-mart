import { prisma } from '../config';

export const getDiscountByDiscountCode = async (code: string) => {
  const discount = await prisma.discounts.findUnique({
    where: { discount_code: code },
    include: { products: true },
  });

  return discount;
};

export const getDiscountById = async (id: string) => {
  const discount = await prisma.discounts.findUnique({
    where: { id },
    include: { products: true },
  });

  return discount;
};
