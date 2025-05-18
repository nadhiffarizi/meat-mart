'use client';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Toaster, toast } from 'sonner';
import { useFormik } from 'formik';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { api } from '@/helper/api';
import ReactivateProductFormAlert from './alerts/ReactivateProductFormAlert';
import AddProductFormAlert from './alerts/AddProductFormAlert';
import Image from 'next/image';
import { IGetCategories } from '@/interface/product/category.interface';
import Link from 'next/link';
import IGetDashboardProducts from '@/interface/dashboard/product.dashboard.interface';

const validationSchema = Yup.object({
  name: Yup.string().required('Please enter a name for this product.'),
  price: Yup.number().required('Please set a price for this product.'),
  weight: Yup.number().required('Please enter the unit for your price.'),
  picture: Yup.mixed<File[]>().optional(),
  categories: Yup.array()
    .of(Yup.string())
    .min(1, 'Please select at least one category for your product')
    .required('Please select at least one category for your product.'),
});

function CreateProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams?.get('status');
  const { data: session, update } = useSession();
  const [disabled, setDisabled] = useState(false);
  const [openCategoryRecovery, setOpenCategoryRecovery] = useState(false);
  const [allCategories, setAllCategories] = useState<IGetCategories[]>([]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      formik.setFieldValue('price', value);
    }
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      formik.setFieldValue('weight', value);
    }
  };

  useEffect(() => {
    try {
      async function getAllCategories() {
        const allCategories = await api(
          `dashboard/category/all`,
          'GET',
          {},
          session?.user.access_token,
        );
        setAllCategories(allCategories.data.categories);
      }
      getAllCategories();
    } catch (error) {
      console.log(error);
    }
  }, [session?.user.access_token]);

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      weight: '',
      picture: [] as File[],
      categories: [] as string[],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setDisabled(true);
        try {
          const existingProduct = await api(
            `dashboard/product?name=${values.name}&includeDeleted=true`,
            'GET',
            {},
            session?.user.access_token,
          );
          if ((existingProduct.data as IGetDashboardProducts).deleted_at) {
            setOpenCategoryRecovery(true);
            return;
          }
        } catch (error) {
          console.log(error);
        }

        async function createProduct() {
          const { picture, ...rest } = values;
          const response = await api(
            `dashboard/product`,
            'POST',
            {
              body: {
                ...rest,
                price: parseFloat(values.price),
                weight: parseFloat(values.weight),
              },
              contentType: 'application/json',
            },
            session?.user.access_token,
          );

          if (response) {
            toast.success(response.message || 'Product successfully created!');
            router.push(`/dashboard/products/new?status=successful`);
            return (response.data as IGetDashboardProducts).id;
          } else {
            toast.error(response.message || 'Something went wrong!');
            setDisabled(false);
          }
        }

        const uploadProductPictures = async (
          productId: string,
        ): Promise<string | void> => {
          if (!values.picture.length) return;

          for (let i = 0; i < values.picture.length; i++) {
            const formData = new FormData();
            formData.append('picture', values.picture[i]);

            try {
              const response = await api(
                `dashboard/product/uploadProductPicture/${productId}`,
                'POST',
                {
                  body: formData,
                },
                session?.user.access_token,
              );

              if (!response) {
                console.log(
                  response.message ||
                    'Something went wrong in uploading your pictures!',
                );
              }
            } catch (error) {
              console.error(error);
              toast.error('Something went wrong in uploading your pictures!', {
                duration: Infinity,
                action: {
                  label: 'Dismiss',
                  onClick: () => toast.dismiss(),
                },
              });
              return;
            }
          }
        };

        const productId = await createProduct();
        if (productId) {
          await uploadProductPictures(productId);
        }
      } catch (error: any) {
        toast.error(error.message || 'Something went wrong!');
        setDisabled(false);
      }
    },
  });
  return (
    <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
      <AddProductFormAlert status={status} />
      <ReactivateProductFormAlert
        name={formik.values.name as string}
        setDisabled={setDisabled}
        setOpenCategoryRecovery={setOpenCategoryRecovery}
        openCategoryRecovery={openCategoryRecovery}
      />
      <div className="flex flex-col gap-2">
        <label htmlFor="name">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
          placeholder="Beef"
          value={formik.values.name}
          onChange={formik.handleChange}
          disabled={disabled}
        />
        {formik.touched.name && formik.errors.name && (
          <div className="text-red-500 text-sm">{formik.errors.name}</div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="price">
          Price <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="price"
          id="price"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
          placeholder="20000"
          value={formik.values.price}
          onChange={handlePriceChange}
          disabled={disabled}
        />
        {formik.touched.price && formik.errors.price && (
          <div className="text-red-500 text-sm">{formik.errors.price}</div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="weight">
          Weight <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="weight"
          id="weight"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
          placeholder="10"
          value={formik.values.weight}
          onChange={handleWeightChange}
          disabled={disabled}
        />
        {formik.touched.weight && formik.errors.weight && (
          <div className="text-red-500 text-sm">{formik.errors.weight}</div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="weight">
          Categories <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-col gap-1">
          {allCategories.length ? (
            <></>
          ) : (
            <div>
              Please{' '}
              <Link href={`/dashboard/categories/new`} className="underline">
                create a category
              </Link>{' '}
              before creating your first product.
            </div>
          )}
          {allCategories.map((category) => {
            const isChecked = formik.values.categories.includes(category.id);
            return (
              <label
                key={category.id}
                htmlFor="category"
                className="flex items-center gap-2 whitespace-nowrap"
              >
                {category.name}
                <input
                  type="checkbox"
                  name="categories"
                  id="category"
                  value={category.id}
                  checked={isChecked}
                  onChange={(e) => {
                    const { value, checked } = e.currentTarget;
                    if (checked) {
                      return formik.setFieldValue('categories', [
                        ...formik.values.categories,
                        value,
                      ]);
                    } else {
                      return formik.setFieldValue(
                        'categories',
                        formik.values.categories.filter(
                          (categoryId) => categoryId !== value,
                        ),
                      );
                    }
                  }}
                  disabled={disabled}
                />
              </label>
            );
          })}
          {formik.touched.categories && formik.errors.categories && (
            <div className="text-red-500 text-sm">
              {formik.errors.categories}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="picture">Product Pictures</label>
        <input
          type="file"
          id="picture"
          name="picture"
          multiple
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
          accept="image/*"
          disabled={disabled}
          onChange={(event) => {
            const files = event.currentTarget.files;
            if (files) {
              formik.setFieldValue('picture', [
                ...formik.values.picture,
                ...Array.from(files),
              ]);
            }
          }}
        />

        {formik.touched.picture &&
          typeof formik.errors.picture === 'string' &&
          formik.errors.picture && (
            <div className="text-red-500 text-sm">{formik.errors.picture}</div>
          )}
        {formik.values.picture.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-2">
            {formik.values.picture.map((file, index) => (
              <div key={index} className="relative w-24 h-24">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded border"
                  width={500}
                  height={500}
                />
                <button
                  type="button"
                  onClick={() => {
                    const updatedPictures = formik.values.picture.filter(
                      (values, i) => i !== index,
                    );
                    formik.setFieldValue('picture', updatedPictures);
                  }}
                  disabled={disabled}
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-tr rounded-bl hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
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
        onClick={() => {}}
      >
        {disabled ? 'Adding Product' : 'Add Product'}
      </Button>
      <Button
        variant="link"
        className=" text-primaryText px-4 py-2 text-base "
        onClick={() => {
          router.push('/dashboard/products');
        }}
      >
        Cancel
      </Button>
      <Toaster richColors className=""></Toaster>
    </form>
  );
}

export default CreateProductForm;
