import { statusEnum } from '@/enums/statusEnum.enums';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import prisma from '@/prisma';
import { Request } from 'express';

class ProductService {
  async getAllProducts(req: Request) {
    const getProductList = await prisma.products.findMany({});
    let feedback: serviceFeedback;
    feedback = {
      code: 200,
      data: getProductList,
      status: statusEnum.SUCCESS,
      message: `Fetching all products`,
    };
    return feedback;
  }

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
}
export default new ProductService();
