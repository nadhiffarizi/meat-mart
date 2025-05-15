'use client';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Toaster, toast } from 'sonner';
import { useFormik } from 'formik';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { api } from '@/helper/api';
import { IGetDashboardProducts } from '@/interface/product/product.interface';
import EditStockFormAlert from './alerts/EditStockFormAlert';
import { IGetCategories } from '@/interface/product/category.interface';
import Image from 'next/image';
import Link from 'next/link';
import { IGetStocks } from '@/interface/stock/stocks.interface';

const validationSchema = Yup.object({
  currQuantity: Yup.number().required(),
  quantity: Yup.number().required(
    'Please set a valid amount to add or subtract from the current quantity',
  ),
  status: Yup.mixed<'ADD' | 'SUBTRACT' | 'SNAPSHOT'>()
    .oneOf(['ADD', 'SUBTRACT', 'SNAPSHOT'])
    .required('Please pick a valid status.'),
});

function EditStockForm({
  productId,
  storeId,
}: {
  productId: string;
  storeId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams?.get('status');
  const { data: session, update } = useSession();
  const [disabled, setDisabled] = useState(false);
  const [stockDetails, setStockDetails] = useState<IGetStocks>();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) || value === '') {
      const numericValue = value === '' ? '' : Math.max(0, Number(value));
      formik.setFieldValue('quantity', numericValue);
    }
  };

  useEffect(() => {
    async function getStockData() {
      try {
        const response = await api(
          `stock?productId=${productId}&storeId=${storeId}`,
          'GET',
          {},
          session?.user.access_token,
        );
        setStockDetails(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getStockData();
  }, [productId, storeId, session?.user.access_token]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      currQuantity: stockDetails?.quantity,
      quantity: 0,
      status: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setDisabled(true);

        const { currQuantity, ...updatedValues } = values;

        const response = await api(
          `stock?productId=${productId}&storeId=${storeId}`,
          'POST',
          {
            body: {
              ...updatedValues,
            },
            contentType: 'application/json',
          },
          session?.user.access_token,
        );

        if (response) {
          toast.success(response.message || 'Stock successfully recorded!');
          router.push(
            `/dashboard/inventories/store/${storeId}/product/${productId}/edit?status=successful`,
          );
        } else {
          toast.error(response.message || 'Something went wrong!');
          setDisabled(false);
        }
      } catch (error: any) {
        toast.error(error.message || 'Something went wrong!');
        setDisabled(false);
      }
    },
  });
  return (
    <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
      <EditStockFormAlert status={status} storeId={storeId} />
      <div className="flex flex-col gap-2">
        <label htmlFor="name">Latest Stock</label>
        <input
          type="text"
          name="name"
          id="name"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
          placeholder="Beef"
          value={formik.values.currQuantity}
          onChange={formik.handleChange}
          disabled={true}
        />
        {formik.touched.currQuantity && formik.errors.currQuantity && (
          <div className="text-red-500 text-sm">
            {formik.errors.currQuantity}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="quantity">
          Quantity <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="quantity"
          id="quantity"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
          placeholder="20000"
          value={formik.values.quantity}
          onChange={handleQuantityChange}
          disabled={disabled}
        />
        {formik.touched.quantity && formik.errors.quantity && (
          <div className="text-red-500 text-sm">{formik.errors.quantity}</div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="status">
          Status <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="status"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            ADD
            <input
              type="radio"
              name="status"
              id="status"
              value="ADD"
              onChange={formik.handleChange}
              disabled={disabled}
            />
          </label>

          <label
            htmlFor="status"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            SUBTRACT
            <input
              type="radio"
              name="status"
              id="status"
              value="SUBTRACT"
              onChange={formik.handleChange}
              disabled={disabled}
            />
          </label>

          {formik.touched.status && formik.errors.status && (
            <div className="text-red-500 text-sm">{formik.errors.status}</div>
          )}
        </div>
      </div>

      <Button
        variant="default"
        size={'lg'}
        className={
          disabled
            ? ' bg-secondaryText px-4 py-2  text-base'
            : ' bg-orangeAccent  px-4 py-2  text-base'
        }
        disabled={disabled}
        type="submit"
      >
        {disabled ? 'Saving Changes' : 'Save Changes'}
      </Button>

      <Button
        variant="link"
        className=" text-primaryText px-4 py-2 text-base "
        onClick={() => {
          router.push('/dashboard/products');
        }}
        type="button"
      >
        Cancel
      </Button>
      <Toaster richColors className=""></Toaster>
    </form>
  );
}

export default EditStockForm;
