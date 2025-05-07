import { statusEnum } from '@/enums/statusEnum.enums';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { Request } from 'express';
import prisma from '@/prisma';
import { getCategoryById, getCategoryByName } from '@/helper/category.prisma';
import {
  getDiscountByDiscountCode,
  getDiscountById,
} from '@/helper/discount.prisma';
import { getStoreById } from '@/helper/store.prisma';
import { findProductById } from '@/helper/product/product.helper';

class DiscountService {
  async getAllDiscounts(req: Request) {
    let allDiscounts;
    if (req.query.includeDeleted === 'true') {
      if (req.query.storeId) {
        allDiscounts = await prisma.discounts.findMany({
          where: { store_id: req.query.storeId as string },
          include: { products: true },
        });
      } else {
        allDiscounts = await prisma.discounts.findMany({
          include: { products: true },
        });
      }
    } else {
      if (req.query.storeId) {
        allDiscounts = await prisma.discounts.findMany({
          where: { store_id: req.query.storeId as string, deleted_at: null },
          include: { products: true },
        });
      } else {
        allDiscounts = await prisma.discounts.findMany({
          where: {
            deleted_at: null,
          },
          include: { products: true },
        });
      }
    }

    const feedback: serviceFeedback = {
      code: 200,
      data: allDiscounts,
      status: statusEnum.SUCCESS,
      message: `Successfully fetched all discounts.`,
    };
    return feedback;
  }

