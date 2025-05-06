import { responseHandler } from "@/helper/responseHandler.helper";
import { serviceFeedback } from "@/interface/serviceFeedback.interface";
import storeQueryService from "@/services/storeQuery.service";
import { NextFunction, Response, Request } from "express";

export class StoreController {
  public async getStoreByAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const data: serviceFeedback = await storeQueryService.getStoreByAdmin(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }
}

export default new StoreController()