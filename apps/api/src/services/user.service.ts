import { statusEnum } from "@/enums/statusEnum.enums";
import { serviceFeedback } from "@/interface/serviceFeedback.interface";
import prisma from "@/prisma";
import { E_Role } from "@prisma/client";
import { Request } from "express";

class UserService {
    async getCustomer(req: Request) {

        try {
            const user = await prisma.users.findFirst({
                where: {
                    role: E_Role.CUSTOMER
                }
            })

            // feedback from service
            const feedback: serviceFeedback = {
                code: 200,
                data: user,
                status: statusEnum.SUCCESS,
                message: "get customer data success"
            }
            return feedback

        } catch (error) {
            // feedback from service
            const feedback: serviceFeedback = {
                code: 200,
                data: null,
                status: statusEnum.FAILED,
                message: (error as Error).message
            }
            return feedback
        }


    }
}

export default new UserService()
