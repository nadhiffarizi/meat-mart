import { IFilterOrder, IFilterStatusOrder } from "@/interface/dashboard/filter.interface";

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

export const statusFilterToArray = (statusState: IFilterStatusOrder) => {

    if (!statusState) return undefined

    const statusArray: string[] = []
    Object.entries(statusState).map((value) => {
        if (value[1]) {
            statusArray.push(value[0])
        }
    })

    return statusArray
}

export const setQueryParams = (filterOrder: IFilterOrder | undefined) => {
    if (!filterOrder) return ''

    const params = new URLSearchParams()
    let queryParams: string[] = []
    if (filterOrder.from) {
        params.append('from', filterOrder.from.toString())
    }
    if (filterOrder.until) {
        params.append('until', filterOrder.until.toString())
    }
    if (filterOrder.invoiceNumber && filterOrder.invoiceNumber?.length > 0) {
        params.append('invoice', filterOrder.invoiceNumber)
    }

    if (filterOrder.statusArray && filterOrder.statusArray?.length > 0) {
        for (let status of filterOrder.statusArray) {
            params.append('status', status)
        }
    }

    if (filterOrder.stores && filterOrder.stores.length > 0) {
        for (let store of filterOrder.stores) {
            params.append('store', store.id)
        }
    }
    return params
}