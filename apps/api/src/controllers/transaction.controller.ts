// import { Request, Response, NextFunction } from 'express';
// import { responseHandler } from '../helpers/responseHandler.helper';
// import transactionService from '@/services/transaction.service';

// export class TransactionController {
//   public async getShippingCost(
//     req: Request,
//     res: Response,
//     next: NextFunction,
//   ) {
//     try {
//       const data = await transactionService.getShippingCostList(req);
//       responseHandler(res, data.message, data.status, data.data, data.code);
//     } catch (error) {
//       console.log(error);
//       next(error);
//     }
//   }
// }
// export default new TransactionController();
