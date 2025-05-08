import { statusEnum } from '@/enums/statusEnum.enums';
import { responseHandler } from '@/helper/responseHandler.helper';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const discountCreateSchema = z
  .object({
    store_id: z.string(),
    discount_code: z
      .string()
      .min(1, 'Please enter a discount code for your discount.'),
    start_date: z
      .string()
      .min(1, 'Please enter the start date for your discount'),
    end_date: z.string().min(1, 'Please enter the end date for your discount'),
    promotion_type: z.enum(['CUSTOM', 'MINIMUM_BUY', 'BOGO'], {
      required_error: 'Please choose a valid promotion type',
    }),
    product_id: z.string().optional(),
    minimum_purchase: z.number().optional(),
    maximum_discount_amount: z.number().optional(),
    discount_percentage: z
      .number()
      .min(0, 'Discount percentage must be at least 0%')
      .max(100, 'Discount percentage cannot exceed 100%')
      .optional(),
    discount_amount: z
      .number()
      .min(0, 'Discount amount must be at least 0')
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      (data.promotion_type === 'CUSTOM' || data.promotion_type === 'BOGO') &&
      !data.product_id
    ) {
      ctx.addIssue({
        path: ['product_id'],
        code: z.ZodIssueCode.custom,
        message: 'Product is required for this promotion type',
      });
    }

    if (data.promotion_type === 'MINIMUM_BUY') {
      if (!data.minimum_purchase) {
        ctx.addIssue({
          path: ['minimum_purchase'],
          code: z.ZodIssueCode.custom,
          message: 'Minimum amount is required for this promotion type',
        });
      }
      if (!data.maximum_discount_amount) {
        ctx.addIssue({
          path: ['maximum_discount_amount'],
          code: z.ZodIssueCode.custom,
          message:
            'Maximum discount amount is required for this promotion type',
        });
      }
    }

    if (
      data.promotion_type === 'CUSTOM' ||
      data.promotion_type === 'MINIMUM_BUY'
    ) {
      const hasPercentage = data.discount_percentage != null;
      const hasAmount = data.discount_amount != null;

      if (!(hasPercentage || hasAmount)) {
        ctx.addIssue({
          path: ['discount_percentage'],
          code: z.ZodIssueCode.custom,
          message:
            'You must provide either a discount percentage or amount (not both)',
        });
        ctx.addIssue({
          path: ['discount_amount'],
          code: z.ZodIssueCode.custom,
          message:
            'You must provide either a discount percentage or amount (not both)',
        });
      }
    }
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);

    if (isNaN(start.getTime())) {
      ctx.addIssue({
        path: ['start_date'],
        code: z.ZodIssueCode.custom,
        message: 'Start date must be a valid date',
      });
    }

    if (isNaN(end.getTime())) {
      ctx.addIssue({
        path: ['end_date'],
        code: z.ZodIssueCode.custom,
        message: 'End date must be a valid date',
      });
    }

    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start > end) {
      ctx.addIssue({
        path: ['end_date'],
        code: z.ZodIssueCode.custom,
        message: 'End date must be after start date',
      });
    }
  });
// export const validateDiscountCreateBody = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     discountCreateSchema.parse(req.body);
//     next();
//   } catch (error) {
//     return responseHandler(
//       res,
//       'Invalid request body',
//       statusEnum.FAILED,
//       null,
//       400,
//     );
//   }
// };

export const validateDiscountCreateBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Validate the request body with Zod schema
    discountCreateSchema.parse(req.body);
    next(); // Proceed to the next middleware or route handler if valid
  } catch (error) {
    if (error instanceof z.ZodError) {
      // If the error is an instance of ZodError, extract the field errors
      const errorFields = error.issues.map((issue) => ({
        field: issue.path[0], // Path to the field that failed validation
        message: issue.message, // Error message for the field
      }));

      // Optionally log the errors for debugging purposes
      console.error('Validation errors:', errorFields);

      // Return a response with a list of the failed fields and their messages
      return responseHandler(
        res,
        'Invalid request body',
        statusEnum.FAILED,
        { errors: errorFields }, // Include detailed error fields
        400,
      );
    } else {
      // If error is not a ZodError, send a generic response
      return responseHandler(
        res,
        'Unexpected error during validation',
        statusEnum.FAILED,
        null,
        500,
      );
    }
  }
};
