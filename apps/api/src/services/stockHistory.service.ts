import { statusEnum } from '@/enums/statusEnum.enums';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { Request } from 'express';
import prisma from '@/prisma';
import { getCategoryById, getCategoryByName } from '@/helper/category.prisma';
import dayjs from 'dayjs';

class StockHistoryService {
  async getAllStockHistoriesInAMonth(req: Request) {
    if (
      !req.query.storeId ||
      !req.query.productId ||
      !req.query.month ||
      !req.query.year
    ) {
      const feedback: serviceFeedback = {
        code: 400,
        data: {},
        status: statusEnum.FAILED,
        message: `storeId, productId, month, and year is required to fetch stock histories.`,
      };
      return feedback;
    }

    const startDate = dayjs(`${req.query.year}-${req.query.month}-01`)
      .startOf('month')
      .toDate();
    const endDate = dayjs(startDate).add(1, 'month').toDate();

    const allStockHistories = await prisma.stockHistory.findMany({
      where: {
        store_id: req.query.storeId as string,
        product_id: req.query.productId as string,
        created_at: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        products: true,
      },
    });

    const feedback: serviceFeedback = {
      code: 200,
      data: allStockHistories,
      status: statusEnum.SUCCESS,
      message: `Successfully fetched all stock histories.`,
    };
    return feedback;
  }
  async getStockHistoryRangeByStoreAndProduct(req: Request) {
    if (!req.query.storeId || !req.query.productId) {
      const feedback: serviceFeedback = {
        code: 400,
        data: {},
        status: statusEnum.FAILED,
        message: `storeId and productId, are required to fetch stock history range by product.`,
      };
      return feedback;
    }

    const earliestRecord = await prisma.stockHistory.findFirst({
      where: {
        store_id: req.query.storeId as string,
        product_id: req.query.productId as string,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    const latestRecord = await prisma.stockHistory.findFirst({
      where: {
        store_id: req.query.storeId as string,
        product_id: req.query.productId as string,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const feedback: serviceFeedback = {
      code: 200,
      data: { earliestRecord: earliestRecord, latestRecord: latestRecord },
      status: statusEnum.SUCCESS,
      message: `Successfully fetched the earliest and latest stockHistory records of storeId ${req.query.storeId} and productId ${req.query.productId}.`,
    };
    return feedback;
  }
}

export default new StockHistoryService();
