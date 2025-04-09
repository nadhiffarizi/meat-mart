import { E_OrderStatus } from "@prisma/client";

export const convertOrderStatusToEnum = (status: string[]): E_OrderStatus[] => {
    if (status.length === 0) {
        return [E_OrderStatus.AWAITING_PAYMENT, E_OrderStatus.CANCELED, E_OrderStatus.CONFIRMED, E_OrderStatus.ON_DELIVERY, E_OrderStatus.ON_PROCESS, E_OrderStatus.PENDING_ADMIN]
    } else {
        const statusEnums: E_OrderStatus[] = []

        for (let s of status) {
            switch (s) {
                case 'AWAITING_PAYMENT':
                    statusEnums.push(E_OrderStatus.AWAITING_PAYMENT)
                    break;
                case 'CANCELED':
                    statusEnums.push(E_OrderStatus.CANCELED)
                    break;
                case 'CONFIRMED':
                    statusEnums.push(E_OrderStatus.CONFIRMED)
                    break;
                case 'ON_DELIVERY':
                    statusEnums.push(E_OrderStatus.ON_DELIVERY)
                    break;
                case 'ON_PROCESS':
                    statusEnums.push(E_OrderStatus.ON_PROCESS)
                    break;
                case 'PENDING_ADMIN':
                    statusEnums.push(E_OrderStatus.PENDING_ADMIN)
                    break;
            }

        }

        return statusEnums
    }
}