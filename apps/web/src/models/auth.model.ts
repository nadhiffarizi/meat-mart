/** @format */
import * as Yup from 'yup';
import { E_StoreStatus } from '@prisma/client';

export const registerValidator = Yup.object({
  email: Yup.string().email().required('Email is required'),
  //   password: Yup.string()
  //     .matches(
  //       /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
  //       'Password must contain at least 8 characters, one uppercase, one number and one special case character',
  //     )
  //     // .min(8, 'Password must contain at least 8 characters')
  //     .required('Password is required'),
});

export const PasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export const updateProfileValidator = Yup.object({
  first_name: Yup.string().min(4).required('Name is required'),
  last_name: Yup.string().min(4).required('Name is required'),
});

export const StoreFormSchema = Yup.object().shape({
  name: Yup.string().required('Store name is required'),
  status: Yup.mixed<E_StoreStatus>()
    .oneOf(Object.values(E_StoreStatus))
    .required('Store type is required'),
  address: Yup.string().required('Address is required'),
  province: Yup.string().required('Province is required'),
  city: Yup.string().required('City is required'),
  district: Yup.string().required('District is required'),
  postal_code: Yup.string().required('Postal code is required'),
  latitude: Yup.string().optional(),
  longitude: Yup.string().optional(),
  storeadmin_id: Yup.string().required('Store admin is required'),
});
