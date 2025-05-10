import { PickerValue } from "@mui/x-date-pickers/internals";
import IStore from "../store/store.interface";

export interface IFilterStatus {
    AWAITING_PAYMENT: boolean;
    CANCELED: boolean;
    PENDING_ADMIN: boolean;
    CONFIRMED_ADMIN: boolean;
    DONE: boolean;
}

export interface IFilterStatusOrder {
    AWAITING_PAYMENT: boolean;
    CANCELED: boolean;
    PENDING_ADMIN: boolean;
    CONFIRMED_ADMIN: boolean;
    CONFIRMED: boolean;
    ON_PROCESS: boolean;
    ON_DELIVERY: boolean
}

export interface IFilterTransactions {
    invoiceNumber: string | undefined,
    from: number | null,
    until: number | null,
    statusArray: string[] | undefined,
    stores?: IStore[] | undefined
}

export interface IFilterStatus {
    AWAITING_PAYMENT: boolean;
    CANCELED: boolean;
    PENDING_ADMIN: boolean;
    CONFIRMED_ADMIN: boolean;
    DONE: boolean;
}

export interface IFilterOrder {
    invoiceNumber: string | undefined,
    from: number | null,
    until: number | null,
    statusArray: string[] | undefined,
    stores?: IStore[] | undefined
}