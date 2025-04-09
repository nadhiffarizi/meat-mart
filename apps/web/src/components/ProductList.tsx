import React from 'react';
import { Card } from './Card';

type Props = {};

export const ProductList = (props: Props) => {
  return (
    <div className="max-w7-xl lg:w-[70%] m-auto px-4 md:px-6 lg:px-0">
      <div>
        <h3 className="text-xl md:text-3xl font-bold">Daging Yang Kamu Mau!</h3>
        <div className="my-5 grid grid-col-2 gap-2">
          <div>
            <Card />
          </div>
          <div>
            <Card />
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-xl md:text-3xl font-bold">Promo Menarik</h3>
      </div>
    </div>
  );
};
