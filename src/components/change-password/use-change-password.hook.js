'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const FormSchema = yup.object().shape({
  pass: yup
    .string()
    .min(8, 'Password must be 8 characters long')
    .matches(/[0-9]/, 'Password requires a number')
    .matches(/[a-z]/, 'Password requires a lowercase letter')
    .matches(/[A-Z]/, 'Password requires an uppercase letter')
    .matches(/[^\w]/, 'Password requires a symbol'),
  confirm: yup
    .string()
    .oneOf([yup.ref('pass'), null], 'Must match "password" field value')
});

export default function useChangePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(FormSchema)
  });
  // hooks
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [loader, setLoader] = useState(false);

  // functions
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const borderStyle = {
    border: '1px solid red'
  };
  const borderSuc = {
    border: '1px solid #E5E6EB'
  };

  useEffect(() => {
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowOldPassword(false);
  }, []);

  const onSubmit = () => {};

  return {
    handleSubmit,
    onSubmit,
    borderStyle,
    borderSuc,
    showOldPassword,
    showConfirmPassword,
    showPassword,
    register,
    errors,
    toggleShowOldPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
    loader
  };
}
