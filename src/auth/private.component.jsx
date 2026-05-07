"use client";

import { isLoginVerified } from "@/common/utils/access-token.util";
import {
  CLEERCUT_USER_STORAGE_UPDATED,
  creatorNeedsShowcaseImages,
  isShowcaseUploadAllowedPath,
} from "@/common/utils/creator-showcase.util";
import { getUser } from "@/common/utils/users.util";
import { usePathname, useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import CreatorShowcaseGate from "@/components/showcase-gate/creator-showcase-gate.component";

/**
 * Return the component if access token is verified and return to home page if its not
 * @param {component} props take a component
 * @returns component | redirect to home page
 */
export default function Private({ component }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gateCheck, setGateCheck] = useState(0);
  const router = useRouter();
  const pathname = usePathname() || "";

  useEffect(() => {
    const checkAuth = () => {
      if (!isLoginVerified()) {
        router.push("/login");
        return;
      }
      setIsAuthenticated(true);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const bump = () => setGateCheck((k) => k + 1);
    window.addEventListener("storage", bump);
    window.addEventListener(CLEERCUT_USER_STORAGE_UPDATED, bump);
    return () => {
      window.removeEventListener("storage", bump);
      window.removeEventListener(CLEERCUT_USER_STORAGE_UPDATED, bump);
    };
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  const user = getUser();
  const blockedByShowcase =
    creatorNeedsShowcaseImages(user) && !isShowcaseUploadAllowedPath(pathname);

  if (blockedByShowcase) {
    return <CreatorShowcaseGate key={gateCheck} />;
  }

  return <div className="min-h-0 w-full">{component}</div>;
}

Private.propTypes = {
  component: PropTypes.element.isRequired,
  title: PropTypes.string,
};
