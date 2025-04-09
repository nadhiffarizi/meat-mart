import prisma from "@/prisma"

export const findProductById = async (id: string) => {
    const data = await prisma.products.findUnique({
        where: {
            id: id
        }
    })
    return data
}


export const findProductByStockId = async (stockId: string) => {
    const product = await prisma.stocks.findUnique({
        select: {
            products: true
        },
        where: {
            id: stockId,
        }
    })

    return { ...product }
}

