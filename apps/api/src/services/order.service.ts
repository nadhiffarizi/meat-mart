import { statusEnum } from "@/enums/statusEnum.enums";
import { serviceFeedback } from "@/interface/serviceFeedback.interface";
import { Request } from "express";

class OrderService {
    async create(req: Request) {


        // feedback from service
        const feedback: serviceFeedback = {
            code: 200,
            data: null,
            status: statusEnum.SUCCESS,
            message: "order created success"
        }
        return feedback
    }
}

export default new OrderService()
