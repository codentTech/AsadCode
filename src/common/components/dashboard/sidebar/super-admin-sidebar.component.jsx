"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
import DashboardIcon from "@/common/icons/sidebar/dashboard.icon";
import EmployeesIcon from "@/common/icons/sidebar/employee-management/employees.icon";

const sidebarLinks = [
  {
    label: "Dashboard",
    icon: <DashboardIcon />,
    href: "/super-admin/dashboard",
  },
  {
    label: "Administrations",
    icon: null,
    subLinks: [
      {
        lablel: "Business Owner",
        icon: <EmployeesIcon />,
        href: "/super-admin/business-owner",
      },
    ],
  },
];

export default function SuperAdminSidebar({ toggle, setToggle }) {
  const router = usePathname();

  return (
    <div
      className={`${
        toggle ? "open" : ""
      } offcanva fixed z-[9999] h-screen w-[273px] bg-primary-blue bg-hero-pattern bg-right-top bg-no-repeat`}
    >
      <div className="absolute right-1 top-1 z-[9999] rounded-[4px] border-[1px] border-x-secondary-light-blue xs:block semixl:hidden">
        <ChevronLeftIcon
          className="text-white"
          onClick={() => setToggle(!toggle)}
        />
      </div>
      <div className="p-6">
        <Link className="block" href="/dashboard">
          <img
            className="mx-auto block"
            src="/assets/images/sidebar/quickStepLogo.svg"
            alt="logo"
          />
        </Link>
      </div>
      <div className="multistep-wrapper flex flex-col gap-6 pl-6 pr-5">
        {sidebarLinks.map((navLink) => {
          if (navLink.subLinks) {
            return (
              <Accordion
                key={navLink.label}
                className="!before:none !m-0 !bg-primary-blue !shadow-none"
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  className="!m-0 !h-fit !min-h-fit bg-primary-blue !px-0 !py-0"
                >
                  <div className="flex items-center gap-2">
                    {/* <ArrowIcon className="arrow-cotrol" /> */}
                    <span className="font-dm text-base leading-6 text-white">
                      {navLink.label}
                    </span>
                  </div>
                </AccordionSummary>
                <AccordionDetails className="bg-primary-blue !px-0 !py-0">
                  <ul className="mt-2 flex flex-col gap-2">
                    {navLink.subLinks.map((subLink) => {
                      return (
                        <Link
                          key={subLink.lablel}
                          href={subLink.href}
                          className={`nav-link ${
                            router === subLink.href ? "nav-link-select" : ""
                          } cursor-pointer rounded-md px-6 py-2`}
                        >
                          <div className="flex items-center gap-2">
                            {subLink.icon}
                            <span className="font-dm text-base leading-6 text-white">
                              {subLink.lablel}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </ul>
                </AccordionDetails>
              </Accordion>
            );
          } else {
            return (
              <Link
                key={navLink.label}
                href={navLink.href}
                className="mt-7 flex items-center gap-2 px-4 py-2"
              >
                {navLink.icon}
                <span className="font-dm text-sm text-white">
                  {navLink.label}
                </span>
              </Link>
            );
          }
        })}
      </div>
    </div>
  );
}

SuperAdminSidebar.propTypes = {
  toggle: PropTypes.bool.isRequired,
  setToggle: PropTypes.func.isRequired,
};
