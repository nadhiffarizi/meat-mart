import { StoreWithAdmin } from '@/interface/store/store.interface';
import prisma from '@/lib/prisma';

export async function getStoresWithAdmin(): Promise<StoreWithAdmin[]> {
  return prisma.stores.findMany({
    where: { deleted_at: null },
    include: {
      storeadmin: {
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
        },
      },
    },
    orderBy: { created_at: 'desc' },
  });
}
