import { ICart } from '@/interface/cart.interface';

export const totalDiscountApplied = (cartState: ICart[]) => {
  let totalDefaultPrice = 0;
  let totalDiscountAmount = 0;

  for (let cartItem of cartState) {
    totalDefaultPrice += cartItem.quantity * cartItem.product.price;
    if (cartItem.discount) {
      totalDiscountAmount +=
        cartItem.quantity * cartItem.product.price - cartItem.subtotalPrice!;
    }
    if (cartItem.discount?.promotion_type === 'BOGO') {
      totalDiscountAmount += cartItem.pricePerProduct!;
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
