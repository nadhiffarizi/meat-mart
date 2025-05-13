'use client';
import { getReverseLoc, getUserAddress } from '@/helper/user/address.helper';
import { apiRequest } from '@/helper/api.helper';
import { getCartDataAPI } from '@/helper/cart/cart.helper';
import { getProducts } from '@/helper/product/product.helper';
import { getCustomer } from '@/helper/user/user.helper';
import IAddress from '@/interface/user/address.interface';
import { ICart } from '@/interface/cart/cart.interface';
import { IUser } from '@/interface/user/user.interface';
import { updateAddressState } from '@/redux/slice/address.slice';
import { updateCartState } from '@/redux/slice/cart.slice';
import { updateUserState } from '@/redux/slice/user.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import * as React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

export default function InitialState({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    const resUser = getCustomer('user/get/customer');
    resUser
      .then((v) => v.json())
      .then((value) => {
        const user: IUser = {
          email: value['data']['email'],
          first_name: value['data']['first_name'],
          id: value['data']['id'],
          last_name: value['data']['last_name'],
          role: value['data']['role'],
        };
        if (value['data']['UserAddresses'].length === 0) {
          user.address_id = undefined;
        } else {
          user.address_id = value['data']['UserAddresses'][0]['id'];
        }
        dispatch(updateUserState(user));
        // if user have address base in the database, then do this...
        if (user.address_id) {
          const address: IAddress = {
            id: value['data']['UserAddresses'][0]['id'],
            address: value['data']['UserAddresses'][0]['address'],
            latitude: value['data']['UserAddresses'][0]['latitude'],
            longitude: value['data']['UserAddresses'][0]['longitude'],
            city: value['data']['UserAddresses'][0]['city'],
            district: value['data']['UserAddresses'][0]['district'],
            postal_code: value['data']['UserAddresses'][0]['postal_code'],
            province: value['data']['UserAddresses'][0]['province'],
            recipient_name: value['data']['UserAddresses'][0]['recipient_name'],
            user_id: value['data']['UserAddresses'][0]['user_id'],
            recipient_phone_number:
              value['data']['UserAddresses'][0]['recipient_phone_number'],
            is_selected: value['data']['UserAddresses'][0]['is_selected'],
          };
          dispatch(updateAddressState(address));
        } else {
          navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            const res = await getReverseLoc(latitude, longitude);
            const loc = await res.json();
            console.log(latitude, longitude);
            const addie: IAddress = {
              address: loc['display_name'],
              latitude: loc['lat'],
              longitude: loc['lon'],
              district: loc['address']['city_disctrict'],
              city: loc['address']['city'],
              postal_code: loc['address']['postcode'],
              province: loc['address']['city'],
              recipient_name: user.first_name,
            };
            dispatch(updateAddressState(addie));
          });
        }
        setUserId(user.id);
      });
    const resCart = getCartDataAPI('cart/get', userId!);
    resCart
      .then((v) => v.json())
      .then((values) => {
        const cartItems: ICart[] = values['data'];
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
          };
          myCartItems.push({ ...cartData });
        });
        console.log(myCartItems);

        dispatch(updateCartState(myCartItems));
      });
  }, []);
  return <div>{children}</div>;
}
