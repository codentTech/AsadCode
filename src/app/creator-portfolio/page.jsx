'use client';

import Auth from '@/auth/auth.component';
import AUTH from '@/common/constants/auth.constant';
import CreatorPortfolio from '@/components/creator-portfolio/creator-portfolio';

export default function Page() {
  return <Auth component={<CreatorPortfolio />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
