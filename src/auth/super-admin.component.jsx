"use client";

import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { isLoginVerified } from "@/common/utils/access-token.util";
import { isSuperAdmin } from "@/common/utils/users.util";

/**
 * Return the component if access token is verified and return to home page if its not
 * @param {component} props take a component
 * @returns component | redirect to home page
 */
export default function SuperAdmin({ component }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (!isLoginVerified()) {
        router.push("/login");
        return;
      }
      if (!isSuperAdmin()) {
        router.push("/campaign");
        return;
      }
      setIsAuthenticated(true);
    };

    checkAuth();
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  return <div className="min-h-0 w-full">{component}</div>;
}

SuperAdmin.propTypes = {
  component: PropTypes.element.isRequired,
};
