'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  checkExpiryDateOfToken,
  isLoginVerified
} from '@/common/utils/access-token.util';
import { getUser, removeUser } from '@/common/utils/users.util';

/**
 * Does all the functionality used in landing page and return it as an object
 * @returns object
 */
export default function useLandingPage() {
  const router = useRouter();
  const user = getUser();
  const [open, setOpen] = useState(false);
  const [auth, setAuth] = useState(false);
  const [loginVerified, setLoginVerified] = useState(false);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setLoginVerified(isLoginVerified(user));
    setLoader(false);
  }, []);

  useEffect(() => {
    if (checkExpiryDateOfToken() !== true) {
      removeUser();
      router.push('/');
    }
  }, []);

  return {
    open,
    setOpen,
    auth,
    setAuth,
    router,
    loader,
    loginVerified,
    setLoginVerified
  };
}
