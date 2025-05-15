import { createContext } from "react";
import { IFilterTransactions } from "../dashboard/filter.interface";

export interface ITransaction {
    id: string,
    total_price: number,
    deadline_payment: string,
    transaction_status: string,
    payment_proof?: string,
    users_id: string,
    invoice_number: string,
    payment_method: string
    created_at: string,
    updated_at: string,
    deleted_at: string
}

// filter context type
export interface TransactionFilterContextType {
    filterTransactions: IFilterTransactions | undefined;
    setFilterTransactions: (filter: IFilterTransactions | undefined) => void;
}

export const TrxFilterContext = createContext<
    TransactionFilterContextType | undefined
>(undefined);

// transaction status change
export interface ITrxChangeContextType {
    isChange: boolean | undefined;
    setChange: (isChange: boolean | undefined) => void;
}

export const TrxChangeContext = createContext<
    ITrxChangeContextType | undefined
>(undefined);