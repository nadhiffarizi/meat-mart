import { IFilterStatusOrder } from "@/interface/filter.interface";

export const statusFilterUpdate = (statusFilter: string, statusState: IFilterStatusOrder) => {
    let temp = { ...statusState }
    switch (statusFilter) {
        case 'AWAITING_PAYMENT':
            temp.AWAITING_PAYMENT = !temp.AWAITING_PAYMENT
            break;
        case 'CANCELED':
            temp.CANCELED = !temp.CANCELED
            break;
        case 'CONFIRMED_ADMIN':
            temp.CONFIRMED_ADMIN = !temp.CONFIRMED_ADMIN
            break;
        case 'CONFIRMED':
            temp.CONFIRMED = !temp.CONFIRMED
            break;
        case 'PENDING_ADMIN':
            temp.PENDING_ADMIN = !temp.PENDING_ADMIN
            break;
        case 'ON_PROCESS':
            temp.ON_PROCESS = !temp.ON_PROCESS
            break;
        case 'ON_DELIVERY':
            temp.ON_DELIVERY = !temp.ON_DELIVERY
            break;

    }
    return temp
}