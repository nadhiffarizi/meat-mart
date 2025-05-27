import { statusEnum } from '@/enums/statusEnum.enums';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { Request } from 'express';
import prisma from '@/prisma';
import {
  findProductById,
  findProductByName,
} from '@/helper/product/product.helper';
import { cloudinaryRemove, cloudinaryUpload } from '@/helper/cloudinary.helper';
import { createSlug } from '@/helper/slug.helper';
import { Prisma } from '@prisma/client';

class ProductService {
  async getAllProducts(req: Request) {
    const rawLimit = Number(req.query.limit);
    const rawPage = Number(req.query.page);
    const limit = !Number.isNaN(rawLimit) && rawLimit > 0 ? rawLimit : 10;
    const page = !Number.isNaN(rawPage) && rawPage > 0 ? rawPage : 1;
    const query = typeof req.query.q === 'string' ? req.query.q : undefined;

    const where: Prisma.ProductsWhereInput = {
      ...(req.query.includeDeleted === 'true' ? {} : { deleted_at: null }),
      ...(query ? { name: { contains: query, mode: 'insensitive' } } : {}),
    };

    const [allProducts, count] = await Promise.all([
      prisma.products.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.products.count({ where }),
    ]);

    const feedback: serviceFeedback = {
      code: 200,
      data: { products: allProducts, count: count },
      status: statusEnum.SUCCESS,
      message: `Successfully fetched all products.`,
    };
    return feedback;
  }

