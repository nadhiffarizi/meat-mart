import { statusEnum } from '@/enums/statusEnum.enums';
import { responseHandler } from '@/helper/responseHandler.helper';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  first_name: z.string(),
  last_name: z.string().optional(),
  image_url: z.string().optional(),
  role: z.literal('ADMIN'),
  phone_number: z.string().optional(),
  is_verified: z.literal(true),
  verification_link: z.string(),
  created_at: z.string().transform((val) => new Date(val).toISOString),
  updated_at: z.string().transform((val) => new Date(val).toISOString),
});

export const validateAdminLoginBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    adminLoginSchema.parse(req.body);
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
