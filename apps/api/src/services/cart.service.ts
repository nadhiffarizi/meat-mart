import { statusEnum } from "@/enums/statusEnum.enums";
import { serviceFeedback } from "@/interface/serviceFeedback.interface";
import { Request } from "express";

class CartService {
    async add(req: Request) {
        try {
            // need info: user, address(location), productId
            const { productId } = req.body

            // feedback from service
            const feedback: serviceFeedback = {
                code: 200,
                data: null,
                status: statusEnum.SUCCESS,
                message: "add cart success"
            }
            return feedback
        } catch (error) {
            // feedback from service
            const feedback: serviceFeedback = {
                code: 400,
                data: null,
                status: statusEnum.FAILED,
                message: (error as Error).message
            }
            return feedback
        }


    }
}

export default new CartService()
