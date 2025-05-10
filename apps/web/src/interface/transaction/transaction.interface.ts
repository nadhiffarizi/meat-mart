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