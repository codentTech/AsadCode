'use client';

import Auth from '@/auth/auth.component';
import AUTH from '@/common/constants/auth.constant';
import TwoFactorAuthComponent from '@/components/two-factor-auth/two-factor-auth.component';

export default function Page() {
  return <Auth component={<TwoFactorAuthComponent />} type={AUTH.PUBLIC} />;
}
