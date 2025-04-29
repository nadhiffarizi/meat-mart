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

export const findThumbnailByProductId = async (productId: string) => {
    /**returns product thumbnail link by productId */

    const productThumbnail = await prisma.productPictures.findFirst({
        select: {
            link: true
        },
        where: {
            AND: {
                product_id: productId,
                thumbnail_status: true
            }

        }
    })

    return productThumbnail
}

export const findThumbnailByStockId = async (stockId: string) => {
    /**return product thumbnail using stockid */
    // find product
    const product = await prisma.stocks.findUnique({
        select: {
            product_id: true
        }, where: {
            id: stockId
        }
    })

    const thumbnail = await prisma.productPictures.findFirst({
        select: {
            link: true
        },
        where: {
            AND: {
                product_id: product?.product_id!,
                thumbnail_status: true
            }
        }
    })

    return thumbnail
}

