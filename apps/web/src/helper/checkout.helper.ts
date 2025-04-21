import { ICart } from '@/interface/cart.interface';
import { IOrderInput } from '@/interface/checkout.interface';
import { apiRequest } from './api.helper';

export const totalDiscountApplied = (cartState: ICart[]) => {
  let totalDefaultPrice = 0;
  let totalDiscountAmount = 0;

  for (let cartItem of cartState) {
    totalDefaultPrice += cartItem.quantity * cartItem.product.price;
    if (cartItem.discount) {
      totalDiscountAmount +=
        cartItem.quantity * cartItem.product.price - cartItem.subtotalPrice!;
    }
  }

  console.log(totalDefaultPrice);

  const discountPercentage = parseFloat(
    ((totalDiscountAmount / totalDefaultPrice) * 100).toFixed(2),
  );

  return { discountPercentage, totalDiscountAmount };
};

export const totalDefaultPrice = (cartState: ICart[]) => {
  let price = 0;

  for (let cartItem of cartState) {
    price += cartItem.quantity * cartItem.product.price;
  }

  return { price };
};

export const totalAfterDiscount = (cartState: ICart[]) => {
  const defaultPrice = totalDefaultPrice(cartState).price;
  const discountAmount = totalDiscountApplied(cartState).totalDiscountAmount;

  return defaultPrice - discountAmount;
};

export const createTransactionPayload = (
  cartState: ICart[],
  userId?: string,
) => {
  //   {
  //     "orderInputs": [
  //     {
  //         "cartId": "5b64e312-570f-4f51-9bae-810c807f113b",
  //         "discountId": "5"
  //     }
  //     ],
  //     "userId": "1"
  // }

  /**return payload orderinputs and userId */
  const orderInputs: IOrderInput[] = [];
  for (let cart of cartState) {
    if (!cart.discount) {
      orderInputs.push({ cartId: cart.id! });
    } else {
      orderInputs.push({ cartId: cart.id!, discountId: cart.discount.id });
    }
  }

  const payload = { orderInputs, userId: userId };
  // console.log(payload);
  return payload

};

export const createTransactionAPI = async (apiRoute: string, payload: any) => {
  console.log(payload);

  const response = await apiRequest(
    apiRoute,
    'POST',
    { ...payload },
    { 'Content-Type': 'application/json', Accept: 'application/json' },
  );
  // console.log(await response.json());
  return response;
};
