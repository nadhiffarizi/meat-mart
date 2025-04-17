/** @format */
import * as Yup from 'yup';

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

export const updateProfileValidator = Yup.object({
  first_name: Yup.string().min(4).required('Name is required'),
  last_name: Yup.string().min(4).required('Name is required'),
});
