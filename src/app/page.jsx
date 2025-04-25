"use client";

import { checkExpiryDateOfToken } from "@/common/utils/access-token.util";
import { removeUser } from "@/common/utils/users.util";
import ChatInbox from "@/components/chat-inbox/chat-inbox";
import LandingPage from "@/components/landing-page/landing-page.component";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * @returns lazy loaded component for home page
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (checkExpiryDateOfToken() !== true) {
      removeUser();
      router.push("/");
    }
  }, []);

  return <ChatInbox />;
}
