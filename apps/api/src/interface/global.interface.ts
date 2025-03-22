import { IUser } from "./User.interface";

declare global {
    namespace Express {
        export interface Request {
            user?: IUser
        }

        export interface Response {
            user?: IUser
        }
    }
}