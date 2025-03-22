import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { jwtAccessSecret, jwtRefreshSecret } from "../config";
import { ErrorHandler } from "../helper/responseHandler.helper";
import { IUser } from "@/interface/User.interface";


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers
        const token = String(authorization || "").split("Bearer ")[1]
        const verifiedUser = verify(token, jwtAccessSecret)
        if (!verifiedUser) throw new ErrorHandler("unauthorized", 401)
        req.user = verifiedUser as IUser
        next();
    } catch (error) {
        next(error)
    }
}

export const verifyRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers
        const token = String(authorization || "").split("Bearer ")[1]
        const verifiedUser = verify(token, jwtRefreshSecret)
        if (!verifiedUser) throw new ErrorHandler("unauthorized", 401)
        req.user = verifiedUser as IUser
        next();
    } catch (error) {
        next(error)
    }
}