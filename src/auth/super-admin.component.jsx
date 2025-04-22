"use client";

import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Navbar from "@/common/components/dashboard/navbar/navbar.component";
import SuperAdminSidebar from "@/common/components/dashboard/sidebar/super-admin-sidebar.component";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import { checkExpiryDateOfToken } from "@/common/utils/access-token.util";
import { isSuperAdmin, removeUser } from "@/common/utils/users.util";

/**
 * Return the component if access token is verified and return to home page if its not
 * @param {component} props take a component
 * @returns component | redirect to home page
 */
export default function SuperAdmin({
  component,
  title = NAVBAR_TITLE.DOCUMENTS,
}) {
  const [toggle, setToggle] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (checkExpiryDateOfToken() !== true) {
      removeUser();
      router.push("/");
    }
    if (!isSuperAdmin()) {
      router.push("/dashboard");
    }
  }, []);

  return (
    <div className="dashboard-main">
      <div className="sidebar relative basis-1/6">
        <SuperAdminSidebar setToggle={setToggle} toggle={toggle} />
      </div>
      <div className="content basis-5/6 bg-secondary-gray">
        <Navbar setToggle={setToggle} value={toggle} title={title} />
        {component}
      </div>
    </div>
  );
}

SuperAdmin.propTypes = {
  component: PropTypes.element.isRequired,
  title: PropTypes.string,
};
