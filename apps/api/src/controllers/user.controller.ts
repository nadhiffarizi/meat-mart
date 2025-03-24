import { Request, Response, NextFunction } from 'express';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helper/responseHandler.helper';
import userService from '@/services/user.service';


export class UserController {
    public async getCustomer(req: Request, res: Response, next: NextFunction) {
        try {
            // try 
            const data: serviceFeedback = await userService.getCustomer(req)
            responseHandler(res, data.message, data.status, data.data, data.code)

        } catch (error) {
            next(error)
        }
    }

}

export default new UserController()