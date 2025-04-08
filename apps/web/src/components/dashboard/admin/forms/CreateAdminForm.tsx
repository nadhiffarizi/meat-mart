'use client';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { Toaster, toast } from 'sonner';
import { useFormik } from 'formik';

const validationSchema = Yup.object({
  email: Yup.string().required('(Please enter a valid email)'),
  password: Yup.string().required('(Please enter a password for this account)'),
  firstName: Yup.string().required(
    '(Please enter a first name for this account)',
  ),
  lastName: Yup.string().required(
    '(Please enter a last name for this account)',
  ),
  phoneNumber: Yup.string().required(
    '(Please enter a valid number for this account)',
  ),
});

function CreateAdminForm() {
  const [disabled, setDisabled] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      //add submission logic
    },
  });
  return (
    <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <label htmlFor="email">Email</label>
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          )}
        </div>

        <input
          type="text"
          name="email"
          id="email"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
          placeholder="johndoe@email.com"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <label htmlFor="email">First Name</label>
          {formik.touched.firstName && formik.errors.firstName && (
            <div className="text-red-500 text-sm">
              {formik.errors.firstName}
            </div>
          )}
        </div>
        <input
          type="text"
          name="firstName"
          id="firstName"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4  border border-[#D4D7E3]"
          placeholder="John"
          value={formik.values.firstName}
          onChange={formik.handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <label htmlFor="email">Last Name</label>
          {formik.touched.lastName && formik.errors.lastName && (
            <div className="text-red-500 text-sm">{formik.errors.lastName}</div>
          )}
        </div>
        <input
          type="text"
          name="lastName"
          id="lastName"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4  border border-[#D4D7E3] "
          placeholder="Doe"
          value={formik.values.lastName}
          onChange={formik.handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <label htmlFor="email">Password</label>
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
          )}
        </div>
        <input
          type="text"
          name="password"
          id="password"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4  border border-[#D4D7E3]"
          placeholder="Doe"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <label htmlFor="email">Phone Number</label>
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <div className="text-red-500 text-sm">
              {formik.errors.phoneNumber}
            </div>
          )}
        </div>
        <input
          type="text"
          name="phoneNumber"
          id="phoneNumber"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4  border border-[#D4D7E3]"
          placeholder="1234-5678-9999"
          value={formik.values.phoneNumber}
          onChange={formik.handleChange}
        />
      </div>

      <button
        className={
          disabled
            ? 'text-white bg-secondaryOrange p-4 rounded-[12px]'
            : 'text-white bg-primaryOrange hover:bg-secondaryOrange p-4 rounded-[12px]'
        }
        disabled={disabled}
      >
        {disabled ? 'Adding Employee' : 'Add Employee'}
      </button>
    </form>
  );
}

export default CreateAdminForm;
