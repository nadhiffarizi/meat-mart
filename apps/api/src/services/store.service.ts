import { statusEnum } from '@/enums/statusEnum.enums';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { Request } from 'express';
import prisma from '@/prisma';
import { getCategoryById, getCategoryByName } from '@/helper/category.prisma';
import { getStoreById } from '@/helper/store.prisma';

class StoreService {
  async getAllStores(req: Request) {
    let allStores;
    if (req.query.includeDeleted === 'true') {
      if (req.query.storeAdminId) {
        allStores = await prisma.stores.findMany({
          where: { storeadmin_id: req.query.storeAdminId as string },
        });
      } else {
        allStores = await prisma.stores.findMany();
      }
    } else {
      if (req.query.storeAdminId) {
        allStores = await prisma.stores.findMany({
          where: {
            storeadmin_id: req.query.storeAdminId as string,
            deleted_at: null,
          },
        });
      } else {
        allStores = await prisma.stores.findMany({
          where: {
            deleted_at: null,
          },
        });
      }
    }

    const feedback: serviceFeedback = {
      code: 200,
      data: allStores,
      status: statusEnum.SUCCESS,
      message: req.query.storeAdminId
        ? `Successfully fetched all stores with storeadmin_id ${req.query.storeAdminId}.`
        : `Successfully fetched all stores.`,
    };
    return feedback;
  }

  async getStore(req: Request) {
    if (!req.query.id) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `ID is required to fetch store.`,
      };
      return feedback;
    }

    const store = await getStoreById(req.query.id as string);

    if (
      (store && store.deleted_at && req.query.includeDeleted !== 'true') ||
      !store
    ) {
      const feedback: serviceFeedback = {
        code: 404,
        data: null,
        status: statusEnum.FAILED,
        message: `Store with ID ${req.query.id} does not exist.`,
      };
      return feedback;
    }

    const feedback: serviceFeedback = {
      code: 200,
      data: store,
      status: statusEnum.SUCCESS,
      message: `Successfully fetched store with ID ${req.query.id}.`,
    };
    return feedback;
  }
}

export default new StoreService();
