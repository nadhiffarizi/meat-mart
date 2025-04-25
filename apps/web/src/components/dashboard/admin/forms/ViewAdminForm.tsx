'use client';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { api } from '@/helpers/api';
import { IGetUsers } from '@/app/interfaces/user.interface';
import { Alert } from '@/components/ui/alert';
import Link from 'next/link';
import { PenOff } from 'lucide-react';

function ViewAdminForm({ id }: { id: string }) {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [userDetails, setUserDetails] = useState<IGetUsers>();

  useEffect(() => {
    async function getUserData() {
      try {
        const response = await api(
          `admin/users/${id}`,
          'GET',
          {},
          session?.user.access_token,
        );
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

    onSubmit: async (values) => {},
  });
  return (
    <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
      <Alert variant={'affirmative'}>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <div className="text-lg font-semibold">Read Only</div>
            <div className="text-sm">
              Click{' '}
              <Link href={'/dashboard/users'} className="underline">
                here to return to dashboard.
              </Link>{' '}
            </div>
          </div>
          <PenOff className="w-8 h-8" />
        </div>
      </Alert>

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
          disabled={true}
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
          disabled={true}
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
          disabled={true}
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
          disabled={true}
        />
        {formik.touched.phone_number && formik.errors.phone_number && (
          <div className="text-red-500 text-sm">
            {formik.errors.phone_number}
          </div>
        )}
      </div>

      <Button
        variant="link"
        className=" text-primaryText px-4 py-2 text-base "
        onClick={() => {
          router.push('/dashboard/users');
        }}
        type="button"
      >
        Back to Dashboard
      </Button>
    </form>
  );
}

export default ViewAdminForm;
