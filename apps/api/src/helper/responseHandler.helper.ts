import { statusEnum } from "@/enums/statusEnum.enums";
import { serviceFeedback } from "@/interface/serviceFeedback.interface";
import { Response } from "express";

export class ErrorHandler extends Error {
    private code: number;

    constructor(message: string, code?: number) {
        super(message);
        this.code = code || 404;
    }
}

export const responseHandler = (
    res: Response,
    message: string,
    status: statusEnum,
    data?: any,
    code?: number
) => {
    return res.status(code || 200).send({
        message: message,
        status: status,
        data: data
    });
};

export const returnServiceFeedback = (code: number, data: any, status: statusEnum, message: string) => {
    const feedback: serviceFeedback = {
        code: code,
        data: data,
        status: status,
        message: message
    }
    return feedback
}