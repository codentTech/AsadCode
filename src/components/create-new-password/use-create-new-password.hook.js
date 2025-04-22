'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { changePasswordFromLink } from '@/provider/features/user/user.slice';

const FormSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, 'Password must be 8 characters long')
    .matches(/[0-9]/, 'Password requires a number')
    .matches(/[a-z]/, 'Password requires a lowercase letter')
    .matches(/[A-Z]/, 'Password requires an uppercase letter')
    .matches(/[^\w]/, 'Password requires a symbol'),
  confirm: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Must match "password" field value')
});
export default function useCreateNewPassword() {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(FormSchema)
  });
  // hooks
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter(null);
  const { password, confirm } = watch();

  // functions
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const borderStyle = {
    border: '1px solid red'
  };
  const borderSuc = {
    border: '1px solid #7E7D7D'
  };

  const onSubmit = async (values) => {
    setLoading(true);
    const params = new URLSearchParams(document.location.search);
    const email = params.get('email');
    const token = params.get('token');
    const data = {
      payload: {
        email,
        password: values.password,
        accessToken: token
      },
      successCallBack: () => router.push('/login')
    };
    const response = await dispatch(changePasswordFromLink(data));
    response && setLoading(false);
  };

  return {
    handleSubmit,
    onSubmit,
    register,
    errors,
    showPassword,
    borderStyle,
    borderSuc,
    toggleShowPassword,
    showConfirmPassword,
    toggleShowConfirmPassword,
    loading,
    password,
    confirm
  };
}
