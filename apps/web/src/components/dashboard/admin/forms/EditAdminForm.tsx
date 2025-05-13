'use client';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Toaster, toast } from 'sonner';
import { useFormik } from 'formik';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { api } from '@/helper/api';
import FormAlert from './Alerts/EditAdminFormAlert';
import EditAdminFormDeleteAlert from './Alerts/EditAdminFormDeleteAlert';
import { IGetUsers } from '@/interface/user/user.interface';

const validationSchema = Yup.object({
  email: Yup.string().required('Please enter a valid email.'),
  password: Yup.string().required('Please enter a new password for this user.'),
  first_name: Yup.string().required('Please enter a first name for this user.'),
  last_name: Yup.string(),
  phone_number: Yup.string().matches(
    /^\d+$/,
    'Please enter a valid phone number for this user.',
  ),
});

function EditAdminForm({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams?.get('status');
  const { data: session, update } = useSession();
  const [disabled, setDisabled] = useState(false);
  const [userDetails, setUserDetails] = useState<IGetUsers>();

  useEffect(() => {
    async function getUserData() {
      try {
        const response = await api(
          `admin/users?id=${id}`,
          'GET',
          {},
          session?.user.access_token,
        );
        console.log('RESPONSE.DATA =>', response.data);
        setUserDetails(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getUserData();
  }, [id, session?.user.access_token]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: userDetails?.email,
      first_name: userDetails?.first_name,
      last_name: userDetails?.last_name,
      password: '',
      phone_number: userDetails?.phone_number,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setDisabled(true);
        const response = await api(
          `admin/users/${id}`,
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
          router.push(`/dashboard/users/${id}/edit?status=successful`);
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
      <FormAlert status={status} />
      <div className="flex flex-col gap-2">
        <label htmlFor="email">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="email"
          id="email"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
          placeholder="johndoe@email.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          disabled={true}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-red-500 text-sm">{formik.errors.email}</div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="first_name">
          First Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="first_name"
          id="first_name"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4  border border-[#D4D7E3]"
          placeholder="John"
          value={formik.values.first_name}
          onChange={formik.handleChange}
          disabled={disabled}
        />
        {formik.touched.first_name && formik.errors.first_name && (
          <div className="text-red-500 text-sm">{formik.errors.first_name}</div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="last_name">Last Name</label>
        <input
          type="text"
          name="last_name"
          id="last_name"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4  border border-[#D4D7E3] "
          placeholder="Doe"
          value={formik.values.last_name}
          onChange={formik.handleChange}
          disabled={disabled}
        />
        {formik.touched.last_name && formik.errors.last_name && (
          <div className="text-red-500 text-sm">{formik.errors.last_name}</div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="password"
          id="password"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4  border border-[#D4D7E3]"
          placeholder="********"
          value={formik.values.password}
          onChange={formik.handleChange}
          disabled={disabled}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-500 text-sm">{formik.errors.password}</div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phone_number">Phone Number</label>
        <input
          type="text"
          name="phone_number"
          id="phone_number"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4  border border-[#D4D7E3]"
          placeholder="0812345678900"
          value={formik.values.phone_number}
          onChange={formik.handleChange}
          disabled={disabled}
        />
        {formik.touched.phone_number && formik.errors.phone_number && (
          <div className="text-red-500 text-sm">
            {formik.errors.phone_number}
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
        type="submit"
      >
        {disabled ? 'Saving Changes' : 'Save Changes'}
      </Button>

      <EditAdminFormDeleteAlert
        id={id}
        disabled={disabled}
        setDisabled={setDisabled}
      />

      <Button
        variant="link"
        className=" text-primaryText px-4 py-2 text-base "
        onClick={() => {
          router.push('/dashboard/users');
        }}
        type="button"
      >
        Cancel
      </Button>
      <Toaster richColors className=""></Toaster>
    </form>
  );
}

export default EditAdminForm;