  async getDiscount(req: Request) {
    if (!req.query.discountCode && !req.query.id) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `Discount Code or ID is required to fetch discount.`,
      };
      return feedback;
    }

    let discount;

    if (req.query.discountCode) {
      discount = await getDiscountByDiscountCode(
        req.query.discountCode as string,
      );
    }

    if (req.query.id) {
      discount = await getDiscountById(req.query.id as string);
    }

    if (
      (discount &&
        discount.deleted_at &&
        req.query.includeDeleted !== 'true') ||
      !discount
    ) {
      const feedback: serviceFeedback = {
        code: 404,
        data: null,
        status: statusEnum.FAILED,
        message: req.query.name
          ? `Discount with discountCode ${req.query.discountCode} does not exist.`
          : `Discount with ID ${req.query.id} does not exist.`,
      };
      return feedback;
    }

    const feedback: serviceFeedback = {
      code: 200,
      data: discount,
      status: statusEnum.SUCCESS,
      message: req.query.name
        ? `Successfully fetched discount with discountCode ${req.query.discountCode}.`
        : `Successfully fetched discount with ID ${req.query.id}.`,
    };
    return feedback;
  }

  async createDiscount(req: Request) {
    const existingDiscount = await getDiscountByDiscountCode(
      req.body.discountCode,
    );

    if (
      req.query.restore === 'true' &&
      existingDiscount &&
      existingDiscount.deleted_at
    ) {
      const existingProduct = await findProductById(
        existingDiscount.product_id,
      );
      const existingStore = await getStoreById(existingDiscount.store_id);

      if (existingProduct?.deleted_at || existingStore?.deleted_at) {
        const feedback: serviceFeedback = {
          code: 403,
          data: null,
          status: statusEnum.FAILED,
          message: `Discount with discountCode ${req.body.discountCode} cannot been restored because the product or store associated with it has been deleted.`,
        };
        return feedback;
      }

      const existingDiscountOnProductId = await prisma.discounts.findFirst({
        where: { product_id: existingDiscount.product_id, deleted_at: null },
      });
      if (existingDiscountOnProductId) {
        const feedback: serviceFeedback = {
          code: 409,
          data: null,
          status: statusEnum.FAILED,
          message: `Another discount associated with product with productId ${req.body.productId} already exists.`,
        };
        return feedback;
      }

      const restoredDiscount = await prisma.discounts.update({
        where: { discount_code: req.body.discountCode },
        data: { deleted_at: null },
      });

      const feedback: serviceFeedback = {
        code: 200,
        data: restoredDiscount,
        status: statusEnum.SUCCESS,
        message: `Discount with discountCode ${req.body.discountCode} has been restored.`,
      };
      return feedback;
    }

    if (existingDiscount) {
      const feedback: serviceFeedback = {
        code: 409,
        data: null,
        status: statusEnum.FAILED,
        message: `Discount with discount code ${req.body.discountCode} already exists.`,
      };
      return feedback;
    }

    let newDiscount;

    if (
      req.body.promotionType !== 'BOGO' &&
      req.body.discountPercentage &&
      req.body.discountAmount
    ) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `Cannot create amount-based discounts with both discountPercentage and discountAmount applied. Please opt for one.`,
      };
      return feedback;
    }

    if (req.body.productId) {
      const existingDiscountOnProductId = await prisma.discounts.findFirst({
        where: { product_id: req.body.productId, deleted_at: null },
      });
      if (existingDiscountOnProductId) {
        const feedback: serviceFeedback = {
          code: 409,
          data: null,
          status: statusEnum.FAILED,
          message: `Another discount associated with product with productId ${req.body.productId} already exists.`,
        };
        return feedback;
      }
    }

    let newDiscountBody = {
      product_id: req.body.productId,
      store_id: req.body.storeId,
      start_date: new Date(req.body.startDate),
      end_date: new Date(req.body.endDate),
      discount_code: req.body.discountCode,
      is_valid: true,
      promotion_type: req.body.promotionType,
    };

    if (req.body.promotionType === 'custom') {
      newDiscount = await prisma.discounts.create({
        data: {
          ...newDiscountBody,
          discount_amount: req.body.discountAmount ?? null,
          discount_percentage: req.body.discountPercentage ?? null,
        },
      });
    }

    if (req.body.promotionType === 'MINIMUM_BUY') {
      newDiscount = await prisma.discounts.create({
        data: {
          ...newDiscountBody,
          discount_amount: req.body.discountAmount ?? null,
          discount_percentage: req.body.discountPercentage ?? null,
          minimum_purchase: req.body.minimumPurchase,
          maximum_discount_amount: req.body.maximumDiscountAmount,
        },
      });
    }

    if (req.body.promotionType === 'BOGO') {
      newDiscount = await prisma.discounts.create({
        data: {
          ...newDiscountBody,
        },
      });
    }

    const feedback: serviceFeedback = {
      code: 201,
      data: newDiscount,
      status: statusEnum.SUCCESS,
      message: `Discount with discount code ${req.body.discountCode} successfully created.`,
    };
    return feedback;
  }

  async updateDiscount(req: Request) {
    if (!req.params.id) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `ID is required to update discount.`,
      };
      return feedback;
    }

    const existingDiscount = await getDiscountById(req.params.id);

    if (!existingDiscount || existingDiscount.deleted_at) {
      const feedback: serviceFeedback = {
        code: 404,
        data: null,
        status: statusEnum.FAILED,
        message: `Discount with ID ${req.params.id} does not exist.`,
      };
      return feedback;
    }

    const existingDiscountCodeName = await getDiscountByDiscountCode(
      req.body.discountCode,
    );
    if (
      existingDiscountCodeName &&
      existingDiscountCodeName.id !== req.params.id
    ) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `${req.body.discountName} is identical to another discountCode. Discount codes must be unique.`,
      };
      return feedback;
    }

    const updatedDiscount = await prisma.discounts.update({
      data: req.body,
      where: {
        id: req.params.id,
      },
    });
    const feedback: serviceFeedback = {
      code: 200,
      data: updatedDiscount,
      status: statusEnum.SUCCESS,
      message: `Category with ID ${req.params.id} successfully updated.`,
    };
    return feedback;
  }

  async deleteDiscount(req: Request) {
    if (!req.params.id) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `ID is required to delete discount.`,
      };
      return feedback;
    }

    const existingDiscount = await getDiscountById(req.params.id);

    if (!existingDiscount || existingDiscount.deleted_at) {
      const feedback: serviceFeedback = {
        code: 404,
        data: null,
        status: statusEnum.FAILED,
        message: `Discount with ID ${req.params.id} does not exist.`,
      };
      return feedback;
    }

    const deletedDiscount = await prisma.discounts.update({
      where: {
        id: req.params.id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
    const feedback: serviceFeedback = {
      code: 200,
      data: deletedDiscount,
      status: statusEnum.SUCCESS,
      message: `Discount with ID ${req.params.id} successfully deleted.`,
    };
    return feedback;
  }
}

export default new DiscountService();
