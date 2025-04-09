import { currencyFormatter } from '@/helper/product.helper';
import { useAppSelector } from '@/redux/store';
import { XIcon } from 'lucide-react';
import * as React from 'react';
import Dropdowncard from './DropdownCard.component';
import Link from 'next/link';

export default function NavbarDropDown() {
  const cartState = useAppSelector((state) => state.cartState);
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute top-full right-0 w-[310px] h-[280px] bg-slate-100 py-4 px-2 rounded-sm ring-1 "
    >
      <div className="w-full h-4/5 overflow-auto">
        {/** for cart item list */}

        {cartState.map((cart, index) => {
          return <Dropdowncard cartItem={cart} key={index} />;
        })}
      </div>
      <div className="w-full h-1/5">
        <button className="w-full h-full bg-black rounded-sm">
          <Link href={'./cart'}>
            {' '}
            <p className="text-white">View All cart</p>
          </Link>
        </button>
      </div>
    </div>
  );
}
