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

type Props = {
  params: {
    id: string;
  };
};

export default function CarouselDemo({ params: { id } }: Props) {
  const [productPictures, setProductPictures] = React.useState<
    IGetProductPictures[]
  >([]);
  const [product, setProduct] = React.useState<IProduct>();
  const { data: session, update } = useSession();

  React.useEffect(() => {
    async function getProductPictures() {
      try {
        const response = await api(`products/picture/${id}`, 'GET', {});
        setProductPictures(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getProductPictures();
  }, [id]);

  React.useEffect(() => {
    async function getProduct() {
      try {
        const response = await api(`products/${id}`, 'GET', {});

        setProduct(response.data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    }
    getProduct();
  }, [id]);

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 flex flex-col items-center gap-4 my-16">
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

          {/* Responsive arrows inside container */}
          <CarouselPrevious className="absolute left-2 top-1/2 z-10 -translate-y-1/2 sm:left-4" />
          <CarouselNext className="absolute right-2 top-1/2 z-10 -translate-y-1/2 sm:right-4" />
        </Carousel>

        {product ? (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 w-full px-2 rounded-md">
            <div className="flex flex-col">
              <div className="text-xl font-semibold">{product.name}</div>
              <div className="text-secondaryText">{product.weight}g</div>
            </div>

            <div className="text-primaryGreen font-semibold text-xl">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(product.price)}
            </div>
          </div>
        ) : (
          <div className="text-secondaryText italic">Loading...</div>
        )}
      </div>

      <Button
        variant={'default'}
        className={' bg-orangeAccent text-base max-w-screen-lg w-full'}
        disabled={!session?.user}
      >
        Add to Cart
      </Button>
    </div>
  );
}
