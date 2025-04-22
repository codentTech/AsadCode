'use client';

import Auth from '@/auth/auth.component';
import AUTH from '@/common/constants/auth.constant';
import CreateNewPassword from '@/components/create-new-password/create-new-password.component';

export default function Page() {
  return <Auth component={<CreateNewPassword />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
