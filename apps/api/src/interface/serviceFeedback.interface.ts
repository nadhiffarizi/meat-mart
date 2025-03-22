import { statusEnum } from "@/enums/statusEnum.enums";

export interface serviceFeedback {
    status: statusEnum,
    message: string,
    data: any,
    code: number
}