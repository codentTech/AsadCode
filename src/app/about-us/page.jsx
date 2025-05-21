'use client';

import Auth from '@/auth/auth.component';
import AUTH from '@/common/constants/auth.constant';
import AboutUsPage from '@/components/about-us/about-us.component';

export default function Page() {
  return <Auth component={<AboutUsPage />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
