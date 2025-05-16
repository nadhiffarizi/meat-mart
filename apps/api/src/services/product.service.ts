import { statusEnum } from '@/enums/statusEnum.enums';
import { xDistancePrisma } from '@/helper/location/distance.helper';
import ILocation from '@/interface/location.interface';
import { Request } from 'express';
import { findStocksByProduct } from '@/helper/stock/stock.helper';
import { returnServiceFeedback } from '@/helper/responseHandler.helper';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import prisma from '@/prisma';
import { findThumbnailByProductId } from '@/helper/product/product.helper';

class ProductService {
  async create(req: Request) {
    const { name, weight, price } = req.body;
    const productAdded = await prisma.products.create({
      data: { name, weight, price, slug: name },
    });

    return {
      code: 200,
      data: productAdded,
      status: statusEnum.SUCCESS,
      message: `added a product`,
    };
  }
  async getProducts(req: Request) {
    try {
      const loc1: ILocation = {
        lat: '-6.2263977',
        lon: '106.8584389',
      };
      const { categoryId } = req.query;
      const { productId } = req.query;
      const rawLimit = Number(req.query.limit);
      const rawPage = Number(req.query.page);
      const limit = !Number.isNaN(rawLimit) && rawLimit > 0 ? rawLimit : 10;
      const page = !Number.isNaN(rawPage) && rawPage > 0 ? rawPage : 1;
      const query = typeof req.query.q === 'string' ? req.query.q : undefined;
      const products = await xDistancePrisma(loc1).products.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          weight: true,
          created_at: true,
          updated_at: true,
          deleted_at: true,
        },
        where: {
          ...(categoryId ? { categoryId: categoryId as string } : {}),
          ...(productId ? { id: productId as string } : {}),
          ...(query ? { name: { contains: query, mode: 'insensitive' } } : {}),
          deleted_at: null,
        },
        take: limit,
        skip: (page - 1) * limit,
      });
      const data: any[] = [];

      for (let product of products) {
        const availableStocks = await findStocksByProduct(product.id, loc1);
        const image = await findThumbnailByProductId(product.id);
        const temp = {
          ...product,
          ...{ image: image?.link },
          ...{ availableStocks: availableStocks },
        };
        data.push({ ...temp });
      }

      return returnServiceFeedback(
        200,
        data,
        statusEnum.SUCCESS,
        'get product success',
      );
    } catch (error) {
      return returnServiceFeedback(
        400,
        (error as Error).message,
        statusEnum.FAILED,
        'get product failed',
      );
    }
  }

  async getAllProducts(req: Request) {
    const includeDeleted = req.query.includeDeleted === 'true';
    const rawLimit = Number(req.query.limit);
    const limit = Number.isNaN(rawLimit) ? undefined : rawLimit;
    const query = typeof req.query.q === 'string' ? req.query.q : undefined;

    const allProducts = await prisma.products.findMany({
      where: includeDeleted
        ? undefined
        : {
            deleted_at: null,
          },
      ...(limit !== undefined ? { take: limit } : {}),
      ...(query
        ? {
            where: {
              ...(includeDeleted ? {} : { deleted_at: null }),
              name: { contains: query, mode: 'insensitive' },
            },
          }
        : {}),
    });

    const feedback: serviceFeedback = {
      code: 200,
      data: allProducts,
      status: statusEnum.SUCCESS,
      message: `Successfully fetched all products.`,
    };
    return feedback;
  }

  async getAllProductsByCategoryId(req: Request) {
    const categoryId = req.params.categoryId;

    const allProducts = await prisma.products.findMany({
      where: {
        ProductCategories: {
          some: {
            category_id: categoryId,
          },
        },
        deleted_at: null,
      },
    });

    const feedback: serviceFeedback = {
      code: 200,
      data: allProducts,
      status: statusEnum.SUCCESS,
      message: `Successfully fetched all products with category_ID ${categoryId}.`,
    };
    return feedback;
  }

  async getProductById(req: Request) {
    const product = await prisma.products.findUnique({
      where: {
        id: req.params.id,
        deleted_at: null,
      },
    });
    const feedback: serviceFeedback = {
      code: 200,
      data: product,
      status: statusEnum.SUCCESS,
      message: `Successfully fetched product with id ${req.params.id}.`,
    };
    return feedback;
  }

  async getPicturesByProductId(req: Request) {
    const productPictures = await prisma.productPictures.findMany({
      where: { product_id: req.params.productId, deleted_at: null },
    });
    const feedback: serviceFeedback = {
      code: 200,
      data: productPictures,
      status: statusEnum.SUCCESS,
      message: `Successfully fetched all pictures with product_ID ${req.params.productId}.`,
    };
    return feedback;
  }
}
export default new ProductService();
