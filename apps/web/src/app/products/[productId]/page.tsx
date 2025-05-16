'use client';
import * as React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { IProduct } from '@/interface/product/product.interface';
import { api } from '@/helper/api';
import { IGetProductPictures } from '@/interface/product/productPictures.interface';
import Image from 'next/image';
import meatMartDefault from '@/media/image/meat-mart-dashboard.png';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { getProducts } from '@/helper/product/product.helper';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import {
  addToCartAPI,
  getCartDataAPI,
  indexProductInCart,
  isMaxAddedToCart,
  syncCartDataFromAPI,
} from '@/helper/cart/cart.helper';
import { callToast } from '@/helper/notify.helper';
import { updateCartState } from '@/redux/slice/cart.slice';
import { Alert, Snackbar } from '@mui/material';
import { useRouter } from 'next/navigation';

type Props = {
  params: {
    productId: string;
  };
};

export default function CarouselDemo({ params: { productId } }: Props) {
  const [productPictures, setProductPictures] = React.useState<
    IGetProductPictures[]
  >([]);
  const [productData, setProductData] = React.useState<IProduct>();
  const { data: session, update } = useSession();
  const router = useRouter();

  //grab product pictures
  React.useEffect(() => {
    async function getProductPictures() {
      try {
        const response = await api(`products/picture/${productId}`, 'GET', {});
        setProductPictures(response.data as IGetProductPictures[]);
      } catch (error: any) {
        console.log(error);
      }
    }
    getProductPictures();
  }, [productId]);

  //get product data

  React.useEffect(() => {
    const resProduct = getProducts(`products?productId=${productId}`);

    resProduct
      .then((v) => v.json())
      .then((value) => {
        console.log('value', value);
        const a: IProduct[] = [];
        value['data'].map((product: any) => {
          const data: IProduct = {
            name: product['name'],
            price: product['price'],
            id: product['id'],
            slug: product['slug'],
            weight: product['weight'],
            image: product['image'],
            availableStocks: product['availableStocks'],
          };
          a.push(data);
        });

        setProductData([...a][0]);
      });
  }, [productId]);

  const dispatch = useAppDispatch();
  const cartState = useAppSelector((state) => state.cartState);

  // local state
  const [isMaxAdded, setMaxAdded] = React.useState<boolean>();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!session) {
      setOpenSnackbar(true);
      return;
    }

    // call api first
    const resAddCart = await addToCartAPI(
      'cart/add',
      {
        quantity: 1,
        productId: productId,
      },
      session.user.access_token!,
    );

    if (resAddCart.status !== 200) {
      callToast('Something went wrong, try again later', 'ERROR', 3000);
      return;
    }

    // get latest cart
    const resGetCart = await getCartDataAPI(
      'cart/get',
      session.user.access_token!,
    );
    if (resGetCart.status !== 200) {
      callToast('Something went wrong, try again later', 'ERROR', 3000);
      return;
    }

    // sync to local state
    const updatedCart = syncCartDataFromAPI((await resGetCart.json())['data']);
    dispatch(updateCartState(updatedCart));

    const index = indexProductInCart(cartState, productData as IProduct);
    setMaxAdded(isMaxAddedToCart(cartState[index], productData as IProduct));

    // Add to cart logic here
    console.log('Added to cart:', productData as IProduct);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 flex flex-col items-center gap-4 my-16">
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          onClose={handleCloseSnackbar}
          sx={{ width: '100%' }}
        >
          Silahkan Masuk untuk menambahkan produk ke keranjang!
        </Alert>
      </Snackbar>
      <div className="relative mx-auto w-full max-w-screen-lg flex flex-col gap-4">
        <Carousel className="w-full">
          <CarouselContent>
            {productPictures.length ? (
              productPictures.map((productPicture, index) => (
                <CarouselItem key={productPicture.id} className="w-full">
                  <Card className="overflow-hidden rounded-xl shadow-md">
                    <CardContent className="p-0">
                      <div className="relative w-full h-48 sm:h-56 md:h-64">
                        <Image
                          src={productPicture.link}
                          alt={`Product Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))
            ) : (
              <div className="relative w-full h-48 sm:h-56 md:h-64">
                <Image
                  src={'/templateproduct.png'}
                  alt={`Meat Mart Default Picture`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </CarouselContent>

          <CarouselPrevious className="absolute left-2 top-1/2 z-10 -translate-y-1/2 sm:left-4" />
          <CarouselNext className="absolute right-2 top-1/2 z-10 -translate-y-1/2 sm:right-4" />
        </Carousel>

        {productData ? (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 w-full px-2 rounded-md">
            <div className="flex flex-col">
              <div className="text-xl font-semibold">{productData.name}</div>
              <div className="text-secondaryText">{productData.weight}g</div>
            </div>

            <div className="text-primaryGreen font-semibold text-xl">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(productData.price)}
            </div>
          </div>
        ) : (
          <div className="text-secondaryText italic">Loading...</div>
        )}
      </div>

      <button
        onClick={handleAddToCart}
        className={`h-9 rounded-md text-base max-w-screen-lg w-full
          ${
            !session || !productData?.availableStocks || isMaxAdded
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-orangeAccent hover:text-white hover:bg-orange-600'
          }`}
      >
        Add to Cart
      </button>

      <Button
        variant="link"
        className=" text-primaryText px-4 py-2 text-base "
        onClick={() => {
          router.push('/');
        }}
        type="button"
      >
        Back to Products
      </Button>
    </div>
  );
}