  async getProduct(req: Request) {
    if (!req.query.name && !req.query.id) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `Name or ID is required to fetch product.`,
      };
      return feedback;
    }

    let product;

    if (req.query.name) {
      product = await findProductByName(req.query.name as string);
    }

    if (req.query.id) {
      product = await findProductById(req.query.id as string);
    }

    if (
      (product && product.deleted_at && req.query.includeDeleted !== 'true') ||
      !product
    ) {
      const feedback: serviceFeedback = {
        code: 404,
        data: null,
        status: statusEnum.FAILED,
        message: req.query.name
          ? `Product with name ${req.query.name} does not exist.`
          : `Product with ID ${req.query.id} does not exist.`,
      };
      return feedback;
    }

    const feedback: serviceFeedback = {
      code: 200,
      data: product,
      status: statusEnum.SUCCESS,
      message: req.query.name
        ? `Successfully fetched product with name ${req.query.name}.`
        : `Successfully fetched product with ID ${req.query.id}.`,
    };
    return feedback;
  }

  async uploadProductPicture(req: Request) {
    const { file } = req;
    console.log('REQ.FILE =>', req.file);

    if (!req.params.productId) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `ID is required to upload an image to a product.`,
      };
      return feedback;
    }

    if (!file) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `There's no image to upload.`,
      };
      return feedback;
    }

    const product = await findProductById(req.params.productId);

    if (!product || product.deleted_at) {
      const feedback: serviceFeedback = {
        code: 404,
        data: null,
        status: statusEnum.FAILED,
        message: `Product with ID ${req.params.productId} does not exist.`,
      };
      return feedback;
    }

    const { secure_url } = await cloudinaryUpload(file);

    const productPicture = await prisma.productPictures.create({
      data: {
        product_id: req.params.productId,
        link: secure_url,
        thumbnail_status: true,
      },
    });

    const feedback: serviceFeedback = {
      code: 201,
      data: productPicture,
      status: statusEnum.SUCCESS,
      message: `Successfully uploaded picture to product with ID ${req.params.id}.`,
    };
    return feedback;
  }

  async createProduct(req: Request) {
    const existingProduct = await findProductByName(req.body.name);

    if (
      req.query.restore === 'true' &&
      existingProduct &&
      existingProduct.deleted_at
    ) {
      const restoredProduct = await prisma.products.update({
        where: { name: req.body.name },
        data: { deleted_at: null },
      });

      const activeCategories = await prisma.categories.findMany({
        where: { deleted_at: null },
      });

      await prisma.productCategories.updateMany({
        where: {
          product_id: existingProduct.id,
          category_id: {
            in: activeCategories.map((category) => category.id),
          },
        },
        data: { deleted_at: null },
      });

      await prisma.productPictures.updateMany({
        where: { product_id: existingProduct.id },
        data: { deleted_at: null },
      });

      const activeStores = await prisma.stores.findMany({
        where: { deleted_at: null },
      });

      await prisma.stocks.updateMany({
        where: {
          product_id: existingProduct.id,
          store_id: { in: activeStores.map((store) => store.id) },
        },
        data: { deleted_at: null },
      });

      await prisma.discounts.updateMany({
        where: {
          product_id: existingProduct.id,
          store_id: { in: activeStores.map((store) => store.id) },
        },
        data: {
          deleted_at: null,
        },
      });

      const feedback: serviceFeedback = {
        code: 200,
        data: restoredProduct,
        status: statusEnum.SUCCESS,
        message: `Product with name ${req.body.name} has been restored.`,
      };
      return feedback;
    }

    if (existingProduct) {
      const feedback: serviceFeedback = {
        code: 409,
        data: null,
        status: statusEnum.FAILED,
        message: `Product with name ${req.body.name} already exists.`,
      };
      return feedback;
    }

    const { categories, ...newBody } = req.body;

    const newProduct = await prisma.products.create({
      data: {
        ...newBody,
        slug: createSlug(req.body.name),
      },
    });

    await Promise.all(
      req.body.categories.map((category_id: string) => {
        return prisma.productCategories.create({
          data: { product_id: newProduct.id, category_id: category_id },
        });
      }),
    );

    const allStores = await prisma.stores.findMany();

    const stockData = allStores.map((store) => {
      return {
        product_id: newProduct.id,
        store_id: store.id,
        quantity: 0,
        deleted_at: store.deleted_at ? store.deleted_at : null,
      };
    });

    await prisma.stocks.createMany({
      data: stockData,
    });

    const feedback: serviceFeedback = {
      code: 201,
      data: newProduct,
      status: statusEnum.SUCCESS,
      message: `Product with name ${req.body.name} successfully created.`,
    };
    return feedback;
  }

  async updateProduct(req: Request) {
    if (!req.params.id) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `ID is required to update product.`,
      };
      return feedback;
    }

    const existingProduct = await findProductById(req.params.id);

    if (!existingProduct || existingProduct.deleted_at) {
      const feedback: serviceFeedback = {
        code: 404,
        data: null,
        status: statusEnum.FAILED,
        message: `Product with ID ${req.params.id} does not exist.`,
      };
      return feedback;
    }

    const existingProductName = await findProductByName(req.body.name);
    if (existingProductName && existingProductName.id !== req.params.id) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `${req.body.name} is identical to another product name. Product names must be unique.`,
      };
      return feedback;
    }

    const { existingPictures, picture, categories, ...updatedBody } = req.body;

    const updatedProduct = await prisma.products.update({
      data: updatedBody,
      where: {
        id: req.params.id,
      },
    });

    const picturesToDelete = existingProduct.ProductPictures.filter(
      (pp) => !existingPictures.includes(pp.link),
    );

    if (picturesToDelete.length) {
      await Promise.all(
        picturesToDelete.map(async (pp) => {
          await cloudinaryRemove(pp.link);
        }),
      );
      await prisma.productPictures.deleteMany({
        where: {
          link: {
            in: picturesToDelete.map((pp) => pp.link),
          },
        },
      });
    }

    const categoriesToDelete = existingProduct.ProductCategories.filter(
      (pc) => !categories.includes(pc.category_id),
    );

    if (categoriesToDelete.length) {
      await prisma.productCategories.deleteMany({
        where: {
          category_id: {
            in: categoriesToDelete.map((pc) => pc.category_id),
          },
        },
      });
    }

    const existingCategoryIds = existingProduct.ProductCategories.map(
      (pc) => pc.category_id,
    );

    const categoriesToAdd = req.body.categories.filter(
      (catId: string) => !existingCategoryIds.includes(catId),
    );

    if (categoriesToAdd.length) {
      await prisma.productCategories.createMany({
        data: categoriesToAdd.map((catId: string) => ({
          product_id: req.params.id,
          category_id: catId,
        })),
        skipDuplicates: true,
      });
    }

    const feedback: serviceFeedback = {
      code: 200,
      data: updatedProduct,
      status: statusEnum.SUCCESS,
      message: `Product with ID ${req.params.id} successfully updated.`,
    };
    return feedback;
  }

  async deleteProduct(req: Request) {
    if (!req.params.id) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `ID is required to delete product.`,
      };
      return feedback;
    }

    const existingProduct = await findProductById(req.params.id);

    if (!existingProduct || existingProduct.deleted_at) {
      const feedback: serviceFeedback = {
        code: 404,
        data: null,
        status: statusEnum.FAILED,
        message: `Product with ID ${req.params.id} does not exist.`,
      };
      return feedback;
    }

    await prisma.productCategories.updateMany({
      where: { product_id: req.params.id },
      data: { deleted_at: new Date() },
    });

    await prisma.productPictures.updateMany({
      where: { product_id: req.params.id },
      data: { deleted_at: new Date() },
    });

    await prisma.stocks.updateMany({
      where: { product_id: req.params.id },
      data: { deleted_at: new Date() },
    });

    const deletedProduct = await prisma.products.update({
      where: {
        id: req.params.id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
    const feedback: serviceFeedback = {
      code: 200,
      data: deletedProduct,
      status: statusEnum.SUCCESS,
      message: `Product with ID ${req.params.id} successfully deleted.`,
    };
    return feedback;
  }
}

export default new ProductService();
