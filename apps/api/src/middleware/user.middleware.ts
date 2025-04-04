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

const adminUpdateSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  image_url: z.string().optional(),
  role: z.literal('ADMIN').optional(),
  phone_number: z.string().optional(),
  is_verified: z.literal(true).optional(),
  verification_link: z.string().optional(),
  created_at: z
    .string()
    .transform((val) => new Date(val).toISOString)
    .optional(),
  updated_at: z
    .string()
    .transform((val) => new Date(val).toISOString)
    .optional(),
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
