"use client";

import { isLoginVerified } from "@/common/utils/access-token.util";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { getUser } from "@/common/utils/users.util";
import ROLES from "@/common/constants/role.constant";

/**
 * Return a component or return to home page if access token is verified
 * @param {component} props
 * @returns component | redirect to home page
 */
export default function AuthMainRoutes({ component }) {
  const router = useRouter();
  const user = getUser();

  useEffect(() => {
    const checkAuth = () => {
      if (isLoginVerified()) {
        router.push(user?.role === ROLES.ADMIN ? "/admin/dashboard" : "/campaign");
        return;
      }
    };

    checkAuth();
  }, [router]);

  return component;
}

AuthMainRoutes.propTypes = {
  component: PropTypes.element.isRequired,
};
