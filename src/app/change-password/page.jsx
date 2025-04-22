'use client';

import Auth from '@/auth/auth.component';
import AUTH from '@/common/constants/auth.constant';
import ChangePassword from '@/components/change-password/change-password.component';

export default function Page() {
  return <Auth component={<ChangePassword />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
