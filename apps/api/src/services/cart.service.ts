import { statusEnum } from '@/enums/statusEnum.enums';
import {
  addToCart,
  subtractCart,
  updateCartQuantity,
} from '@/helper/cart/cart.helper';
import { xDistancePrisma } from '@/helper/location/distance.helper';
import ILocation from '@/interface/location.interface';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import prisma from '@/prisma';
import { Request } from 'express';
import { findStocksByProduct } from '@/helper/stock/stock.helper';
import { returnServiceFeedback } from '@/helper/responseHandler.helper';
import {
  findThumbnailByProductId,
  findThumbnailByStockId,
} from '@/helper/product/product.helper';
import { convertRoleToEnum } from '@/helper/role.helper';
import { E_Role } from '.prisma/client';

class CartService {
  async add(req: Request) {
    // placeholder for location
    const loc1: ILocation = {
      lat: '-6.2263977',
      lon: '106.8584389',
    };

    // need info: user, address(location), productId
    const { quantity, productId } = req.body;

    try {
      const user = req.user;
      const role = convertRoleToEnum(user?.role!);
      if (role !== E_Role.CUSTOMER)
        throw new Error('Unauthorized role. Needs to be customer');
      // check if existed in the carts table
      const findItem = await prisma.carts.findFirst({
        where: {
          user_id: user?.id!,
          AND: {
            stocks: {
              product_id: productId,
            },
          },
        },
      });

      const availableStocks = await findStocksByProduct(productId, loc1);

      const insertedData = await addToCart(
        availableStocks,
        Number(quantity),
        user?.id!,
        findItem!,
      );

      // feedback from service
      return returnServiceFeedback(
        200,
        insertedData,
        statusEnum.SUCCESS,
        'add cart success',
      );
    } catch (error) {
      // feedback from service
      return returnServiceFeedback(
        400,
        (error as Error).message,
        statusEnum.FAILED,
        'add cart failed',
      );
    }
  }

  async getCart(req: Request) {
    try {
      const user = req.user;
      const { page } = req.params;
      const role = convertRoleToEnum(user?.role!);
      if (role !== E_Role.CUSTOMER)
        throw new Error('Unauthorized role. Needs to be customer');

      const loc1: ILocation = {
        lat: '-6.2263977',
        lon: '106.8584389',
      };

      const countCart = await prisma.carts.count({
        where: {
          user_id: user?.id!,
        },
      });

      const cartData = await xDistancePrisma(loc1).carts.findMany({
        select: {
          id: true,
          user_id: true,
          quantity: true,
          stocks: {
            select: {
              id: true,
              quantity: true,

              stores: {
                select: {
                  id: true,
                  status: true,
                  distance: true,
                },
              },
              products: true,
            },
          },
        },
        where: {
          user_id: user?.id!,
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: Number(page) === 0 ? 0 : (Number(page) - 1) * 3,
        take: Number(page) === 0 ? countCart : 3,
      });

      for (let cartItem of cartData) {
        const availableStocks = await findStocksByProduct(
          cartItem.stocks.products.id,
          loc1,
        );
        const productThumbnail = await findThumbnailByStockId(
          cartItem.stocks.id,
        );
        cartItem.stocks.products = {
          ...cartItem.stocks.products,
          ...{ image: productThumbnail?.link },
          ...{ availableStocks: availableStocks },
        };
      }
      // feedback from service
      return returnServiceFeedback(
        200,
        cartData,
        statusEnum.SUCCESS,
        'get cart success',
      );
    } catch (error) {
      // feedback from service
      return returnServiceFeedback(
        400,
        (error as Error).message,
        statusEnum.FAILED,
        'get cart failed',
      );
    }
  }

  async subtract(req: Request) {
    try {
      // placeholder for location
      const loc1: ILocation = {
        lat: '-6.2263977',
        lon: '106.8584389',
      };

      // need info: user, address(location), productId
      const { quantity, productId } = req.body;
      const user = req.user;
      const role = convertRoleToEnum(user?.role!);
      if (role !== E_Role.CUSTOMER)
        throw new Error('Unauthorized role. Needs to be customer');

      // check where is the cart data
      const findItem = await prisma.carts.findFirst({
        where: {
          user_id: user?.id!,
          AND: {
            stocks: {
              product_id: productId,
            },
          },
        },
      });

      const availableStocks = await findStocksByProduct(productId, loc1);
      const data = await subtractCart(
        availableStocks,
        quantity,
        user?.id!,
        findItem!,
      );

      // feedback from service
      return returnServiceFeedback(
        200,
        data,
        statusEnum.SUCCESS,
        'subtract cart success',
      );
    } catch (error) {
      // feedback from service
      return returnServiceFeedback(
        400,
        (error as Error).message,
        statusEnum.FAILED,
        'subtract cart failed',
      );
    }
  }

  async updateQuantity(req: Request) {
    // location placeholder
    const loc1: ILocation = {
      lat: '-6.2263977',
      lon: '106.8584389',
    };

    // need info: user, address(location), productId
    const { quantity, productId } = req.body;
    const user = req.user;

    try {
      const role = convertRoleToEnum(user?.role!);
      if (role !== E_Role.CUSTOMER)
        throw new Error('Unauthorized role. Needs to be customer');
      // check if existed in the carts table
      const findItem = await prisma.carts.findFirst({
        where: {
          user_id: user?.id!,
          AND: {
            stocks: {
              product_id: productId,
            },
          },
        },
      });

      const availableStocks = await findStocksByProduct(productId, loc1);

      const insertedData = await updateCartQuantity(
        availableStocks,
        Number(quantity),
        user?.id!,
        findItem!,
      );

      // feedback from service
      return returnServiceFeedback(
        200,
        insertedData,
        statusEnum.SUCCESS,
        'add cart success',
      );
    } catch (error) {
      // feedback from service
      return returnServiceFeedback(
        400,
        (error as Error).message,
        statusEnum.FAILED,
        'add cart failed',
      );
    }
  }

  async getTotalPage(req: Request) {
    try {
      const user = req.user;
      const role = convertRoleToEnum(user?.role!);
      if (role !== E_Role.CUSTOMER)
        throw new Error('Unauthorized role. Needs to be customer');

      const countCartTotal = await prisma.carts.count({
        where: {
          user_id: user?.id!,
        },
      });

      // take only 3
      let countPage = 0;
      if (countCartTotal % 3 === 0) {
        countPage = countCartTotal / 3;
      } else {
        countPage = Math.ceil(countCartTotal / 3);
      }

      return returnServiceFeedback(
        200,
        { totalPage: countPage },
        statusEnum.SUCCESS,
        'Count total page success',
      );
    } catch (error) {
      return returnServiceFeedback(
        400,
        (error as Error).message,
        statusEnum.FAILED,
        'Count total page failed',
      );
    }
  }
}

export default new CartService();
