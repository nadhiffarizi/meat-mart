import { statusEnum } from '@/enums/statusEnum.enums';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { Request } from 'express';
import prisma from '@/prisma';
import dayjs from 'dayjs';

class StockService {
  async getAllStocks(req: Request) {
    let allStocks;
    if (req.query.includeDeleted === 'true') {
      if (req.query.storeId) {
        allStocks = await prisma.stocks.findMany({
          where: { store_id: req.query.storeId as string },
          include: { products: true },
        });
      } else {
        allStocks = await prisma.stocks.findMany({
          include: { products: true },
        });
      }
    } else {
      if (req.query.storeId) {
        allStocks = await prisma.stocks.findMany({
          where: { store_id: req.query.storeId as string, deleted_at: null },
          include: { products: true },
        });
      } else {
        allStocks = await prisma.stocks.findMany({
          where: {
            deleted_at: null,
          },
          include: { products: true },
        });
      }
    }

    const feedback: serviceFeedback = {
      code: 200,
      data: allStocks,
      status: statusEnum.SUCCESS,
      message: req.query.storeId
        ? `Successfully fetched all stocks with store_id ${req.query.storeId}.`
        : `Successfully fetched all stocks.`,
    };
    return feedback;
  }

  async getStock(req: Request) {
    if (!req.query.productId && !req.query.storeId) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `Product ID and Store ID is required to fetch stock.`,
      };
      return feedback;
    }

    const stock = await prisma.stocks.findFirst({
      where: {
        product_id: req.query.productId as string,
        store_id: req.query.storeId as string,
      },
      include: {
        products: true,
      },
    });

    if (
      (stock && stock.deleted_at && req.query.includeDeleted !== 'true') ||
      !stock
    ) {
      const feedback: serviceFeedback = {
        code: 404,
        data: null,
        status: statusEnum.FAILED,
        message: `Stock with product_id ${req.query.productId} and store_id ${req.query.storeId} does not exist.`,
      };
      return feedback;
    }

    const feedback: serviceFeedback = {
      code: 200,
      data: stock,
      status: statusEnum.SUCCESS,
      message: `Successfully fetched stock with product_id ${req.query.productId} and store_id ${req.query.storeId}.`,
    };
    return feedback;
  }

  async getAllStockSummary(req: Request) {
    if (!req.query.storeId || !req.query.month || !req.query.year) {
      const feedback: serviceFeedback = {
        code: 400,
        data: {},
        status: statusEnum.FAILED,
        message: `storeId, month, and year are required to fetch stock summary.`,
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
        created_at: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        products: true,
      },
    });

    const productNameMap: Record<string, string> = {};

    const stockHistorySummary = allStockHistories.reduce(
      (summary, stockHistory) => {
        if (stockHistory.status === 'SNAPSHOT') return summary;

        if (!productNameMap[stockHistory.product_id]) {
          productNameMap[stockHistory.product_id] = stockHistory.products.name;
        }

        if (!summary[stockHistory.product_id]) {
          summary[stockHistory.product_id] = 0;
        }

        if (stockHistory.status === 'ADD') {
          summary[stockHistory.product_id] += stockHistory.quantity;
        } else if (stockHistory.status === 'SUBTRACT') {
          summary[stockHistory.product_id] -= stockHistory.quantity;
        }

        return summary;
      },
      {} as Record<string, number>,
    );

    const lastDateOfMonth = dayjs(startDate)
      .endOf('month')
      .startOf('day')
      .toDate();
    const nextDay = dayjs(lastDateOfMonth).add(1, 'day').toDate();

    const snapshotStocks = await prisma.stockHistory.findMany({
      where: {
        store_id: req.query.storeId as string,
        status: 'SNAPSHOT',
        created_at: {
          gte: lastDateOfMonth,
          lte: nextDay,
        },
      },
      include: {
        products: true,
      },
    });

    const finalStockMap: Record<string, number> = {};
    snapshotStocks.forEach((snap) => {
      finalStockMap[snap.product_id] = snap.quantity;
    });

    const stockHistorySummaryArray = Object.entries(stockHistorySummary).map(
      ([product_id, quantity]) => ({
        product_id,
        store_id: req.query.storeId,
        name: productNameMap[product_id],
        quantity,
        final_stock: finalStockMap[product_id] ?? null,
      }),
    );

    snapshotStocks.forEach((snap) => {
      if (!stockHistorySummary[snap.product_id]) {
        stockHistorySummaryArray.push({
          product_id: snap.product_id,
          store_id: snap.store_id,
          name: snap.products?.name,
          quantity: 0,
          final_stock: snap.quantity,
        });
      }
    });

    const feedback: serviceFeedback = {
      code: 200,
      data: stockHistorySummaryArray,
      status: statusEnum.SUCCESS,
      message: `Successfully fetched stock summary with store_id ${req.query.storeId}.`,
    };
    return feedback;
  }

  async updateStock(req: Request) {
    if (!req.query.productId && !req.query.storeId) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `Product ID and Store ID is required to update stock.`,
      };
      return feedback;
    }

    const stock = await prisma.stocks.findFirst({
      where: {
        product_id: req.query.productId as string,
        store_id: req.query.storeId as string,
      },
    });

    if (!stock || stock.deleted_at) {
      const feedback: serviceFeedback = {
        code: 404,
        data: null,
        status: statusEnum.FAILED,
        message: `Stock with product_id ${req.query.productId} and store_id ${req.query.storeId} does not exist.`,
      };
      return feedback;
    }

    let newQuantity;

    if (req.body.status === 'ADD')
      newQuantity = stock.quantity + req.body.quantity;
    if (req.body.status === 'SUBTRACT')
      newQuantity = stock.quantity - req.body.quantity;

    if (newQuantity < 0) {
      const feedback: serviceFeedback = {
        code: 403,
        data: null,
        status: statusEnum.FAILED,
        message: `Updating stock quantity below 0 is not allowed.`,
      };
      return feedback;
    }

    await prisma.stockHistory.create({
      data: {
        product_id: req.query.productId as string,
        store_id: req.query.storeId as string,
        quantity: req.body.quantity,
        status: req.body.status,
      },
    });

    const updatedStock = await prisma.stocks.updateMany({
      data: { quantity: newQuantity },
      where: {
        product_id: req.query.productId as string,
        store_id: req.query.storeId as string,
      },
    });
    const feedback: serviceFeedback = {
      code: 200,
      data: updatedStock,
      status: statusEnum.SUCCESS,
      message: `Stock with product_id ${req.query.productId} and store_id ${req.query.storeId} successfully updated.`,
    };
    return feedback;
  }
}

export default new StockService();
