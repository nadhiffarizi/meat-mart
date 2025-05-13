'use client';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Toaster, toast } from 'sonner';
import { useFormik } from 'formik';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { api } from '@/helper/api';
import { IGetCategories } from '../../../../interface/product/category.interface';
import EditCategoryFormDeleteAlert from './alerts/EditCategoryFormDeleteAlert';
import EditCategoryFormAlert from './alerts/EditCategoryFormAlert';

const validationSchema = Yup.object({
  name: Yup.string().required('Please enter a name for your category.'),
});

function EditCategoryForm({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams?.get('status');
  const { data: session, update } = useSession();
  const [disabled, setDisabled] = useState(false);
  const [categoryDetails, setCategoryDetails] = useState<IGetCategories>();

  useEffect(() => {
    async function getCategoryData() {
      try {
        const response = await api(
          `category?id=${id}`,
          'GET',
          {},
          session?.user.access_token,
        );
        setCategoryDetails(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getCategoryData();
  }, [id, session?.user.access_token]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: categoryDetails?.name,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setDisabled(true);
        const response = await api(
          `category/${id}`,
          'PATCH',
          {
            body: {
              ...values,
            },
            contentType: 'application/json',
          },
          session?.user.access_token,
        );

        if (response) {
          toast.success(response.message || 'Changes successfully saved!');
          router.push(`/dashboard/categories/${id}/edit?status=successful`);
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
      <EditCategoryFormAlert status={status} />
      <div className="flex flex-col gap-2">
        <label htmlFor="email">
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

      <EditCategoryFormDeleteAlert
        id={id}
        disabled={disabled}
        setDisabled={setDisabled}
      />

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

export default EditCategoryForm;
