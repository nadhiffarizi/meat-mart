import { statusEnum } from "@/enums/statusEnum.enums";
import { serviceFeedback } from "@/interface/serviceFeedback.interface";
import { Request } from "express";

class AuthService {
    async register(req: Request) {


        // feedback from service
        const feedback: serviceFeedback = {
            code: 200,
            data: null,
            status: statusEnum.SUCCESS,
            message: "success"
        }
        return feedback
    }
}

export default new AuthService()
