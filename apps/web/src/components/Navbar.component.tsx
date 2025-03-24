'use client';
import * as React from 'react';
import {
  ShoppingBagIcon,
  ShoppingCartIcon,
  UserCircleIcon,
} from '@heroicons/react/16/solid';

export default function NavBar() {
  return (
    <div className="w-full lg:h-[80px] bg-white shadow-md py-2 lg:px-10">
      <div className="flex justify-between w-full h-full ">
        <div className="w-1/3 max-w-[300px] h-full ">
          {/** for logo */}
          <img className="h-full" src="./logo-1.jpg" />
        </div>
        <div className="w-1/3 max-w-[300px] h-full ">
          {/** for cart icon */}
          <div className="flex justify-start items-center h-full ">
            <button className="h-1/2 w-16 flex justify-center items-center">
              <ShoppingBagIcon className="h-full fill-black stroke-none" />
            </button>
            <button className="h-1/2 w-16 flex justify-center items-center">
              <UserCircleIcon className="h-full fill-black stroke-none" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
