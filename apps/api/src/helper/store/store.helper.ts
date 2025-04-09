import prisma from "@/prisma"

export const findStoreById = async (storeId: string) => {
    const store = await prisma.stores.findUnique({
        where: {
            id: storeId
        }
    })

    if (!store) return null

    return store
}

export const findStoreByStockId = async (stockId: string) => {
    const store = await prisma.stocks.findUnique({
        select: {
            stores: true
        },
        where: {
            id: stockId
        }
    })

    return store?.stores!
}

export const findStoreByAdmin = async (adminId: string) => {
    const stores = await prisma.stores.findMany({
        where: {
            id: adminId
        }
    })

    return stores
}

export const findStoreBySuperAdmin = async () => {
    const stores = await prisma.stores.findMany({})
    return stores
}