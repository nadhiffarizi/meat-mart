'use client';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { Toaster, toast } from 'sonner';
import { useFormik } from 'formik';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { api } from '@/helpers/api';
import Link from 'next/link';
import { CircleCheckBig } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

const validationSchema = Yup.object({
  name: Yup.string().required('Please enter a name for your category.'),
});

function CreateCategoryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams?.get('status');
  const { data: session, update } = useSession();
  const [disabled, setDisabled] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setDisabled(true);
        const response = await api(
          `category`,
          'POST',
          {
            body: {
              ...values,
            },
            contentType: 'application/json',
          },
          session?.user.access_token,
        );

        if (response) {
          toast.success(response.message || 'Category successfully created!');
          router.push(`/dashboard/categories/new?status=successful`);
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
      {status == 'successful' && (
        <Alert variant={'affirmative'}>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-lg font-semibold">Category Created</div>
              <div className="text-sm">
                Click{' '}
                <Link href={'/dashboard/products'} className="underline">
                  here to return to dashboard.
                </Link>{' '}
              </div>
            </div>
            <CircleCheckBig className="w-8 h-8" />
          </div>
        </Alert>
      )}
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
        {disabled ? 'Adding Category' : 'Add Category'}
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

export default CreateCategoryForm;
