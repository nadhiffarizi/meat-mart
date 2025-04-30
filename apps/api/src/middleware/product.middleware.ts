import { statusEnum } from '@/enums/statusEnum.enums';
import { responseHandler } from '@/helper/responseHandler.helper';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const productCreateSchema = z.object({
  name: z.string(),
  price: z.number(),
  weight: z.number(),
});

export const validateProductCreateBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    productCreateSchema.parse(req.body);
    next();
  } catch (error) {
    return responseHandler(
      res,
      'Invalid request body',
      statusEnum.FAILED,
      null,
      400,
    );
  }
};
