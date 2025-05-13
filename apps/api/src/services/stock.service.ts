import { statusEnum } from '@/enums/statusEnum.enums';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { Request } from 'express';
import prisma from '@/prisma';

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
