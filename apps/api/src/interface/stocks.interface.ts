import { E_StoreStatus } from "@prisma/client";

export default interface IStock {
    quantity: number;
    id: string;
    stores: {
        id: string;
        distance: number;
        status: E_StoreStatus;
    };
}