'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { generateForgetPasswordLink } from '@/provider/features/user/user.slice';

const FormSchema = yup.object().shape({
  email: yup.string().required('Email is required').email('Email is invalid')
});
export default function useForgetPassword() {
  const dispatch = useDispatch();
  const router = useRouter(null);

  // hooks
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(FormSchema)
  });

  const { email } = watch();

  const borderStyle = {
    border: '1px solid #7E7D7D'
  };
  const borderSuc = {
    border: '1px solid #7E7D7D'
  };

  const onSubmit = async (email) => {
    setLoading(true);
    const data = {
      payload: email
    };
    const response = await dispatch(generateForgetPasswordLink(data));
    response && setLoading(false);
  };

  return {
    email,
    handleSubmit,
    onSubmit,
    register,
    errors,
    borderStyle,
    borderSuc,
    loading
  };
}
