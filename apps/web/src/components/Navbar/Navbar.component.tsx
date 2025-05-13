'use client';
import * as React from 'react';
import { ShoppingBagIcon, UserCircleIcon } from '@heroicons/react/16/solid';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { useEffect, useState, useRef } from 'react';
import { countTotalInCart } from '@/helper/cart/cart.helper';
import NavbarDropDown from './NavbarDropdown.component';

export default function NavBar() {
  // global state
  const cartState = useAppSelector((state) => state.cartState);
  const addressState = useAppSelector((state) => state.addressState);
  const userState = useAppSelector((state) => state.userState);
  const dispatch = useAppDispatch();

  // localstate
  const [totalLength, setTotalLength] = useState<number>();
  const [dropdownToggle, setToggle] = useState<boolean>(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const totalQtty = countTotalInCart(cartState);
    setTotalLength(totalQtty);
  }, [cartState]);
  return (
    <div className="w-full lg:h-[80px] bg-white shadow-md py-2 lg:px-10">
      <div className="flex justify-between w-full h-full ">
        <div className="w-1/3 max-w-[300px] h-full ">
          {/** for logo */}
          <img className="h-full" src="./logo-1.jpg" />
        </div>

        <div className="w-1/3 max-w-[300px] h-full">
          <div className="flex flex-col w-full h-full justify-center items-center">
            <p className="text-red-500">
              {/**for user */}
              {userState.email || 'blank'}
            </p>
            <p>
              {/**for address */}
              {addressState.address}
            </p>
          </div>
        </div>
        <div className="w-1/3 max-w-[300px] h-full ">
          {/** for cart icon */}
          <div className="flex justify-start items-center h-full gap-10">
            <div className="flex justify-center items-center h-full w-10 ">
              <div className="relative flex justify-center items-center w-full h-full">
                <ShoppingBagIcon
                  onClick={() => setToggle(!dropdownToggle)}
                  className="w-full h-full fill-black stroke-none"
                />
                <div className="absolute flex justify-center items-center bg-red-500 w-5 h-5 rounded-full top-3 right-0">
                  <p className="text-xs text-white">{totalLength}</p>
                </div>
                {dropdownToggle && <NavbarDropDown />}
              </div>
            </div>
            <button className="h-1/2 w-8 flex justify-center items-center">
              <div className="relative w-full h-full">
                <UserCircleIcon className="h-full fill-black stroke-none" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
