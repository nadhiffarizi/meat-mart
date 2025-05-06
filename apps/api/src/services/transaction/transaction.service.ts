import { statusEnum } from "@/enums/statusEnum.enums";
import { deleteCart, disableCart, findCartById, findCartByIds, findCartByOrderInput } from "@/helper/cart/cart.helper";
import { cloudinaryRemove, cloudinaryUpload } from "@/helper/cloudinary.helper";
import { updateCartToOrder } from "@/helper/order/order.helper";
import { returnServiceFeedback } from "@/helper/responseHandler.helper";
import { convertRoleToEnum } from "@/helper/role.helper";
import { cancelTransaction, createDefaultTrxId, createTransaction, createTrxDetails, getTrxById, updateTrxStatus } from "@/helper/transaction/transaction.helper";
import { ICart } from "@/interface/cart.interface";
import ILocation from "@/interface/location.interface";
import { IOrderInput } from "@/interface/order.interface";
import { serviceFeedback } from "@/interface/serviceFeedback.interface";
import prisma from "@/prisma";
import { E_OrderStatus, E_Role, E_TransactionStatus } from "@prisma/client";
import { Request } from "express";

class TransactionService {
    async create(req: Request) {

        try {
            const { orderInputs } = req.body
            const user = req.user

            const role = convertRoleToEnum(user?.role!)
            if (role !== E_Role.CUSTOMER) throw new Error("Unauthorized role to access this service")
            // placeholder for location 
            const loc1: ILocation = {
                lat: "-6.2263977",
                lon: "106.8584389"
            }

            // find carts data
            const carts = await findCartByOrderInput(orderInputs as IOrderInput[], user?.id!)

            // update cart to order
            const filteredCarts = await updateCartToOrder(carts as ICart[], user?.id!, loc1)

            // recap trxdetails & trx
            const trxDetails = []
            let trx = {}

            if (filteredCarts.notEligibleCart.length !== 0) {
                // feedback from service
                return returnServiceFeedback(406, filteredCarts.notEligibleCart, statusEnum.FAILED, "Transaction failed to create, there are insufficient stock in some of your carts")

            } else {
                // create default transaction record 
                const trxId = await createDefaultTrxId(user?.id!)

                // set total price 
                let totalPrice = 0

                // create order details
                for (let i = 0; i < filteredCarts.eligibleCart.length; i++) {
                    let cartItem = filteredCarts.eligibleCart[i]
                    const trxDetail = await createTrxDetails(trxId, cartItem, loc1, (orderInputs as IOrderInput[])[i])
                    trxDetails.push(trxDetail)
                    totalPrice += (trxDetail.sub_total + trxDetail.shipping_cost) // total price for one cart item

                    // delete cart
                    await deleteCart(cartItem.id)
                }

                // update transaction table
                const newTrx = await createTransaction(trxId, totalPrice, user?.id!)
                trx = { ...newTrx }
            }

            // get cart
            const cartAfterCheckout = await findCartByIds(carts?.map((cart) => cart.id)!)

            // feedback from service
            return returnServiceFeedback(200, { cartAfterCheckout, trx }, statusEnum.SUCCESS, "transaction created successfully")

        } catch (error) {

            // feedback from service
            return returnServiceFeedback(400, (error as Error).message, statusEnum.FAILED, "create transaction failed")
        }


    }

    async cancel(req: Request) {
        const { trxId } = req.body
        const user = req.user

        try {
            const role = convertRoleToEnum(user?.role!)
            if (role !== E_Role.CUSTOMER) throw new Error("Unauthorized role to access this service")
            const canceledTrx = await cancelTransaction(user?.id!, trxId)
            // feedback from service
            return returnServiceFeedback(200, canceledTrx, statusEnum.SUCCESS, "cancel transaction success")
        } catch (error) {
            return returnServiceFeedback(400, (error as Error).message, statusEnum.FAILED, "cancel transaction failed")
        }
    }

    async uploadTrxProof(req: Request) {

        const image = req.file;
        const { trxId } = req.body
        const user = req.user

        try {
            // console.log(image?.originalname, trxId);
            // check if payment proof already available 
            const role = convertRoleToEnum(user?.role!)
            if (role !== E_Role.CUSTOMER) throw new Error("Unauthorized role to access this service")
            const existingLink = await prisma.transactions.findUnique({
                select: {
                    payment_proof: true
                },
                where: {
                    id: trxId
                }
            })
            if (existingLink?.payment_proof) {
                // remove existing link
                const removeLink = await cloudinaryRemove(existingLink.payment_proof)
                console.log("here");
            }

            const { secure_url } = await cloudinaryUpload(image!)

            // update link to include in transaction table
            const updatedTrx = await prisma.transactions.update({
                where: {
                    id: trxId
                }, data: {
                    payment_proof: secure_url,
                    transaction_status: E_TransactionStatus.PENDING_ADMIN
                }
            })
            return returnServiceFeedback(200, updatedTrx, statusEnum.SUCCESS, "upload transaction proof success")
        } catch (error) {
            return returnServiceFeedback(400, (error as Error).message, statusEnum.FAILED, "upload transaction proof failed")
        }

    }
}

export default new TransactionService()
