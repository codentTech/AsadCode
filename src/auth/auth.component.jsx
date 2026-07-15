"use client";

import { Suspense } from "react";
import PropTypes from "prop-types";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import AuthMainRoutes from "./auth-main-routes.component";
import Private from "./private.component";
import SuperAdmin from "./super-admin.component";

function AuthSuspenseFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-indigo-600" />
    </div>
  );
}

function withSearchParamsSuspense(node) {
  return <Suspense fallback={<AuthSuspenseFallback />}>{node}</Suspense>;
}

/**
 * Return the component according to it's type
 * @param {component, type} props component and type of the component
 * @returns component
 */
export default function Auth({ component, type = AUTH.PUBLIC, title = NAVBAR_TITLE.DOCUMENTS }) {
  switch (type) {
    case AUTH.PUBLIC:
      return withSearchParamsSuspense(component);
    case AUTH.PRIVATE:
      return withSearchParamsSuspense(<Private component={component} title={title} />);
    case AUTH.SUPER_ADMIN:
      return withSearchParamsSuspense(<SuperAdmin component={component} title={title} />);
    case AUTH.AUTH_MAIN_ROUTES:
      return withSearchParamsSuspense(<AuthMainRoutes component={component} />);
    default:
      return withSearchParamsSuspense(component);
  }
}

Auth.propTypes = {
  component: PropTypes.element.isRequired,
  type: PropTypes.string,
  title: PropTypes.string,
};
