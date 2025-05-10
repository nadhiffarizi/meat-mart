import { statusEnum } from '@/enums/statusEnum.enums';
import { responseHandler } from '@/helper/responseHandler.helper';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const stockUpdateSchema = z.object({
  quantity: z.number(),
  status: z.enum(['ADD', 'SUBTRACT', 'SNAPSHOT']),
});

export const validateStockUpdateBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    stockUpdateSchema.parse(req.body);
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
