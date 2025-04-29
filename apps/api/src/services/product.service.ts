import { statusEnum } from "@/enums/statusEnum.enums";
import { xDistancePrisma } from "@/helper/location/distance.helper";
import ILocation from "@/interface/location.interface";
import { Request } from "express";
import { findStocksByProduct } from "@/helper/stock/stock.helper";
import { returnServiceFeedback } from "@/helper/responseHandler.helper";
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import prisma from '@/prisma';
import { findThumbnailByProductId } from "@/helper/product/product.helper";

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
        lat: "-6.2263977",
        lon: "106.8584389"
      }
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
        }
      })
      const data: any[] = []

      for (let product of products) {
        const availableStocks = await findStocksByProduct(product.id, loc1)
        const image = await findThumbnailByProductId(product.id)
        const temp = { ...product, ...{ "image": image?.link }, ...{ "availableStocks": availableStocks } }
        data.push({ ...temp })
      }

      return returnServiceFeedback(200, data, statusEnum.SUCCESS, "get product success")
    } catch (error) {
      return returnServiceFeedback(400, (error as Error).message, statusEnum.FAILED, "get product failed")
    }
  }


}
export default new ProductService()
