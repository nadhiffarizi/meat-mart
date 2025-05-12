import { statusEnum } from '@/enums/statusEnum.enums';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { Request } from 'express';
import prisma from '@/prisma';
import { getCategoryById, getCategoryByName } from '@/helper/category.prisma';
import dayjs from 'dayjs';

class TransactionDetailService {
  async getAllTransactionDetailSummary(req: Request) {
    if (!req.query.storeId || !req.query.month || !req.query.year) {
      const feedback: serviceFeedback = {
        code: 400,
        data: {},
        status: statusEnum.FAILED,
        message: `storeId, month, and year are required to fetch transaction detail summary.`,
      };
      return feedback;
    }

    const startDate = dayjs(`${req.query.year}-${req.query.month}-01`)
      .startOf('month')
      .toDate();
    const endDate = dayjs(startDate).add(1, 'month').toDate();

    if (req.query.groupBy !== 'category' && req.query.groupBy !== 'product') {
      const feedback: serviceFeedback = {
        code: 400,
        data: {},
        status: statusEnum.FAILED,
        message: `Either groupBy category or product is required to fetch transaction detail summary.`,
      };
      return feedback;
    }

    let transactionSummary;

    const allTransactions = await prisma.transactionDetails.findMany({
      where: {
        store_id: req.query.storeId as string,
        created_at: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: { products: true },
    });

    if (req.query.groupBy === 'product') {
      const transactionSummaryObject = allTransactions.reduce(
        (transactionDetailSummary, transactionDetail) => {
          if (!transactionDetailSummary[transactionDetail.product_id]) {
            transactionDetailSummary[transactionDetail.product_id] = {
              quantity: transactionDetail.quantity,
              product_name: transactionDetail.products.name,
              revenue:
                transactionDetail.price_per_product *
                transactionDetail.quantity,
            };
          } else {
            transactionDetailSummary[transactionDetail.product_id].quantity +=
              transactionDetail.quantity;
            transactionDetailSummary[transactionDetail.product_id].revenue +=
              transactionDetail.price_per_product * transactionDetail.quantity;
          }
          return transactionDetailSummary;
        },
        {} as Record<
          string,
          { quantity: number; product_name: string; revenue: number }
        >,
      );

      transactionSummary = Object.entries(transactionSummaryObject).map(
        ([product_id, { quantity, product_name, revenue }]) => ({
          product_id,
          quantity,
          product_name,
          revenue,
        }),
      );
    }

    if (req.query.groupBy === 'category') {
      const allProductCategories = await prisma.productCategories.findMany({
        where: {
          product_id: {
            in: allTransactions.map((transaction) => transaction.product_id),
          },
        },
        include: { category: true },
      });

      const productCategoryMap = allProductCategories.reduce(
        (map, item) => {
          map[item.product_id] = {
            category_id: item.category.id,
            category_name: item.category.name,
          };
          return map;
        },
        {} as Record<string, { category_id: string; category_name: string }>,
      );

      const summaryByCategory = allTransactions.reduce(
        (acc, tx) => {
          const categoryInfo = productCategoryMap[tx.product_id];
          if (!categoryInfo) return acc; // skip if no category

          const { category_id, category_name } = categoryInfo;

          if (!acc[category_id]) {
            acc[category_id] = {
              category_id,
              category_name,
              quantity: 0,
              revenue: 0,
            };
          }

          acc[category_id].quantity += tx.quantity;
          acc[category_id].revenue += tx.price_per_product * tx.quantity;
          return acc;
        },
        {} as Record<
          string,
          {
            category_id: string;
            category_name: string;
            quantity: number;
            revenue: number;
          }
        >,
      );

      transactionSummary = Object.values(summaryByCategory);
    }

    const feedback: serviceFeedback = {
      code: 200,
      data: transactionSummary,
      status: statusEnum.SUCCESS,
      message: `Successfully fetched transactionSummary.`,
    };
    return feedback;
  }
}

export default new TransactionDetailService();
