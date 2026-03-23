"use client";

import { isLoginVerified } from "@/common/utils/access-token.util";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

/**
 * Return the component if access token is verified and return to home page if its not
 * @param {component} props take a component
 * @returns component | redirect to home page
 */
export default function Private({ component }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

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

  // Only render the component if authenticated
  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return <div>{component}</div>;
}

Private.propTypes = {
  component: PropTypes.element.isRequired,
  title: PropTypes.string,
};
