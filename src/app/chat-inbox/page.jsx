'use client';

import Auth from '@/auth/auth.component';
import AUTH from '@/common/constants/auth.constant';
import ChatInbox from '@/components/chat-inbox/chat-inbox';

export default function Page() {
  return <Auth component={<ChatInbox />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
