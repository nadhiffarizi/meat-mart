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
          ...(productId ? { id: productId as string } : {}),
          ...(query ? { name: { contains: query, mode: 'insensitive' } } : {}),
          deleted_at: null,
          ...(categoryId
            ? {
                ProductCategories: {
                  some: {
                    category_id: categoryId as string,
                  },
                },
              }
            : {}),
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

  async getProductsCount(req: Request) {
    try {
      const { categoryId } = req.query;
      const loc1: ILocation = {
        lat: '-6.2263977',
        lon: '106.8584389',
      };
      const query = req.query.q as string;
      const data = await xDistancePrisma(loc1).products.count({
        where: {
          ...(query ? { name: { contains: query, mode: 'insensitive' } } : {}),
          deleted_at: null,
          ...(categoryId
            ? {
                ProductCategories: {
                  some: {
                    category_id: categoryId as string,
                  },
                },
              }
            : {}),
        },
      });

      return returnServiceFeedback(
        200,
        data,
        statusEnum.SUCCESS,
        'Product count fetched successfully.',
      );
    } catch (error) {
      return returnServiceFeedback(
        400,
        (error as Error).message,
        statusEnum.FAILED,
        'Product count fetched unsuccessfully.',
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

  async getProductsFromNearestStore(req: Request) {
    try {
      const { lat, lng } = req.query;
      if (!lat || !lng) {
        throw new Error('Latitude and longitude are required');
      }

      const userLoc: ILocation = {
        lat: String(lat),
        lon: String(lng),
      };

      const { categoryId, productId } = req.query;
      const rawLimit = Number(req.query.limit);
      const rawPage = Number(req.query.page);
      const limit = !Number.isNaN(rawLimit) && rawLimit > 0 ? rawLimit : 10;
      const page = !Number.isNaN(rawPage) && rawPage > 0 ? rawPage : 1;
      const query = typeof req.query.q === 'string' ? req.query.q : undefined;

      const prismaWithDistance = xDistancePrisma(userLoc);
      const allStores = await prismaWithDistance.stores.findMany({
        where: { deleted_at: null },
      });

      const sortedStores = [...allStores].sort((a, b) => {
        const aDist = (a as any).distance;
        const bDist = (b as any).distance;
        return aDist - bDist;
      });

      if (sortedStores.length === 0) {
        return returnServiceFeedback(
          200,
          [],
          statusEnum.SUCCESS,
          'No stores found nearby',
        );
      }

      const nearestStore = sortedStores[0];
      //console.log('========TOKOTERPILIH', nearestStore);
      const nearestStoreId = nearestStore.id;

      const products = await prisma.products.findMany({
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
          ...(productId ? { id: productId as string } : {}),
          ...(query ? { name: { contains: query, mode: 'insensitive' } } : {}),
          deleted_at: null,
          Stocks: {
            some: {
              store_id: nearestStoreId,
              deleted_at: null,
            },
          },
          ...(categoryId
            ? {
                ProductCategories: {
                  some: {
                    category_id: categoryId as string,
                  },
                },
              }
            : {}),
        },
        take: limit,
        skip: (page - 1) * limit,
      });

      const data: any[] = [];
      const loc1: ILocation = {
        lat: nearestStore.latitude,
        lon: nearestStore.longitude,
      };

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

      // pagination
      const total = await prisma.products.count({
        where: {
          ...(productId ? { id: productId as string } : {}),
          ...(query ? { name: { contains: query, mode: 'insensitive' } } : {}),
          deleted_at: null,
          Stocks: {
            some: {
              store_id: nearestStoreId,
              deleted_at: null,
            },
          },
          ...(categoryId
            ? {
                ProductCategories: {
                  some: {
                    category_id: categoryId as string,
                  },
                },
              }
            : {}),
        },
      });

      return returnServiceFeedback(
        200,
        {
          data,
          total,
          page,
          limit,
          nearestStore: {
            id: nearestStore.id,
            name: nearestStore.name,
            distance: (nearestStore as any).distance,
          },
        },
        statusEnum.SUCCESS,
        'Products from nearest store fetched successfully',
      );
    } catch (error) {
      console.error('Error in getProductsFromNearestStore:', error);
      return returnServiceFeedback(
        400,
        (error as Error).message,
        statusEnum.FAILED,
        'Failed to fetch products from nearest store',
      );
    }
  }
}
export default new ProductService();
