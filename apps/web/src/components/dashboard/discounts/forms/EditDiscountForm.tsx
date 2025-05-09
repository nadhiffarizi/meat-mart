'use client';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Toaster, toast } from 'sonner';
import { useFormik } from 'formik';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { api } from '@/helpers/api';
import { IGetCategories } from '../../../../app/interfaces/category.interface';
import EditDiscountFormDeleteAlert from './alerts/EditDiscountFormDeleteAlert';
import EditDiscountFormAlert from './alerts/EditDiscountFormAlert';
import { IGetDiscounts } from '@/app/interfaces/discount.interface';
import { IGetDashboardProducts } from '@/app/interfaces/product.dashboard.interface';
import { ProductDropDown } from './ProductsDropDown';

const validationSchema = Yup.object({
  discount_code: Yup.string().required(
    'Please enter a discount code for your discount.',
  ),
  start_date: Yup.date()
    .required('Please select a valid date.')
    .test(
      'is-today-or-after',
      'Start date must be today or anytime after today',
      function (value) {
        if (!value) return false;

        const selectedDate = new Date(value);
        selectedDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return selectedDate >= today;
      },
    ),
  end_date: Yup.date()
    .required('Please select a valid date')
    .test(
      'is-after-start',
      'End date must be on or after the start date',
      function (value) {
        const { start_date } = this.parent;
        return value && start_date && new Date(value) >= new Date(start_date);
      },
    ),
  promotion_type: Yup.mixed<'CUSTOM' | 'MINIMUM_BUY' | 'BOGO'>()
    .oneOf(['CUSTOM', 'MINIMUM_BUY', 'BOGO'])
    .required('Please choose a valid promotion type'),
  product_id: Yup.string().when('promotion_type', {
    is: (val: string) => val === 'CUSTOM' || val === 'BOGO',
    then: (schema) =>
      schema.required('Product is required for this promotion type'),
    otherwise: (schema) => schema.notRequired(),
  }),
  minimum_purchase: Yup.string().when('promotion_type', {
    is: (val: string) => val === 'MINIMUM_BUY',
    then: (schema) =>
      schema.required('Minimum amount is required for this promotion type'),
    otherwise: (schema) => schema.notRequired(),
  }),
  maximum_discount_amount: Yup.string().when('promotion_type', {
    is: (val: string) => val === 'MINIMUM_BUY',
    then: (schema) =>
      schema.required(
        'Maximum discount amount is required for this promotion type',
      ),
    otherwise: (schema) => schema.notRequired(),
  }),
  discount_percentage: Yup.number()
    .min(0, 'Discount percentage must be at least 0%')
    .max(100, 'Discount percentage cannot exceed 100%'),
  discount_amount: Yup.number().min(0, 'Discount amount must be at least 0'),
}).test(
  'discount-exclusive',
  'You must provide either a discount percentage or amount (not both)',
  function (values) {
    const { promotion_type, discount_percentage, discount_amount } =
      values as any;

    if (promotion_type === 'CUSTOM' || promotion_type === 'MINIMUM_BUY') {
      const hasPercentage =
        discount_percentage != null && discount_percentage !== '';
      const hasAmount = discount_amount != null && discount_amount !== '';

      // Only one must be present, and not both
      return (hasPercentage || hasAmount) && !(hasPercentage && hasAmount);
    }

    // For BOGO or others — skip validation
    return true;
  },
);

