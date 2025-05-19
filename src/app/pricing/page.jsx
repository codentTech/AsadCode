'use client';

import Auth from '@/auth/auth.component';
import AUTH from '@/common/constants/auth.constant';
import PricingPage from '@/components/pricing/pricing.component';

export default function Page() {
  return <Auth component={<PricingPage />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
