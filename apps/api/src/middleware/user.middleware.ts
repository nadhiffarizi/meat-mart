import { statusEnum } from '@/enums/statusEnum.enums';
import { responseHandler } from '@/helper/responseHandler.helper';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const adminCreateSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  first_name: z.string(),
  last_name: z.string().optional(),
  image_url: z.string().optional(),
  phone_number: z.string().optional(),
});

const adminRestoreSchema = z.object({
  email: z.string().email(),
});

const adminUpdateSchema = z.object({
  password: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  image_url: z.string().optional(),
  role: z.literal('ADMIN').optional(),
  phone_number: z.string().optional(),
  is_verified: z.literal(true).optional(),
  verification_link: z.string().optional(),
});

export const validateAdminCreateBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('restore query:', req.query.restore); // should be 'true'
  console.log('raw body:', req.body);
  try {
    if (req.query.restore === 'true') {
      adminRestoreSchema.parse(req.body);
      console.log('req.body in restore:', req.body);
    } else {
      adminCreateSchema.parse(req.body);
      console.log('req.body not in restore:', req.body);
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

export const validateAdminUpdateBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    adminUpdateSchema.parse(req.body);
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
