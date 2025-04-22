'use client';

import Auth from '@/auth/auth.component';
import AUTH from '@/common/constants/auth.constant';
import ForgetPassword from '@/components/forget-password/forget-password.component';

export default function Page() {
  return <Auth component={<ForgetPassword />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
