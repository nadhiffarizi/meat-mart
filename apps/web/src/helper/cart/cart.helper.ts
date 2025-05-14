import { ICart, payloadCartService } from "@/interface/cart/cart.interface";
import IProduct from "@/interface/product/product.interface";
import IStock from "@/interface/stock/stocks.interface";
import { apiRequest } from "../api.helper";

export const addToCartAPI = async (apiRoute: string, payload: payloadCartService, token: string) => {

  const response = await apiRequest(apiRoute, 'POST', { ...payload }, { "Content-Type": "application/json", 'Accept': 'application/json', "Authorization": `Bearer ${token}` })
  // console.log(await response.json());
  return response
}

export const subtractCartAPI = async (apiRouter: string, payload: payloadCartService, token: string) => {
  const response = await apiRequest(apiRouter, 'POST', { ...payload }, { "Content-Type": "application/json", "Accept": "application/json", "Authorization": `Bearer ${token}` })
  return response
}

export const updateCartQuantity = async (apiRouter: string, payload: payloadCartService, token: string) => {
  const response = await apiRequest(apiRouter, 'PUT', { ...payload }, { "Content-Type": "application/json", "Accept": "application/json", "Authorization": `Bearer ${token}` })
  return response
}

export const getCartDataAPI = async (apiRoute: string, token: string, page?: number) => {
  let fullRoute = ''
  if (page) {
    fullRoute = `${apiRoute}/${page}`
  } else {
    fullRoute = `${apiRoute}/0`
  }
  const response = await apiRequest(fullRoute, 'GET', undefined, { "Content-Type": "application/json", "Authorization": `Bearer ${token}` })
  return response
}

export const syncCartDataFromAPI = (data: any) => {

  const cartItems: ICart[] = data;
  if (cartItems.length === 0) {
    return []
  }

  const myCartItems: ICart[] = [];
  cartItems.map((item: any) => {
    const cartData: ICart = {
      id: item['id'],
      quantity: item['quantity'],
      Stock: {
        id: item['stocks']['id'],
        quantity: item['stocks']['quantity'],
        stores: {
          store_id: item['stocks']['stores']['id'],
          distance: item['stocks']['stores']['distance'],
          status: item['stocks']['stores']['status'],
        },
      },
      product: { ...item['stocks']['products'] },
      discount: undefined
    };
    myCartItems.push({ ...cartData });
  });
  console.log(myCartItems);
  return myCartItems
}

export const indexProductInCart = (cartState: ICart[], product: IProduct) => {
  // returns -1 if product not available in current Cart. Returns index if product found in current cart

  const indexProductInCart = cartState.findIndex((cartData) => cartData.product.id === product.id)

  if (indexProductInCart === -1) return -1

  return indexProductInCart
}

export const indexCartById = (cartState: ICart[], cartId: string) => {
  const index = cartState.findIndex((cartItem) => cartItem.id === cartId)
  return index
}

export const createNewCartItem = (product: IProduct, quantity: number, stock?: IStock) => {
  const newCartItem: ICart = {
    product: { ...product },
    quantity: 1,
  }
  return newCartItem
}

export const isMaxAddedToCart = (productInCart: ICart, productFromDB: IProduct) => {
  // returns true or false. False, can add to cart with the same product&stock

  // new  item registered in cart
  if (!productInCart) return false

  if (productInCart.quantity === maxStockAvailable(productFromDB).maxStockAvailable - 1) {
    return true
  } else {
    return false
  }

}

export const maxStockAvailable = (productFromDB: IProduct) => {
  // checks both stocks in the productfrom DB. Apply

  // get stocks in a certain product
  const stocksInProduct = productFromDB.availableStocks
  let maxStockAvailable: number = 0
  let maxStockIndex: number = -1

  // assign which max stock available
  stocksInProduct.map((stock, index: number) => {
    if (stock.quantity > maxStockAvailable) {
      maxStockAvailable = stock.quantity
      maxStockIndex = index
    }
  })

  return {
    maxStockAvailable,
    maxStockIndex
  }

}

export const whichStockApplied = (productFromDB: IProduct): IStock => {
  // find branch store
  const findIndexBranch = productFromDB.availableStocks.findIndex((stock) => stock.stores.status === 'BRANCH')
  if (findIndexBranch == -1) { // cannot get branch store, refer to CENTRAL
    return productFromDB.availableStocks[0]
  } else {
    return productFromDB.availableStocks[findIndexBranch]
  }
}

export const countTotalInCart = (cartState: ICart[]): number => {
  let totalCountInCart: number = 0

  cartState.map((cart) => {
    totalCountInCart += cart.quantity
  })

  return totalCountInCart
}

export const countCartTotalPrice = (cartState: ICart[]): number => {
  let tempTotal = 0
  cartState.map((cartItem) => tempTotal += (cartItem.product.price * cartItem.quantity))
  return tempTotal
}




