import { statusEnum } from '@/enums/statusEnum.enums';
import { responseHandler } from '@/helper/responseHandler.helper';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const productCreateSchema = z.object({
  name: z.string(),
  price: z.number(),
  weight: z.number(),
  categories: z.array(z.string()),
});

const productRestoreSchema = z.object({
  name: z.string(),
});

const productUpdateSchema = z.object({
  name: z.string(),
  price: z.number(),
  weight: z.number(),
  categories: z.array(z.string()),
  existingPictures: z.array(z.string()).optional(),
});

export const validateProductCreateBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.query.restore === 'true') {
      productRestoreSchema.parse(req.body);
      console.log('req.body in restore:', req.body);
    } else {
      productCreateSchema.parse(req.body);
    }
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

export const validateProductUpdateBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    productUpdateSchema.parse(req.body);
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
