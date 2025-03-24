import { apiRequest } from '@/helper/api.helper';
import * as React from 'react';
import ProductCard from './ProductCard.component';
import IProduct from '@/interface/product.interface';
import { getProducts } from '@/helper/product.helper';
export default async function FeaturedProducts() {
  const res = await getProducts('/api/products');
  const data = await res.json();
  const products = data['data'] as [];

  return (
    <div className="w-full h-3/4 max-h-[700px]  py-20 px-10">
      <div className="flex justify-around items-center w-full h-full gap-5 py-5 px-10">
        {products.map((product: IProduct, index: number) => {
          const data: IProduct = {
            name: String(product.name),
            price: product.price,
            id: String(product.id),
            slug: String(product.slug),
            weight: product.weight,
            created_at: product.created_at.toString(),
            updated_at: product.updated_at.toString(),
            deleted_at:
              product.deleted_at === null ? '' : product.deleted_at.toString(),
          };
          return <ProductCard product={data} key={index} />;
        })}
      </div>
    </div>
  );
}