function EditDiscountForm({
  discountId,
  storeId,
}: {
  discountId: string;
  storeId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams?.get('status');
  const { data: session, update } = useSession();
  const [disabled, setDisabled] = useState(false);
  const [discountDetails, setDiscountDetails] = useState<IGetDiscounts>();
  const [allProducts, setAllProducts] = useState<IGetDashboardProducts[]>([]);

  const handleDiscountPercentageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      const numericValue = value === '' ? '' : Math.min(100, Number(value));
      formik.setFieldValue('discount_percentage', numericValue);
    }
  };

  const handleDiscountAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) || value === '') {
      const numericValue = value === '' ? '' : Math.max(0, Number(value));
      formik.setFieldValue('discount_amount', numericValue);
    }
  };

  const handleMinimumPurchaseChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) || value === '') {
      const numericValue = value === '' ? '' : Math.max(0, Number(value));
      formik.setFieldValue('minimum_purchase', numericValue);
    }
  };

  const handleMaximumDiscountAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) || value === '') {
      const numericValue = value === '' ? '' : Math.max(0, Number(value));
      formik.setFieldValue('maximum_discount_amount', numericValue);
    }
  };

  const handlePromotionTypeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    formik.setFieldValue('promotion_type', e.target.value);

    formik.setFieldValue('product_id', '');
    formik.setFieldValue('minimum_purchase', '');
    formik.setFieldValue('maximum_discount_amount', '');
    formik.setFieldValue('discount_percentage', '');
    formik.setFieldValue('discount_amount', '');
  };

  const handleDiscountCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue('discount_code', e.target.value.toUpperCase());
  };

  useEffect(() => {
    async function getAllProducts() {
      try {
        const allProducts = await api(
          `dashboard/product/all`,
          'GET',
          {},
          session?.user.access_token,
        );
        setAllProducts(allProducts.data);
      } catch (error) {
        console.log(error);
      }
    }
    getAllProducts();
  }, [session?.user.access_token]);

  const sanitizeFormValues = (values: any) => {
    const sanitizedValues = { ...values };

    Object.keys(sanitizedValues).forEach((key) => {
      if (sanitizedValues[key] === '') {
        sanitizedValues[key] = undefined; // Replace empty string with undefined
      }
    });

    return sanitizedValues;
  };

  useEffect(() => {
    async function getDiscountData() {
      try {
        const response = await api(
          `dashboard/discount?id=${discountId}`,
          'GET',
          {},
          session?.user.access_token,
        );
        setDiscountDetails(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getDiscountData();
  }, [discountId, session?.user.access_token]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      discount_code: discountDetails?.discount_code,
      start_date: discountDetails?.start_date
        ? new Date(discountDetails.start_date).toISOString().split('T')[0]
        : '',
      end_date: discountDetails?.end_date
        ? new Date(discountDetails.end_date).toISOString().split('T')[0]
        : '',
      promotion_type: discountDetails?.promotion_type,
      product_id: discountDetails?.product_id,
      minimum_purchase: discountDetails?.minimum_purchase,
      maximum_discount_amount: discountDetails?.maximum_discount_amount,
      discount_percentage: discountDetails?.discount_percentage,
      discount_amount: discountDetails?.discount_amount,
    },
    validationSchema,
    onSubmit: async (values) => {
      const sanitizedValues = sanitizeFormValues(values);
      try {
        setDisabled(true);
        const response = await api(
          `dashboard/discount/${discountId}`,
          'PATCH',
          {
            body: {
              ...sanitizedValues,
              store_id: storeId,
            },
            contentType: 'application/json',
          },
          session?.user.access_token,
        );

        if (response) {
          toast.success(response.message || 'Changes successfully saved!');
          router.push(
            `/dashboard/discounts/store/${storeId}/discount/${discountId}/edit?status=successful`,
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
      <EditDiscountFormAlert status={status} storeId={storeId} />
      <div className="flex flex-col gap-2">
        <label htmlFor="discount_code">
          Discount Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="discount_code"
          id="discount_code"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
          placeholder="xxxx-xxxx-xxxx"
          value={formik.values.discount_code}
          onChange={handleDiscountCodeChange}
          disabled={disabled}
        />
        {formik.touched.discount_code && formik.errors.discount_code && (
          <div className="text-red-500 text-sm">
            {formik.errors.discount_code}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="start_date">
          Start Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="start_date"
          id="start_date"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
          value={formik.values.start_date}
          onChange={formik.handleChange}
        />
        {formik.touched.start_date && formik.errors.start_date && (
          <div className="text-red-500 text-sm">{formik.errors.start_date}</div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="end_date">
          End Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="end_date"
          id="end_date"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
          value={formik.values.end_date}
          onChange={formik.handleChange}
        />
        {formik.touched.end_date && formik.errors.end_date && (
          <div className="text-red-500 text-sm">{formik.errors.end_date}</div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="promotion_type">
          Promotion Type <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="promotion_type"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            custom
            <input
              type="radio"
              name="promotion_type"
              id="promotion_type"
              value="CUSTOM"
              checked={formik.values.promotion_type === 'CUSTOM'}
              onChange={handlePromotionTypeChange}
              disabled={disabled}
            />
          </label>
          <label
            htmlFor="promotion_type"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            minimum buy
            <input
              type="radio"
              name="promotion_type"
              id="promotion_type"
              value="MINIMUM_BUY"
              checked={formik.values.promotion_type === 'MINIMUM_BUY'}
              onChange={handlePromotionTypeChange}
              disabled={disabled}
            />
          </label>
          <label
            htmlFor="promotion_type"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            buy one get one
            <input
              type="radio"
              name="promotion_type"
              id="promotion_type"
              value="BOGO"
              checked={formik.values.promotion_type === 'BOGO'}
              onChange={handlePromotionTypeChange}
              disabled={disabled}
            />
          </label>

          {formik.touched.promotion_type && formik.errors.promotion_type && (
            <div className="text-red-500 text-sm">
              {formik.errors.promotion_type}
            </div>
          )}
        </div>
      </div>

      {(formik.values.promotion_type === 'CUSTOM' ||
        formik.values.promotion_type === 'BOGO') && (
        <div className="flex flex-col gap-2">
          <label htmlFor="product_id">
            Product <span className="text-red-500">*</span>
          </label>
          <ProductDropDown
            value={formik.values.product_id as string}
            onChange={(val) => formik.setFieldValue('product_id', val)}
            allProducts={allProducts}
          />
          {formik.touched.product_id && formik.errors.product_id && (
            <div className="text-red-500 text-sm">
              {formik.errors.product_id}
            </div>
          )}
        </div>
      )}

      {(formik.values.promotion_type === 'CUSTOM' ||
        formik.values.promotion_type === 'MINIMUM_BUY') && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="discount_percentage">
              Discount Percentage <span className="text-red-500">**</span>
            </label>
            <input
              type="number"
              name="discount_percentage"
              id="discount_percentage"
              className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
              value={formik.values.discount_percentage}
              onChange={handleDiscountPercentageChange}
              disabled={disabled}
            />
            {formik.touched.discount_percentage &&
              formik.errors.discount_percentage && (
                <div className="text-red-500 text-sm">
                  {formik.errors.discount_percentage}
                </div>
              )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="discount_amount">
              Discount Amount <span className="text-red-500">**</span>
            </label>
            <input
              type="number"
              name="discount_amount"
              id="discount_amount"
              className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
              value={formik.values.discount_amount}
              onChange={handleDiscountAmountChange}
              disabled={disabled}
            />
            {formik.touched.discount_amount &&
              formik.errors.discount_amount && (
                <div className="text-red-500 text-sm">
                  {formik.errors.discount_amount}
                </div>
              )}
          </div>
          <div>
            {' '}
            <span className="text-red-500">**</span> Please only fill in one of
            these fields
          </div>
        </div>
      )}

      {formik.values.promotion_type === 'MINIMUM_BUY' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="minimum_purchase">
              Minimum Purchase <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="minimum_purchase"
              id="minimum_purchase"
              className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
              value={formik.values.minimum_purchase}
              onChange={handleMinimumPurchaseChange}
              disabled={disabled}
            />
            {formik.touched.minimum_purchase &&
              formik.errors.minimum_purchase && (
                <div className="text-red-500 text-sm">
                  {formik.errors.minimum_purchase}
                </div>
              )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="maximum_discount_amount">
              Maximum Discount Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="maximum_discount_amount"
              id="maximum_discount_amount"
              className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
              value={formik.values.maximum_discount_amount}
              onChange={handleMaximumDiscountAmountChange}
              disabled={disabled}
            />
            {formik.touched.maximum_discount_amount &&
              formik.errors.maximum_discount_amount && (
                <div className="text-red-500 text-sm">
                  {formik.errors.maximum_discount_amount}
                </div>
              )}
          </div>
        </div>
      )}

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

      <EditDiscountFormDeleteAlert
        discountId={discountId}
        storeId={storeId}
        disabled={disabled}
        setDisabled={setDisabled}
      />

      <Button
        variant="link"
        className=" text-primaryText px-4 py-2 text-base "
        onClick={() => {
          router.push(`/dashboard/discounts/store/${storeId}`);
        }}
        type="button"
      >
        Cancel
      </Button>
      <Toaster richColors className=""></Toaster>
    </form>
  );
}

export default EditDiscountForm;
