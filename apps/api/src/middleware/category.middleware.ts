import { statusEnum } from '@/enums/statusEnum.enums';
import { responseHandler } from '@/helper/responseHandler.helper';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const categoryCreateAndUpdateSchema = z.object({
  name: z.string(),
});

export const validateCategoryCreateAndUpdateBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    categoryCreateAndUpdateSchema.parse(req.body);
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
